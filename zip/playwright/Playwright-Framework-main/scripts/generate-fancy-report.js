/**
 * scripts/generate-fancy-report.js
 *
 * Reads reports/last-run.json from Playwright and generates a standalone
 * fancy HTML report with summary cards, expandable test details,
 * embedded screenshots, step breakdowns, and search/filter.
 *
 * Usage: node scripts/generate-fancy-report.js
 * Output: reports/fancy-report/index.html
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const REPORT_JSON = path.join(rootDir, 'reports/last-run.json');
const OUTPUT_DIR  = path.join(rootDir, 'reports/fancy-report');

if (!fs.existsSync(REPORT_JSON)) {
  console.error('❌ No report found at reports/last-run.json. Run tests first.');
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(REPORT_JSON, 'utf-8'));

// ── Flatten all tests (recursively walk nested suites) ─────────────
const allTests = [];
function walkSuites(suiteOrList, file) {
  const list = Array.isArray(suiteOrList) ? suiteOrList : [suiteOrList];
  for (const s of list) {
    const suiteFile = s.file || file;
    for (const spec of s.specs || []) {
      for (const test of spec.tests || []) {
        const result = test.results?.[0] || {};
        const steps = flattenSteps(result.steps || []);
        const statusMap = { expected: 'passed', unexpected: 'failed', skipped: 'skipped' };
        allTests.push({
          id:       test.id || `${suiteFile}::${spec.title}`,
          title:    spec.title,
          file:     suiteFile,
          project:  test.projectName,
          status:   statusMap[test.status] || test.status || 'unknown',
          duration: result.duration || 0,
          error:    result.error,
          steps,
          attachments: result.attachments || [],
          retry:    result.retry || 0,
        });
      }
    }
    if (s.suites?.length) walkSuites(s.suites, suiteFile);
  }
}
walkSuites(raw.suites);

function flattenSteps(steps, prefix = '') {
  const flat = [];
  for (const s of steps) {
    flat.push({ title: prefix + s.title, duration: s.duration, error: s.error });
    if (s.steps?.length) flat.push(...flattenSteps(s.steps, prefix + '  '));
  }
  return flat;
}

// ── Stats ──────────────────────────────────────────────────────────
const total     = allTests.length;
const passed    = allTests.filter(t => t.status === 'passed').length;
const failed    = allTests.filter(t => t.status === 'failed' || t.status === 'timedOut').length;
const skipped   = allTests.filter(t => t.status === 'skipped').length;
const totalDur  = allTests.reduce((s, t) => s + t.duration, 0);
const passRate  = total ? Math.round((passed / total) * 100) : 0;
const failCount = failed;

function fmtDur(ms) {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  const m = Math.floor(ms / 60000);
  const s = Math.round((ms % 60000) / 1000);
  return `${m}m ${s}s`;
}

// ── Build HTML ─────────────────────────────────────────────────────
const testRows = allTests.map(t => {
  const statusIcon = t.status === 'passed'  ? '✅' : t.status === 'failed' || t.status === 'timedOut' ? '❌' : '⏭️';
  const screenshot = t.attachments.find(a => /\.png$/i.test(a.path || a.name));
  const screenshotHtml = screenshot
    ? `<div class="screenshot"><img src="${path.relative(OUTPUT_DIR, path.resolve(rootDir, screenshot.path))}" onclick="this.classList.toggle('expanded')" /></div>`
    : '';
  const video = t.attachments.find(a => /\.webm$/i.test(a.path || a.name));
  const videoHtml = video
    ? `<div class="video-wrap"><video src="${path.relative(OUTPUT_DIR, path.resolve(rootDir, video.path))}" controls preload="metadata" onclick="this.classList.toggle('expanded')"></video></div>`
    : '';
  const errorHtml = t.error
    ? `<div class="error-block"><strong>${t.error.message || ''}</strong><pre>${escapeHtml(t.error.stack || '')}</pre></div>`
    : '';
  const stepsHtml = t.steps.length
    ? `<details class="steps"><summary>Steps (${t.steps.length})</summary><ul>${
        t.steps.map(s => `<li>${escapeHtml(s.title)} <span class="dur">${fmtDur(s.duration)}</span>${s.error ? ' ❌' : ''}</li>`).join('')
      }</ul></details>`
    : '';

  return `<tr class="test-row status-${t.status}" data-status="${t.status}">
    <td>${statusIcon}</td>
    <td class="status-badge ${t.status}">${t.status}</td>
    <td class="test-title">${escapeHtml(t.title)}
      <div class="test-meta">${escapeHtml(t.file)} @ ${t.project}</div>
    </td>
    <td>${fmtDur(t.duration)}</td>
    <td>${stepsHtml}${errorHtml}${screenshotHtml}${videoHtml}</td>
  </tr>`;
}).join('');

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Test Report — AI Playwright Framework</title>
<style>
  :root {
    --bg: #0f172a; --bg2: #1e293b; --bg3: #334155;
    --text: #e2e8f0; --muted: #94a3b8;
    --green: #22c55e; --red: #ef4444; --yellow: #eab308; --blue: #3b82f6;
    --card: #1e293b; --border: #334155;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    background: var(--bg); color: var(--text); padding: 24px; line-height: 1.5;
  }
  .container { max-width: 1400px; margin: 0 auto; }

  /* Header */
  .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
  .header h1 { font-size: 28px; font-weight: 700; }
  .header .subtitle { color: var(--muted); font-size: 14px; margin-top: 4px; }
  .header .ts { color: var(--muted); font-size: 13px; }

  /* Summary cards */
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px; margin-bottom: 32px; }
  .card {
    background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 20px;
    text-align: center; transition: transform .15s;
  }
  .card:hover { transform: translateY(-2px); }
  .card .num { font-size: 36px; font-weight: 800; }
  .card .label { font-size: 13px; color: var(--muted); margin-top: 4px; text-transform: uppercase; letter-spacing: .5px; }
  .card.total .num { color: var(--text); }
  .card.passed .num { color: var(--green); }
  .card.failed .num { color: var(--red); }
  .card.skipped .num { color: var(--yellow); }
  .card.rate .num { color: var(--blue); }
  .card.duration .num { color: var(--blue); font-size: 24px; }

  /* Donut */
  .chart-wrap { display: flex; justify-content: center; margin-bottom: 32px; gap: 32px; align-items: center; flex-wrap: wrap; }
  .donut { width: 120px; height: 120px; position: relative; }
  .donut svg { transform: rotate(-90deg); }
  .donut .center { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 24px; font-weight: 800; }
  .legend { display: flex; gap: 20px; flex-wrap: wrap; }
  .legend-item { display: flex; align-items: center; gap: 6px; font-size: 14px; }
  .legend-dot { width: 12px; height: 12px; border-radius: 50%; display: inline-block; }

  /* Filters */
  .filters { display: flex; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
  .filters button {
    padding: 6px 16px; border: 1px solid var(--border); border-radius: 20px;
    background: var(--bg2); color: var(--text); cursor: pointer; font-size: 13px; transition: all .15s;
  }
  .filters button:hover { background: var(--bg3); }
  .filters button.active { background: var(--blue); border-color: var(--blue); color: #fff; }
  .search-box { flex: 1; min-width: 200px; }
  .search-box input {
    width: 100%; padding: 8px 14px; border: 1px solid var(--border); border-radius: 20px;
    background: var(--bg2); color: var(--text); font-size: 14px; outline: none;
  }
  .search-box input:focus { border-color: var(--blue); }

  /* Table */
  .table-wrap { background: var(--card); border: 1px solid var(--border); border-radius: 12px; overflow: hidden; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 12px 16px; font-size: 12px; text-transform: uppercase; color: var(--muted); letter-spacing: .5px; border-bottom: 1px solid var(--border); background: var(--bg2); }
  td { padding: 14px 16px; border-bottom: 1px solid var(--border); vertical-align: top; }
  tr:last-child td { border-bottom: none; }
  tr.status-failed { --row-bg: rgba(239,68,68,.06); background: var(--row-bg); }
  tr.status-timedOut { --row-bg: rgba(239,68,68,.06); background: var(--row-bg); }
  tr.status-skipped { opacity: .6; }

  .status-badge {
    display: inline-block; padding: 2px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: capitalize;
  }
  .status-badge.passed { background: rgba(34,197,94,.15); color: var(--green); }
  .status-badge.failed, .status-badge.timedOut { background: rgba(239,68,68,.15); color: var(--red); }
  .status-badge.skipped { background: rgba(234,179,8,.15); color: var(--yellow); }

  .test-title { font-weight: 600; font-size: 15px; }
  .test-meta { font-weight: 400; font-size: 12px; color: var(--muted); margin-top: 2px; }

  details.steps { margin: 4px 0; }
  details.steps summary { cursor: pointer; color: var(--blue); font-size: 13px; }
  details.steps ul { margin: 6px 0 0 16px; font-size: 13px; color: var(--muted); list-style: none; }
  details.steps li { padding: 2px 0; }
  details.steps .dur { color: var(--muted); font-size: 11px; }

  .error-block {
    margin: 8px 0; padding: 10px 14px; background: rgba(239,68,68,.08);
    border-left: 3px solid var(--red); border-radius: 6px; font-size: 13px;
  }
  .error-block strong { color: var(--red); display: block; margin-bottom: 4px; }
  .error-block pre {
    font-family: 'SF Mono', 'Fira Code', monospace; font-size: 12px; color: var(--muted);
    white-space: pre-wrap; max-height: 200px; overflow-y: auto;
  }

  .screenshot img, .video-wrap video {
    max-width: 200px; max-height: 120px; border-radius: 6px; cursor: pointer;
    border: 1px solid var(--border); transition: all .2s; margin-top: 6px;
  }
  .screenshot img.expanded, .video-wrap video.expanded { max-width: 100%; max-height: 600px; }

  .empty { text-align: center; padding: 40px; color: var(--muted); }

  .footer { text-align: center; padding: 32px 0 8px; color: var(--muted); font-size: 12px; }

  @media (max-width: 768px) {
    body { padding: 12px; }
    .header h1 { font-size: 22px; }
    .cards { grid-template-columns: repeat(2, 1fr); }
    td { padding: 10px 12px; }
    .test-title { font-size: 14px; }
  }
</style>
</head>
<body>
<div class="container">

<div class="header">
  <div>
    <h1>🧪 Test Report</h1>
    <div class="subtitle">AI Playwright Framework · PEMnet Configurator</div>
  </div>
  <div class="ts">${new Date().toLocaleString()} · ${total} tests</div>
</div>

<div class="cards">
  <div class="card total"><div class="num">${total}</div><div class="label">Total</div></div>
  <div class="card passed"><div class="num">${passed}</div><div class="label">Passed</div></div>
  <div class="card failed"><div class="num">${failed}</div><div class="label">Failed</div></div>
  <div class="card skipped"><div class="num">${skipped}</div><div class="label">Skipped</div></div>
  <div class="card rate"><div class="num">${passRate}%</div><div class="label">Pass Rate</div></div>
  <div class="card duration"><div class="num">${fmtDur(totalDur)}</div><div class="label">Total Duration</div></div>
</div>

<div class="chart-wrap">
  <div class="donut">
    <svg width="120" height="120" viewBox="0 0 120 120">
      <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg3)" stroke-width="16"/>
      ${total ? `<circle cx="60" cy="60" r="50" fill="none" stroke="var(--green)" stroke-width="16"
        stroke-dasharray="${(passed/total)*314} ${314-(passed/total)*314}" stroke-linecap="round"/>` : ''}
      ${total ? `<circle cx="60" cy="60" r="50" fill="none" stroke="var(--red)" stroke-width="16"
        stroke-dasharray="${(failed/total)*314} ${314-(failed/total)*314}"
        stroke-dashoffset="${-(passed/total)*314}" stroke-linecap="round"/>` : ''}
    </svg>
    <div class="center">${passRate}%</div>
  </div>
  <div class="legend">
    <span class="legend-item"><span class="legend-dot" style="background:var(--green)"></span> Passed ${passed}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--red)"></span> Failed ${failed}</span>
    <span class="legend-item"><span class="legend-dot" style="background:var(--yellow)"></span> Skipped ${skipped}</span>
  </div>
