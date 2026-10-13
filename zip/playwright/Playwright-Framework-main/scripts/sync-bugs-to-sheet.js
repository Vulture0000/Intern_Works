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

async function getAuth() {
  return new GoogleAuth({
    keyFile: SERVICE_ACCOUNT_KEY,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
}

const bugMap = parseBugMappings();
console.log(`Found ${Object.keys(bugMap).length} bug-to-TC mappings`);

const auth = await getAuth();
const sheets = google.sheets({ version: 'v4', auth });

for (const tab of TABS) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SPREADSHEET_ID,
    range: `'${tab}'!A:J`,
  });
  const rows = res.data.values;
  if (!rows || rows.length < 2) continue;

  // Ensure Bug ID column (J) exists
  if (rows[0].length < 10) {
    rows[0].push('Bug ID');
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `'${tab}'!J1`,
      valueInputOption: 'RAW',
      requestBody: { values: [['Bug ID']] },
    });
  }

  let updated = 0;
  const updates = [];
  for (let i = 1; i < rows.length; i++) {
    const tcId = (rows[i][0] || '').toUpperCase();
    const bugId = bugMap[tcId] || '';
    const currentBug = rows[i][9] || '';
    // Set new bug ID or clear stale one
    if ((bugId && currentBug !== bugId) || (!bugId && currentBug)) {
      updates.push({ range: `'${tab}'!J${i + 1}`, values: [[bugId]] });
      updated++;
    }
  }

  if (updates.length > 0) {
    await sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: SPREADSHEET_ID,
      requestBody: { data: updates, valueInputOption: 'RAW' },
    });
    console.log(`${tab}: Updated ${updated} rows`);
  } else {
    console.log(`${tab}: No changes`);
  }
}

console.log('Done!');
