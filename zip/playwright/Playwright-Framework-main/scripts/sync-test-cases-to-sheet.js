import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SERVICE_ACCOUNT_KEY = '/Users/amudhavicky/Downloads/MVP/ai-key-500305-839f56ffb1f2.json';
const SPREADSHEET_ID = '1xdpSDq-dxFok4CYZan0qkzvJu2NjAneqsAWZW7oQhcg';

const CSV_TO_TAB = [
  { file: 'test-cases-admin-portal.csv', tab: 'Admin Portal' },
  { file: 'test-cases-e2e-flows.csv', tab: 'E2E Flows' },
  { file: 'test-cases-application-flows-enhanced.csv', tab: 'App Flows Enhanced' },
  { file: 'test-cases-machine-configuration.csv', tab: 'Machine Config Basic' },
  { file: 'test-cases-machine-configuration-enhanced.csv', tab: 'Machine Config Enhanced' },
  { file: 'test-cases-installation-system.csv', tab: 'Installation System' },
  { file: 'test-cases-installation-system-enhanced.csv', tab: 'Installation System Enhanced' },
  { file: 'test-cases-installation-system-application-flows.csv', tab: 'Installation App Flows' },
  { file: 'test-cases-testweb-portal.csv', tab: 'TestWeb Portal' },
  { file: 'test-cases-rbac.csv', tab: 'RBAC' },
];

const COLUMNS = [
  'Test ID', 'Test Name / Section', 'Priority', 'Role',
  'Precondition', 'Test Steps', 'Expected Result', 'Automated', 'Last Run Status', 'Bug ID',
];

async function getAuth() {
  return new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

// Manual mappings for tests covered under different TC IDs in spec files
const CROSS_ID_MAP = {
  // Admin Portal - covered by admin-login spec
  'TC-ADM-001': 'TC-ADM-LOGIN-01',
  'TC-ADM-002': 'TC-ADM-LOGIN-02',
  'TC-ADM-006': 'TC-AUTH-11',
  'TC-ADM-008': 'TC-AUTH-09',
  'TC-ADM-009': 'TC-AUTH-10',
  'TC-ADM-010': 'TC-ADM-011',
  // Machine Config Enhanced - covered by basic MC tests
  'TC-MC-001': 'TC-MC-01',
  'TC-MC-003': 'TC-MC-02',
  'TC-MC-004': 'TC-MC-17',
  'TC-MC-006': 'TC-MC-16',
  'TC-MC-009': 'TC-MC-03',
  'TC-MC-010': 'TC-MC-04',
  'TC-MC-011': 'TC-MC-05',
  'TC-MC-012': 'TC-MC-06',
  'TC-MC-013': 'TC-MC-07',
  'TC-MC-015': 'TC-MC-08',
  'TC-MC-016': 'TC-MC-09',
  'TC-MC-018': 'TC-MC-10',
  'TC-MC-019': 'TC-MC-11',
  'TC-MC-020': 'TC-MC-12',
  'TC-MC-021': 'TC-MC-13',
  'TC-MC-022': 'TC-MC-14',
  'TC-MC-024': 'TC-MC-15',
  'TC-MC-025': 'TC-MC-15',
  'TC-MC-026': 'TC-MC-15',
  'TC-MC-027': 'TC-MC-15',
  // Installation System - cross-role covered by enhanced individual tests
  'TC-INST-18': 'TC-INST-048',
  // Installation System Enhanced - covered by basic INST tests
  'TC-INST-001': 'TC-INST-01',
  'TC-INST-002': 'TC-INST-02',
  'TC-INST-004': 'TC-INST-03',
  'TC-INST-005': 'TC-INST-04',
  'TC-INST-012': 'TC-INST-06',
  'TC-INST-014': 'TC-INST-07',
  'TC-INST-016': 'TC-INST-08',
  'TC-INST-022': 'TC-INST-09',
  'TC-INST-024': 'TC-INST-10',
  'TC-INST-025': 'TC-INST-12',
  'TC-INST-027': 'TC-INST-13',
  'TC-INST-036': 'TC-INST-14',
  'TC-INST-037': 'TC-INST-15',
  'TC-INST-039': 'TC-INST-16',
  'TC-INST-047': 'TC-INST-20',
  'TC-INST-048': 'TC-INST-18',
  'TC-INST-049': 'TC-INST-18',
  'TC-INST-050': 'TC-INST-18',
  'TC-INST-051': 'TC-INST-18',
  // RBAC - covered by TC-ROLE tests
  'TC-RBAC-001': 'TC-ROLE-001',
  'TC-RBAC-003': 'TC-ROLE-002',
  'TC-RBAC-004': 'TC-ROLE-009',
  'TC-RBAC-005': 'TC-ROLE-008',
  'TC-RBAC-006': 'TC-ROLE-004',
  'TC-RBAC-007': 'TC-ROLE-005',
  'TC-RBAC-008': 'TC-ROLE-006',
  'TC-RBAC-009': 'TC-ROLE-007',
  // App Flows Enhanced - covered by TC-INST-APP in the spec
  'TC-APP-001': 'TC-INST-APP-01',
  'TC-APP-002': 'TC-INST-APP-02',
  'TC-APP-003': 'TC-INST-APP-03',
  'TC-APP-004': 'TC-INST-APP-04',
  'TC-APP-005': 'TC-INST-APP-05',
  'TC-APP-007': 'TC-INST-APP-06',
  'TC-APP-009': 'TC-INST-APP-07',
  'TC-APP-010': 'TC-INST-APP-08',
  'TC-APP-012': 'TC-INST-APP-09',
  'TC-APP-013': 'TC-INST-APP-10',
  'TC-APP-015': 'TC-INST-APP-11',
  'TC-APP-016': 'TC-INST-APP-12',
  'TC-APP-017': 'TC-INST-APP-13',
  'TC-APP-018': 'TC-INST-APP-13',
  'TC-APP-019': 'TC-INST-APP-14',
  'TC-APP-022': 'TC-INST-APP-15',
  'TC-APP-023': 'TC-INST-APP-28',
  'TC-APP-024': 'TC-INST-APP-16',
  'TC-APP-025': 'TC-INST-APP-17',
  'TC-APP-026': 'TC-INST-APP-18',
  'TC-APP-027': 'TC-INST-APP-19',
  'TC-APP-028': 'TC-INST-APP-19',
  'TC-APP-029': 'TC-INST-APP-20',
  'TC-APP-030': 'TC-INST-APP-22',
};

function extractAutomatedIds() {
  const ids = new Set();
  const specDir = join(ROOT, 'tests');
  const files = [];
  function walk(dir) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const p = join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.endsWith('.spec.js')) files.push(p);
    }
  }
  walk(specDir);
  for (const f of files) {
    for (const m of readFileSync(f, 'utf-8').matchAll(/TC-[\w]+(?:-[\w]+)*-[\d]+[a-z]?/gi)) {
      let id = m[0].toUpperCase();
      id = id.replace(/(-\d+)[A-Z]$/, '$1'); // Strip trailing letter suffix (TC-INST-18A → TC-INST-18)
      ids.add(id);
    }
  }
  // Add cross-ID mappings
  for (const [csvId, specId] of Object.entries(CROSS_ID_MAP)) {
    if (ids.has(specId)) ids.add(csvId);
  }
  return ids;
}