</div>

<div class="filters">
  <button class="active" data-filter="all" onclick="filter('all')">All</button>
  <button data-filter="passed" onclick="filter('passed')">✅ Passed</button>
  <button data-filter="failed" onclick="filter('failed')">❌ Failed</button>
  <button data-filter="timedOut" onclick="filter('failed')">⏰ Timed Out</button>
  <button data-filter="skipped" onclick="filter('skipped')">⏭️ Skipped</button>
  <div class="search-box"><input type="text" placeholder="Search tests..." oninput="search(this.value)"/></div>
</div>

<div class="table-wrap">
  <table>
    <thead><tr>
      <th style="width:30px"></th>
      <th style="width:90px">Status</th>
      <th>Test</th>
      <th style="width:80px">Duration</th>
      <th>Details</th>
    </tr></thead>
    <tbody id="test-body">
      ${testRows || '<tr><td colspan="5" class="empty">No test results found.</td></tr>'}
    </tbody>
  </table>
</div>

<div class="footer">Generated by AI Playwright Framework · <a href="https://github.com/anomalyco/opencode" style="color:var(--blue)">opencode</a></div>
</div>

<script>
function filter(status) {
  document.querySelectorAll('.filters button').forEach(b => b.classList.toggle('active', b.dataset.filter === status));
  document.querySelectorAll('.test-row').forEach(r => {
    if (status === 'all') { r.style.display = ''; return; }
    const matches = r.dataset.status === status;
    r.style.display = matches ? '' : 'none';
  });
}
function search(val) {
  const q = val.toLowerCase();
  document.querySelectorAll('.test-row').forEach(r => {
    const title = r.querySelector('.test-title')?.textContent?.toLowerCase() || '';
    r.style.display = title.includes(q) ? '' : 'none';
  });
}
</script>
</body>
</html>`;

fs.mkdirSync(OUTPUT_DIR, { recursive: true });
fs.writeFileSync(path.join(OUTPUT_DIR, 'index.html'), html, 'utf-8');
console.log(`✅ Fancy report generated: reports/fancy-report/index.html`);
