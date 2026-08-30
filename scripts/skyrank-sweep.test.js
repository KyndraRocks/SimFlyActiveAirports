// Test harness for skyrank-sweep.js.  Run with:  node scripts/skyrank-sweep.test.js
//
// Drives the REAL sweep across simulated days by stubbing https.get (core
// modules are cached singletons, so mutating it here is what the script sees)
// and the clock. No network, no repo writes — it works in a temp directory.
//
// This exists because the 90-day window is synthesized from day-over-day
// deltas, and that arithmetic is easy to get subtly wrong in ways no amount of
// eyeballing catches. Two real bugs were caught here rather than in review:
//   * delta padding that ran one slot too far, inserting a phantom leading
//     zero that shifted every pilot's array and silently dropped the newest day
//   * a same-day re-run that popped the snapshot without rewinding `last`, so
//     the replacement delta computed as v - v = 0 and lost the day
//
// If you touch the history/delta logic, run this first.
// Drives the REAL scripts/skyrank-sweep.js across simulated days by stubbing
// https.get (core modules are cached singletons, so mutating it here is what
// the script sees) and the clock. Verifies the synthesized 90-day window.
const https = require('https');
const fs    = require('fs');
const path  = require('path');
const { EventEmitter } = require('events');

const SCRIPT = path.resolve(__dirname, 'skyrank-sweep.js');
const WORK   = path.resolve(require('os').tmpdir(), 'skyrank-sweep-test');
fs.rmSync(WORK, { recursive: true, force: true });
fs.mkdirSync(WORK, { recursive: true });
process.chdir(WORK);

// ── clock ──────────────────────────────────────────────────────────────────
const RealDate = Date;
let FAKE_NOW = RealDate.parse('2026-01-01T12:00:00Z');
global.Date = class extends RealDate {
  constructor(...a) { if (!a.length) super(FAKE_NOW); else super(...a); }
  static now() { return FAKE_NOW; }
};

// ── board fixture ──────────────────────────────────────────────────────────
// board[day] = { username: {all, month, week, day} }  (absent = off the board)
let BOARD = {};
let NET = 0;
https.get = (opts, cb) => {
  NET++;
  const u = new URL('https://simfly.io' + opts.path);
  const period = u.searchParams.get('period');
  const page   = +u.searchParams.get('page');
  const rows = page > 1 ? [] : Object.entries(BOARD).map(([username, v], i) => ({
    rank: i + 1, username, xp: 100 - i,
    flightTotal: period === 'all' ? v.all : (v[period] || 0)
  }));
  const res = new EventEmitter();
  res.statusCode = 200;
  process.nextTick(() => {
    cb(res);
    res.emit('data', JSON.stringify({ success: true, content: { ranks: rows, total: rows.length } }));
    res.emit('end');
  });
  // Stand-in for http.ClientRequest: the sweep arms a socket timeout on it.
  const req = new EventEmitter();
  req.setTimeout = () => req;
  req.destroy = () => {};
  return req;
};

// The script's floor rejects small boards; pad with filler pilots.
const FILLER = {};
for (let i = 0; i < 600; i++) FILLER['filler' + i] = { all: 0, month: 0, week: 0, day: 0 };

async function runDay(iso, board, force) {
  FAKE_NOW = RealDate.parse(iso + 'T12:00:00Z');
  BOARD = { ...board, ...FILLER };
  if (force) process.env.FORCE = '1'; else delete process.env.FORCE;
  delete require.cache[require.resolve(SCRIPT)];
  const exitSpy = process.exit;
  let failed = null;
  process.exit = c => { failed = c; };
  const logSpy = console.log; console.log = () => {};
  require(SCRIPT);
  await new Promise(r => setTimeout(r, 60));
  console.log = logSpy; process.exit = exitSpy;
  if (failed) throw new Error('script exited ' + failed);
  return JSON.parse(fs.readFileSync('sky-rank.json', 'utf8'));
}

