#!/usr/bin/env node
/*
 * membership-sweep.js — authoritative "owned + activated" membership pipeline.
 *
 * WHY: the payout/rewards feed only lists airports with a non-zero pilot payout %,
 * so owned+activated airports set to 0% are invisible to it. That feed is a REWARD
 * signal, not a MEMBERSHIP signal. This sweep computes membership from ground truth
 * (the per-airport details endpoint) instead of from payout.
 *
 * MEMBERSHIP IS MONOTONIC. In SimFly an airport is never "unowned" — ownership only
 * TRANSFERS, and activation is permanent. So this pipeline only ever ADDS airports or
 * updates an owner on transfer; it NEVER removes. That is deliberate: it makes the
 * roster strictly non-shrinking, so no bug here can truncate it (the failure that lost
 * 227 airports before). Genuinely bad entries (e.g. a code that 404s) are a MANUAL
 * decision in the KML Generator's Orphaned Entries tab, never automated here.
 *
 * SOURCES (all unauthenticated):
 *   - details:     GET  /api/user/assets/details/airport/{ICAO}  -> {owner, active, category}
 *   - marketplace: GET  /api/user/marketplace?type=airport&page=N  (discovery of new ICAOs)
 *   - existing roster Gist + categories Gist (the current known universe)
 *
 * MODEL:
 *   universe   = roster ICAOs  ∪  categoryDB ICAOs  ∪  marketplace ICAOs
 *   member(a)  = details(a).owner != null  &&  details(a).active == true
 *   For each member: ensure it is in the roster under its current owner (add, or move
 *   on transfer), and fill its category if blank. Non-members and error reads are left
 *   untouched. Invariant enforced before any write: roster never shrinks.
 *
 * WRITES: nothing when DRY_RUN=1 — it just prints what it WOULD do.
 */
'use strict';
const https = require('https');

const OWNER_GIST_ID  = '9cae932383ce289378fff9de8a23f631';
const OWNER_FILENAME = 'SimFlyActivePlayerOwnedAirports.txt';
const CAT_GIST_ID    = 'ea789dd01cf6148900290a9c3af3ca5a';
const CAT_FILENAME   = 'SimFly_Airport_Categories.csv';

const DRY_RUN      = process.env.DRY_RUN === '1';
const REQ_DELAY_MS = Number(process.env.SWEEP_DELAY_MS || 120);   // politeness between detail calls
const SWEEP_MAX    = Number(process.env.SWEEP_MAX || 0);          // >0 caps universe size (testing only)
const MIN_ROSTER   = 600;    // abort if the resulting roster would fall below this
const MAX_ERR_RATE = 0.15;   // abort if more than this fraction of detail reads error

// ── tiny HTTP helpers ───────────────────────────────────────────────────────
function getJson(path) {
  return new Promise((resolve, reject) => {
    https.get({ hostname: 'simfly.io', path, headers: { 'User-Agent': 'SimFly-RT-Sync/1.0' } }, res => {
      let d = '';
      res.on('data', c => (d += c));
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error('HTTP ' + res.statusCode));
        try { resolve(JSON.parse(d)); } catch (e) { reject(new Error('parse: ' + d.slice(0, 80))); }
      });
    }).on('error', reject);
  });
}
function rawGet(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'SimFly-RT-Sync/1.0' } }, res => {
      let d = ''; res.on('data', c => (d += c)); res.on('end', () => resolve(d));
    }).on('error', reject);
  });
}
function patchGist(gistId, filename, content, token) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({ files: { [filename]: { content } } });
    const req = https.request({
      hostname: 'api.github.com', path: `/gists/${gistId}`, method: 'PATCH',
      headers: { 'Authorization': `Bearer ${token}`, 'User-Agent': 'SimFly-RT-Sync/1.0',
        'Accept': 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    }, res => { let d=''; res.on('data',c=>d+=c); res.on('end',()=>resolve(res.statusCode)); });
    req.on('error', reject); req.write(body); req.end();
  });
}
const sleep = ms => new Promise(r => setTimeout(r, ms));

