#!/usr/bin/env node
/*
 * Sky Ranking sweep — pilot flight-activity feed.
 *
 * Source: https://simfly.io/api/game/sky-rank?period=<p>&page=<n>&res=100
 * Public, no auth, no cookies. `res` caps at 100; `content.total` gives the row
 * count for paging. The board is ranked by XP — `flightTotal` is the flight
 * count we actually want.
 *
 * SimFly offers exactly four periods: all | month | week | day. Anything else
 * (quarter, 90, year, today…) silently falls back to `all`, so there is no
 * hidden 90-day option — it has to be synthesized here.
 *
 * ── How the 90-day window is synthesized ────────────────────────────────────
 * `flightTotal` under period=all is a monotonic all-time counter, so the number
 * of flights a pilot made between two snapshots is just the difference of their
 * all-time totals. This script keeps a rolling history of daily snapshots
 * (sky-rank-history.json) storing, per pilot, the DELTA at each snapshot date.
 * The 90-day count is then simply the sum of deltas inside the window.
 *
 * That shape is deliberately robust:
 *   • A missed run is self-healing — the next delta spans both days, and the
 *     window sum stays correct.
 *   • A pilot who drops off the board and returns is measured from their last
 *     KNOWN value, not from their array position, so gaps never lose flights.
 *   • A pilot's FIRST snapshot contributes no delta (we don't know what came
 *     before it), which is why each pilot carries their own `qd` day span.
 *
 * Never make the history lossy (weekly sampling, interpolation, or discarding
 * pilots with zero deltas): a dormant pilot reporting a true 0 over 90 days is
 * the single most valuable signal in this feed, and it only exists if their
 * zero-delta history is retained.
 *
 * Outputs:
 *   sky-rank-history.json  working state, delta-encoded, ~92 days retained
 *   sky-rank.json          the small public feed the apps actually read
 */

const https = require('https');
const fs    = require('fs');

const HISTORY_FILE = 'sky-rank-history.json';
const FEED_FILE    = 'sky-rank.json';
const WINDOW_DAYS  = 90;   // nominal synthesized window
const RETAIN_DAYS  = 92;   // keep a couple of spare days so a late run can't clip the window
const RES          = 100;  // API hard cap
const MAX_PAGES    = 60;   // backstop; `all` is ~21 pages at 2k pilots
const PERIODS      = ['all', 'month', 'week', 'day'];

// A truncated read must never be allowed to overwrite good history — the same
// class of failure that poisoned the shared roster gist in the payout pipeline.
const MIN_PILOTS = 500;

function getJsonOnce(path) {
  return new Promise((resolve, reject) => {
    const req = https.get({ hostname: 'simfly.io', path, headers: {
      'User-Agent': 'SimFly-AA-SkyRank/1.0', 'Accept': 'application/json'
    } }, res => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode + ' on ' + path));
        try { resolve(JSON.parse(data)); }
        catch (e) { reject(new Error('Parse error on ' + path + ': ' + data.slice(0, 200))); }
      });
    });
    req.on('error', reject);
    req.setTimeout(30000, () => req.destroy(new Error('Timed out on ' + path)));
  });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

// In-run retry for a single page. A whole sweep is ~43 requests, so a lone
// blip should not cost the day's snapshot — but a genuinely bad page still
// throws, which aborts the run without writing anything, and the hourly
// schedule then retries the whole sweep (see the workflow header).
async function getJson(path, attempts = 3) {
  let last;
  for (let i = 1; i <= attempts; i++) {
    try { return await getJsonOnce(path); }
    catch (e) {
      last = e;
      if (i < attempts) {
        const wait = 2000 * i;
        console.warn(`  ${e.message} — retry ${i}/${attempts - 1} in ${wait}ms`);
        await sleep(wait);
      }
    }
  }
  throw last;
}

// Walk every page of one period. Returns Map(lowercaseUsername -> row).
async function fetchPeriod(period) {
  const out = new Map();
  let total = 0;
  for (let page = 1; page <= MAX_PAGES; page++) {
    const j = await getJson(`/api/game/sky-rank?period=${period}&page=${page}&res=${RES}`);
    const c = (j && j.content) || {};
    const rows = c.ranks || [];
    total = +c.total || 0;
    if (!rows.length) break;
    for (const r of rows) {
      if (!r || !r.username) continue;
      out.set(String(r.username).toLowerCase(), r);
    }
    if (out.size >= total || rows.length < RES) break;
    await sleep(200);
  }
  console.log(`  ${period.padEnd(5)} → ${out.size} pilots (total reported ${total})`);
  return out;
}