// ── scenario ───────────────────────────────────────────────────────────────
// steady: flies every day. gap: vanishes from the board mid-window.
// latecomer: first appears on day 3. dormant: on the board, never flies.
const days = [
  ['2026-01-01', { steady:{all:100}, gap:{all:50}, dormant:{all:900} }],
  ['2026-01-02', { steady:{all:103}, gap:{all:52}, dormant:{all:900} }],
  ['2026-01-03', { steady:{all:105}, gap:{all:55}, dormant:{all:900}, latecomer:{all:700} }],
  ['2026-01-04', { steady:{all:109},               dormant:{all:900}, latecomer:{all:704} }], // gap off board
  ['2026-01-05', { steady:{all:112}, gap:{all:61}, dormant:{all:900}, latecomer:{all:709} }], // gap returns
];

(async () => {
  let feed;
  for (const [iso, board] of days) feed = await runDay(iso, board);

  const P = feed.pilots;
  const check = (label, got, want) =>
    console.log(`${got === want ? '  PASS' : '  FAIL'}  ${label.padEnd(42)} got ${got}  want ${want}`);

  console.log('\n5 daily snapshots, 2026-01-01 → 2026-01-05\n');
  console.log(`historyDays = ${feed.historyDays}`);

  // steady: 100→112, first snapshot contributes no delta → 12 flights over 4 days
  check('steady   q (flights since first snapshot)', P.steady.q, 12);
  check('steady   qd (days of history)',             P.steady.qd, 4);

  // gap: 50→61 with day 4 missing entirely. Deltas measured from LAST KNOWN
  // value, so the 55→61 jump is credited in full: 11 flights, no loss.
  check('gap      q survives a board gap',           P.gap.q, 11);
  check('gap      qd unaffected by the gap',         P.gap.qd, 4);

  // latecomer: first seen day 3 at 700, now 709 → 9 flights over 2 days
  check('latecomer q from its own first snapshot',   P.latecomer.q, 9);
  check('latecomer qd is its OWN span, not global',  P.latecomer.qd, 2);

  // dormant: present the whole window, never flew
  check('dormant  q is a true zero',                 P.dormant.q, 0);
  check('dormant  qd is the full span',              P.dormant.qd, 4);

  // Same-day re-run must replace, not double-count.
  const again = await runDay('2026-01-05', days[4][1]);
  check('re-run same day does not double count',     again.pilots.steady.q, 12);
  check('re-run same day keeps historyDays',         again.historyDays, 4);

  // Pruning: jump past the retention window.
  const far = await runDay('2026-06-01', { steady:{all:500}, dormant:{all:900} });
  const hist = JSON.parse(fs.readFileSync('sky-rank-history.json', 'utf8'));
  check('prune drops snapshots past retention',      hist.dates.length, 1);
  check('prune resets q (no history in window)',     far.pilots.steady.q, 0);

  // ── hourly-retry behaviour ───────────────────────────────────────────────
  // A second run on the same day must exit BEFORE any network call, so the
  // hourly schedule costs one sweep per day rather than 24.
  const before = NET;
  await runDay('2026-06-01', { steady:{all:600}, dormant:{all:900} });
  check('same-day re-run makes zero requests',       NET - before, 0);
  const feedAfterSkip = JSON.parse(fs.readFileSync('sky-rank.json','utf8'));
  check('same-day re-run leaves the feed untouched', feedAfterSkip.pilots.steady.a, 500);

  // FORCE must still get through and pick up the newer numbers.
  const forced = await runDay('2026-06-01', { steady:{all:600}, dormant:{all:900} }, true);
  check('FORCE re-takes the snapshot',               forced.pilots.steady.a, 600);
  check('FORCE still makes requests',                NET > before, true);
  const h2 = JSON.parse(fs.readFileSync('sky-rank-history.json','utf8'));
  check('FORCE does not add a second column',        h2.dates.length, 1);

  // A NEW day must proceed normally after a skipped day.
  const next = await runDay('2026-06-02', { steady:{all:610}, dormant:{all:900} });
  check('next day resumes and counts the delta',     next.pilots.steady.q, 10);
})();
