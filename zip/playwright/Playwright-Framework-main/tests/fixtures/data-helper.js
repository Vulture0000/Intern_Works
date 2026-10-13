import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let _users = null;

/**
 * Load test users from test-data/users.json.
 * Parses once and caches the result for all subsequent calls.
 *
 * @returns {object} users map
 */
export function loadUsers() {
  if (!_users) {
    const filePath = path.join(__dirname, '../../test-data/users.json');
    _users = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }
  return _users;
}
