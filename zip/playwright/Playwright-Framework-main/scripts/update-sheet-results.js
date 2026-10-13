import { readFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { google } from 'googleapis';
import { GoogleAuth } from 'google-auth-library';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const SERVICE_ACCOUNT_KEY = '/Users/amudhavicky/Downloads/MVP/ai-key-500305-839f56ffb1f2.json';
const SPREADSHEET_ID = '1xdpSDq-dxFok4CYZan0qkzvJu2NjAneqsAWZW7oQhcg';

const TABS = [
  'Admin Portal', 'E2E Flows', 'App Flows Enhanced',
  'Machine Config Basic', 'Machine Config Enhanced',
  'Installation System', 'Installation System Enhanced',
  'Installation App Flows', 'TestWeb Portal', 'RBAC',
];

async function getAuth() {
  return new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

function extractResults(resultsPath) {
  if (!existsSync(resultsPath)) {
    console.error(`Results file not found: ${resultsPath}`);
    return {};
  }

  const data = JSON.parse(readFileSync(resultsPath, 'utf-8'));
  const tcMap = {};

  function walk(suite) {
    if (suite.specs) {
      for (const spec of suite.specs) {
        const match = spec.title.match(/(TC-[\w]+(?:-[\w]+)*-[\d]+[a-z]?)/i);
        if (match) {
          let tcId = match[1].toUpperCase();
          tcId = tcId.replace(/(-\d+)[A-Z]$/, '$1'); // Strip trailing letter suffix
          const status = spec.ok ? 'Pass' : 'Fail';
          tcMap[tcId] = status;
        }
      }
    }
    if (suite.suites) {
      for (const s of suite.suites) walk(s);
    }
  }

  for (const suite of data.suites) walk(suite);

  // Also check for skipped tests
  for (const suite of data.suites) {
    function walkSkipped(s) {
      if (s.specs) {
        for (const spec of s.specs) {
          const match = spec.title.match(/(TC-[\w]+(?:-[\w]+)*-[\d]+[a-z]?)/i);
          if (match) {
            let tcId = match[1].toUpperCase();
            tcId = tcId.replace(/(-\d+)[A-Z]$/, '$1'); // Strip trailing letter suffix
            if (!tcMap[tcId]) {
              // Check if all tests were skipped
              const allSkipped = spec.tests && spec.tests.every(t =>
                t.results && t.results.every(r => r.status === 'skipped' || r.status === 'didNotRun')
              );
              if (allSkipped) tcMap[tcId] = 'Skip';
            }
          }
        }
      }
      if (s.suites) s.suites.forEach(walkSkipped);
    }
    walkSkipped(suite);
  }

  // Apply cross-ID mappings (sheet ID → spec ID)
  const CROSS_ID_MAP = {
    'TC-ADM-001': 'TC-ADM-LOGIN-01',
    'TC-ADM-002': 'TC-ADM-LOGIN-02',
    'TC-ADM-006': 'TC-AUTH-11',
    'TC-ADM-008': 'TC-AUTH-09',
    'TC-ADM-009': 'TC-AUTH-10',
    'TC-ADM-010': 'TC-ADM-011',
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
    'TC-INST-18': 'TC-INST-048',
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
    'TC-RBAC-001': 'TC-ROLE-001',
    'TC-RBAC-003': 'TC-ROLE-002',
    'TC-RBAC-004': 'TC-ROLE-009',
    'TC-RBAC-005': 'TC-ROLE-008',
    'TC-RBAC-006': 'TC-ROLE-004',
    'TC-RBAC-007': 'TC-ROLE-005',
    'TC-RBAC-008': 'TC-ROLE-006',
    'TC-RBAC-009': 'TC-ROLE-007',
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
  for (const [sheetId, specId] of Object.entries(CROSS_ID_MAP)) {
    if (tcMap[specId] && !tcMap[sheetId]) {
      tcMap[sheetId] = tcMap[specId];
    }
  }

  return tcMap;
}

async function updateSheet(sheets, tcResults) {
  for (const tab of TABS) {
    // Read current data
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tab}'!A:I`,
    });
    const rows = res.data.values;
    if (!rows || rows.length < 2) continue;

    let updated = 0;
    for (let i = 1; i < rows.length; i++) {
      const tcId = (rows[i][0] || '').toUpperCase();
      if (tcResults[tcId]) {
        rows[i][8] = tcResults[tcId]; // Column I = Last Run Status
        updated++;
      }
    }

    if (updated > 0) {
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `'${tab}'!A1`,
        valueInputOption: 'RAW',
        requestBody: { values: rows },
      });
      console.log(`${tab}: Updated ${updated} test cases`);
    } else {
      console.log(`${tab}: No matching test results`);
    }
  }
}

const resultsPath = join(ROOT, 'reports', 'last-run.json');
console.log(`Reading results from: ${resultsPath}`);
const tcResults = extractResults(resultsPath);
console.log(`Found ${Object.keys(tcResults).length} test results`);

const auth = await getAuth();
const sheets = google.sheets({ version: 'v4', auth });
await updateSheet(sheets, tcResults);
console.log('Sheet update complete!');