function readCSV(filePath) {
  return parse(readFileSync(filePath, 'utf-8'), {
    columns: true, skip_empty_lines: true, relax_column_count: true, relax_quotes: true,
  });
}

function normalizeRow(r) {
  return {
    id: (r['Test ID'] || '').trim(),
    name: r['Section'] || r['Test Name'] || r['Feature'] || '',
    prio: r['Priority'] || '',
    role: r['Role'] || r['Role Fixture'] || '',
    precond: r['Precondition'] || r['Description'] || '',
    steps: r['Test Steps'] || r['Steps'] || '',
    expect: r['Expected Result'] || '',
    csvAuto: (r['Automated'] || '').trim().toLowerCase() === 'yes',
  };
}

function parseBugMappings() {
  const bugsPath = join(ROOT, 'BUGS.md');
  if (!existsSync(bugsPath)) return {};
  const content = readFileSync(bugsPath, 'utf-8');
  const bugMap = {};
  const bugRegex = /## (BUG-\d+)[\s\S]*?- \*\*Test IDs?\*\*: ((?:TC-[\w]+-[\d]+[a-z]?,? ?)+)/gi;
  let match;
  while ((match = bugRegex.exec(content)) !== null) {
    const bugId = match[1];
    const tcIds = match[2].split(',').map(s => s.trim());
    for (const tcId of tcIds) {
      bugMap[tcId.toUpperCase()] = bugId;
    }
  }
  return bugMap;
}

async function ensureTabs(sheets, desired) {
  const existing = (await sheets.spreadsheets.get({ spreadsheetId: SPREADSHEET_ID }))
    .data.sheets.map(s => s.properties.title);
  for (const tab of desired) {
    if (!existing.includes(tab)) {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: { requests: [{ addSheet: { properties: { title: tab } } }] },
      });
      console.log(`  Created tab "${tab}"`);
    }
  }
}

async function writeTab(sheets, tab, rows) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${tab}'!A1`,
    valueInputOption: 'RAW',
    requestBody: { values: [COLUMNS, ...rows] },
  });
}

try {
  console.log('Extracting automated TC IDs from spec files...');
  const automatedIds = extractAutomatedIds();
  console.log(`Found ${automatedIds.size} unique TC IDs in spec files\n`);

  console.log('Parsing BUGS.md for bug mappings...');
  const bugMap = parseBugMappings();
  console.log(`Found ${Object.keys(bugMap).length} bug-to-TC mappings\n`);

  const auth = await getAuth();
  const sheets = google.sheets({ version: 'v4', auth });

  const tabs = CSV_TO_TAB.map(t => t.tab);
  await ensureTabs(sheets, tabs);

  let total = 0;

  for (const { file, tab } of CSV_TO_TAB) {
    const csvPath = join(ROOT, file);
    if (!existsSync(csvPath)) { console.warn(`SKIP: ${file} not found`); continue; }

    const raw = readCSV(csvPath);
    const rows = [];

    for (const r of raw) {
      const n = normalizeRow(r);
      const tcId = n.id.toUpperCase();
      const isAuto = n.csvAuto || automatedIds.has(tcId);
      const bugId = bugMap[tcId] || '';
      rows.push([n.id, n.name, n.prio, n.role, n.precond, n.steps, n.expect, isAuto ? 'Yes' : 'No', '', bugId]);
    }

    await writeTab(sheets, tab, rows);
    total += rows.length;
    console.log(`${tab}: ${rows.length} test cases`);
  }

  console.log(`\nDone! ${total} total test cases written to sheet.`);
} catch (err) {
  console.error('Failed:', err.message);
  process.exit(1);
}