// A roster/CSV read that is a GitHub error page or empty must never be used as a base.
function readLooksBad(txt) {
  const t = (txt || '').trim();
  if (!t) return true;
  if (/^</.test(t)) return true;
  if (/^\d{3}\s*:/.test(t)) return true;
  return /too many requests|you may be scraping|rate limit|terms of service|github-terms/i.test(t.slice(0, 800));
}

// ── parsers ─────────────────────────────────────────────────────────────────
function parseRoster(txt) {
  const owners = new Map();           // key(lowercase) -> {name, icaos:Set}
  for (const raw of txt.split('\n')) {
    const line = raw.trim(); const c = line.indexOf(':');
    if (c < 0) continue;
    const name = line.slice(0, c).trim(); if (!name) continue;
    const key = name.toLowerCase();
    if (!owners.has(key)) owners.set(key, { name, icaos: new Set() });
    line.slice(c + 1).trim().split(/\s+/).filter(Boolean).forEach(ic => owners.get(key).icaos.add(ic.toUpperCase()));
  }
  return owners;
}
function rosterIcaos(owners) { const s = new Set(); for (const o of owners.values()) for (const ic of o.icaos) s.add(ic); return s; }
function serializeRoster(owners) {
  return [...owners.values()].filter(o => o.icaos.size)
    .sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }))
    .map(o => `${o.name}: ${[...o.icaos].sort().join(' ')}`).join('\n') + '\n';
}