const dayKey = d => d.toISOString().slice(0, 10);
const daysBetween = (aKey, bKey) =>
  Math.round((Date.parse(bKey + 'T00:00:00Z') - Date.parse(aKey + 'T00:00:00Z')) / 86400000);

function loadHistory() {
  try {
    const h = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
    if (h && Array.isArray(h.dates) && h.pilots) return h;
  } catch (e) { /* first run, or unreadable — start fresh */ }
  return { version: 1, dates: [], pilots: {} };
}

async function main() {
  // ── Have we already got today? ──────────────────────────────────────────
  // The workflow is scheduled HOURLY but only one snapshot per UTC day is
  // wanted, so the committed history file doubles as the run lock: once today
  // is recorded, every later run that day exits here without touching the
  // network. That is what turns the hourly schedule into "retry until it
  // works" rather than "hammer SimFly 24 times a day" — a failed run writes
  // nothing, so the next hour simply tries again.
  //
  // Consequence worth keeping in mind: the day's sample is taken at the FIRST
  // hour that succeeds. On a normal day that is the 05:20 run, so samples land
  // at a consistent time and the day-over-day deltas line up cleanly.
  const hist  = loadHistory();
  const today = dayKey(new Date());
  const force = process.env.FORCE === '1';
  const haveToday = hist.dates.length && hist.dates[hist.dates.length - 1] === today;
  if (haveToday && !force) {
    console.log(`Snapshot for ${today} is already recorded — nothing to do. (Set FORCE=1 to re-take it.)`);
    return;
  }
  if (haveToday) console.log(`FORCE set — re-taking today's snapshot.`);

  console.log('Fetching sky-rank boards…');
  const boards = {};
  for (const p of PERIODS) boards[p] = await fetchPeriod(p);

  const all = boards.all;
  if (all.size < MIN_PILOTS) {
    throw new Error(`Refusing to write: only ${all.size} pilots on the all-time board (floor ${MIN_PILOTS}). Suspected truncated read.`);
  }

  // ── Roll the history forward one snapshot ────────────────────────────────

  // Only reachable via FORCE (the early exit above catches the normal case).
  // Re-taking a day already recorded REPLACES that day rather than adding a
  // second column, so a forced re-run can never double-count flights.
  const replacing = hist.dates.length && hist.dates[hist.dates.length - 1] === today;
  if (replacing) {
    const popIdx = hist.dates.length - 1;
    hist.dates.pop();
    for (const [key, e] of Object.entries(hist.pilots)) {
      // Introduced by the snapshot being replaced — remove them outright; the
      // rebuild below re-adds them with the correct `first`.
      if (e.first >= popIdx) { delete hist.pilots[key]; continue; }
      if (e.d.length > popIdx - e.first - 1) {
        // `last` MUST be rewound along with the discarded delta. Leaving it at
        // today's total makes the replacement delta compute as v - v = 0, which
        // reads as "flew nothing today" and quietly loses the day.
        e.last -= e.d.pop();
      }
    }
    console.log(`Snapshot for ${today} already present — replacing it.`);
  }
  hist.dates.push(today);
  const idx = hist.dates.length - 1;

  let newPilots = 0;
  for (const [key, row] of all) {
    const v = +row.flightTotal || 0;
    let e = hist.pilots[key];
    if (!e) {
      // first: index of this pilot's first snapshot. last: their last known
      // all-time total, used so a board gap is measured from the right base.
      e = hist.pilots[key] = { u: row.username, first: idx, last: v, d: [] };
      newPilots++;
    }
    e.u = row.username;                       // track display-name changes
    // INVARIANT: after processing snapshot `idx`, e.d holds exactly one delta
    // per snapshot from e.first + 1 through idx, so the delta for snapshot i
    // lives at e.d[i - e.first - 1]. The pad below fills any snapshot this
    // pilot missed in an earlier run; it must stop ONE SHORT of idx's own slot,
    // which the push right after it fills. Padding all the way to idx - e.first
    // inserts a phantom leading zero that shifts every later delta by one and
    // silently drops the newest day from the window.
    while (e.d.length < idx - e.first - 1) e.d.push(0);
    if (idx > e.first) {
      // Clamped at 0: the counter should never go backwards, but a bad read
      // upstream must not be able to subtract flights from the window.
      e.d.push(Math.max(0, v - e.last));
    }
    e.last = v;
  }
  // Pilots absent from this board keep their history but gain a 0 delta, so
  // every array stays aligned with `dates`. Their `last` is deliberately left
  // untouched, so when they reappear the delta is measured from their last
  // KNOWN total and the flights flown while off the board are not lost.
  for (const [key, e] of Object.entries(hist.pilots)) {
    if (all.has(key)) continue;
    while (e.d.length < idx - e.first - 1) e.d.push(0);
    if (idx > e.first) e.d.push(0);
  }

  // ── Prune to the retention window ────────────────────────────────────────
  let drop = 0;
  while (hist.dates.length - drop > 1 &&
         daysBetween(hist.dates[drop], today) > RETAIN_DAYS) drop++;
  if (drop) {
    hist.dates = hist.dates.slice(drop);
    for (const [key, e] of Object.entries(hist.pilots)) {
      const shift = Math.max(0, drop - e.first);
      e.first = Math.max(0, e.first - drop);
      if (shift) e.d = e.d.slice(shift);
      // A pilot whose entire record fell outside the window is dropped; they
      // re-enter as a new pilot if they show up on the board again.
      if (e.first >= hist.dates.length) delete hist.pilots[key];
    }
    console.log(`Pruned ${drop} snapshot(s) older than ${RETAIN_DAYS} days.`);
  }

  const spanDays = hist.dates.length > 1 ? daysBetween(hist.dates[0], today) : 0;

  // ── Build the public feed ───────────────────────────────────────────────
  // Window start = the oldest retained date within WINDOW_DAYS of today.
  let wStart = 0;
  while (wStart < hist.dates.length - 1 &&
         daysBetween(hist.dates[wStart], today) > WINDOW_DAYS) wStart++;

  const num = v => (typeof v === 'number' && isFinite(v)) ? v : 0;
  const pilots = {};
  for (const [key, row] of all) {
    const e = hist.pilots[key];
    let q = 0, qd = 0;
    if (e) {
      // Deltas live at array offset (snapshotIndex - e.first); the pilot's own
      // first snapshot contributes none, hence the max() against e.first + 1.
      const from = Math.max(wStart, e.first + 1);
      for (let i = from; i < hist.dates.length; i++) {
        const dv = e.d[i - e.first - 1];
        if (typeof dv === 'number') q += dv;
      }
      const base = hist.dates[Math.max(wStart, e.first)];
      qd = base ? daysBetween(base, today) : 0;
    }
    pilots[key] = {
      u:  row.username,
      a:  num(+row.flightTotal),                                   // all-time
      m:  num(+(boards.month.get(key) || {}).flightTotal),         // last 30 days
      w:  num(+(boards.week .get(key) || {}).flightTotal),         // last 7 days
      d:  num(+(boards.day  .get(key) || {}).flightTotal),         // last 24 hours
      q,                                                           // synthesized 90-day count
      qd,                                                          // days of history actually backing q
      xp: num(+row.xp),
      r:  num(+row.rank)                                           // all-time XP rank
    };
  }

  fs.writeFileSync(HISTORY_FILE, JSON.stringify(hist));
  fs.writeFileSync(FEED_FILE, JSON.stringify({
    generatedAt: new Date().toISOString(),
    windowDays:  WINDOW_DAYS,
    historyDays: spanDays,
    totalPilots: Object.keys(pilots).length,
    pilots
  }));

  const active30  = Object.values(pilots).filter(p => p.m > 0).length;
  const histBytes = fs.statSync(HISTORY_FILE).size;
  const feedBytes = fs.statSync(FEED_FILE).size;
  console.log(
    `Wrote ${Object.keys(pilots).length} pilots · ${active30} active in last 30d · ` +
    `${newPilots} new · history span ${spanDays}/${WINDOW_DAYS}d over ${hist.dates.length} snapshots · ` +
    `feed ${(feedBytes/1024).toFixed(0)} KB · history ${(histBytes/1024).toFixed(0)} KB`
  );
}

main().catch(e => { console.error('FAILED:', e.message); process.exit(1); });
