import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const groups = JSON.parse(readFileSync(join(__dirname, 'test-groups.json'), 'utf-8')).groups;

const groupName = process.argv[2];
if (!groupName) {
  console.log('Usage:  node scripts/run-group.js "Group Name"');
  console.log('\nAvailable groups:');
  for (const [name, g] of Object.entries(groups)) {
    console.log(`  ${name} — ${g.description}`);
  }
  process.exit(1);
}

const group = groups[groupName];
if (!group) {
  console.error(`Unknown group: "${groupName}"`);
  console.log('Available groups:');
  for (const name of Object.keys(groups)) {
    console.log(`  ${name}`);
  }
  process.exit(1);
}

const args = group.specs.join(' ');
const extraArgs = process.argv.slice(3).join(' ');
const grep = group.grep ? `--grep "${group.grep}"` : '';

console.log(`Running group: ${groupName}`);
console.log(`  Specs: ${group.specs.join(', ')}`);
if (group.grep) console.log(`  Grep:  ${group.grep}`);
if (extraArgs) console.log(`  Extra: ${extraArgs}`);
console.log('');

const cmd = `npx playwright test ${args} ${grep} ${extraArgs}`;
let exitCode = 0;
try {
  execSync(cmd, { stdio: 'inherit', cwd: ROOT });
} catch (e) {
  exitCode = e.status;
}

console.log('\n--- Syncing results to Google Sheet ---');
execSync('node scripts/update-sheet-results.js', { stdio: 'inherit', cwd: ROOT });

process.exit(exitCode);