async function main() {
  const token = process.env.GIST_PAT;
  if (!DRY_RUN && !token) { console.error('GIST_PAT not set'); process.exit(1); }

  // 1. Load current roster + categories (guarded)
  const rosterTxt = await rawGet(`https://gist.githubusercontent.com/KyndraRocks/${OWNER_GIST_ID}/raw/${OWNER_FILENAME}?t=${Date.now()}`);
  if (readLooksBad(rosterTxt)) { console.error('Roster read looks bad — aborting.'); process.exit(1); }
  const catTxt = await rawGet(`https://gist.githubusercontent.com/KyndraRocks/${CAT_GIST_ID}/raw/${CAT_FILENAME}?t=${Date.now()}`);
  if (readLooksBad(catTxt)) { console.error('Category read looks bad — aborting.'); process.exit(1); }

  const owners = parseRoster(rosterTxt);
  const beforeIcaos = rosterIcaos(owners);

  const catLines = catTxt.split('\n').filter(l => l.trim());
  const catHeader = catLines[0];
  const catCols = catHeader.split(',').length;
  const catRows = new Map();                       // ICAO -> parts[]
  for (let i = 1; i < catLines.length; i++) { const p = catLines[i].split(','); const ic = (p[0]||'').trim().toUpperCase(); if (ic) catRows.set(ic, p); }

  // 2. Discover via marketplace
  const marketIcaos = new Set();
  try {
    const m1 = await getJson('/api/user/marketplace?type=airport&page=1');
    const pages = m1.totalPages || 1;
    const collect = pg => (pg.items || []).forEach(it => { const ic = (it.icao || it.sku || '').toUpperCase(); if (ic) marketIcaos.add(ic); });
    collect(m1);
    for (let p = 2; p <= pages; p++) collect(await getJson('/api/user/marketplace?type=airport&page=' + p));
  } catch (e) { console.error('Marketplace discovery failed (continuing): ' + e.message); }

  // 3. Universe = roster ∪ categoryDB ∪ marketplace
  let universe = [...new Set([...beforeIcaos, ...catRows.keys(), ...marketIcaos])].sort();
  if (SWEEP_MAX > 0) universe = universe.slice(0, SWEEP_MAX);
  console.log(`Universe: ${universe.length} ICAOs (roster ${beforeIcaos.size}, categoryDB ${catRows.size}, marketplace ${marketIcaos.size})`);

  // 4. Sweep details
  const detail = new Map();     // ICAO -> {owner, active, category} on success
  let errors = 0;
  for (let i = 0; i < universe.length; i++) {
    const ic = universe[i];
    try {
      const d = await getJson(`/api/user/assets/details/airport/${encodeURIComponent(ic)}`);
      detail.set(ic, { owner: (d.owner && d.owner.username) || null, active: d.active === true, category: d.category != null ? String(d.category) : null });
    } catch (e) { errors++; }        // unknown — never acted on
    if ((i + 1) % 100 === 0) console.log(`  swept ${i + 1}/${universe.length} (errors ${errors})`);
    await sleep(REQ_DELAY_MS);
  }
  const errRate = universe.length ? errors / universe.length : 1;
  console.log(`Sweep done: ${detail.size} ok, ${errors} errors (${(errRate*100).toFixed(1)}%)`);
  if (errRate > MAX_ERR_RATE) { console.error(`Error rate ${(errRate*100).toFixed(1)}% > ${(MAX_ERR_RATE*100)}% — aborting, no writes.`); process.exit(1); }

  // 5. Apply membership — ADD / TRANSFER ONLY (never remove; membership is monotonic)
  const findOwnerOf = ic => { for (const [k, o] of owners) if (o.icaos.has(ic)) return k; return null; };
  let added = 0, transferred = 0, catAdded = 0;
  const nonMemberSeen = [];

  for (const ic of universe) {
    const d = detail.get(ic);
    if (!d) continue;                                // unknown read — leave as-is
    const isMember = !!d.owner && d.active;
    if (!isMember) { if (beforeIcaos.has(ic)) nonMemberSeen.push(ic); continue; }  // never remove; just note

    const key = d.owner.toLowerCase();
    const prior = findOwnerOf(ic);
    if (prior && prior !== key) {                    // ownership transferred
      owners.get(prior).icaos.delete(ic);
      if (!owners.get(prior).icaos.size) owners.delete(prior);
      transferred++;
    }
    let tgt = owners.get(key);
    if (!tgt) { tgt = { name: d.owner, icaos: new Set() }; owners.set(key, tgt); }
    if (!tgt.icaos.has(ic)) { tgt.icaos.add(ic); if (!prior) added++; }
    if (d.category && !catRows.has(ic)) {            // fill category if absent (never overwrite)
      const p = new Array(catCols).fill(''); p[0] = ic; p[1] = d.category; catRows.set(ic, p); catAdded++;
    }
  }

  // 6. Invariant guard — the roster must never shrink (add/transfer only)
  const afterIcaos = rosterIcaos(owners);
  if (afterIcaos.size < beforeIcaos.size || afterIcaos.size < MIN_ROSTER) {
    console.error(`Roster would go ${beforeIcaos.size} -> ${afterIcaos.size} (shrunk, or < ${MIN_ROSTER}) — impossible for add/transfer-only; aborting, no writes.`);
    process.exit(1);
  }

  console.log(`\nRESULT: roster ${beforeIcaos.size} -> ${afterIcaos.size}  (+${added} added, ${transferred} transferred, categories +${catAdded})`);
  if (added) console.log('  sample added: ' + [...afterIcaos].filter(x => !beforeIcaos.has(x)).slice(0, 12).join(' '));
  if (nonMemberSeen.length) console.log(`  note: ${nonMemberSeen.length} roster airport(s) currently read as non-member (kept, never removed): ${nonMemberSeen.slice(0,12).join(' ')}`);

  if (DRY_RUN) { console.log('\n[DRY_RUN] no writes performed.'); return; }
  if (!added && !transferred && !catAdded) { console.log('No changes to write.'); return; }

  // 7. Writes
  const rs = await patchGist(OWNER_GIST_ID, OWNER_FILENAME, serializeRoster(owners), token);
  if (rs !== 200) { console.error('Roster PATCH failed HTTP ' + rs); process.exit(1); }
  if (catAdded) {
    const newCats = catHeader + '\n' + [...catRows.entries()].sort((a,b)=>a[0].localeCompare(b[0])).map(([,p])=>p.join(',')).join('\n') + '\n';
    const cs = await patchGist(CAT_GIST_ID, CAT_FILENAME, newCats, token);
    if (cs !== 200) console.error('Category PATCH failed HTTP ' + cs);
  }
  console.log('Writes complete.');
}
main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
