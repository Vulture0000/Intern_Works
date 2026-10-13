# AI Playwright Framework ⚡

> 100% AI-driven QA automation. You write plain-English instructions. AI writes all the code.

**Test portals:**
- Admin Portal: https://admin.configurator.dev.pemnet.ai
- Test Web Portal: https://testweb.configurator.dev.pemnet.ai
**Stack:** Playwright · JavaScript (ESM) · AI-assisted generation

---

## Universal AI Compatibility

This framework is **LLM-agnostic** — works with any AI coding tool:

| Tool | Entry Point |
|------|-------------|
| **Claude Code** | `.claude/` (thin wrappers → `.context/skills/`) |
| **Cursor** | `.cursorrules` |
| **GitHub Copilot** | `.github/copilot-instructions.md` |
| **OpenCode** | `opencode.json` + `.agents/` |
| **Cline / Roo Code** | `AGENTS.md` |
| **Any AI** | `.context/skills/` (plain markdown) |

All knowledge lives in `.context/` — the universal, LLM-agnostic knowledge base.

---

## Quick Start

### 1. Install dependencies
```bash
npm install
npx playwright install
```

### 2. Set up environment
```bash
cp .env.example .env
# Open .env and add your ANTHROPIC_API_KEY
```

### 3. Generate Page Objects + Tests from instructions
```bash
npm run generate
```

### 4. Run the tests
```bash
npm test
```

### 5. View the report
```bash
npm run report
```

---

## Available Commands

| Command | Description |
|---------|-------------|
| `npm run generate` | Generate all POMs + test specs from instructions |
| `npm run gen:pom` | Generate Page Objects only |
| `npm run gen:tests` | Generate test specs only |
| `npm test` | Run all Playwright tests |
| `npm run test:headed` | Run tests in headed browser |
| `npm run test:ui` | Open Playwright UI mode |
| `npm run analyze` | AI analysis of test failures |
| `npm run report:bugs` | Analyse last run + create Jira bug tickets |
| `npm run test:report-bugs` | Run tests + auto-create Jira bugs on failure |
| `npm run full` | Generate everything + run all tests |
| `npm run report` | Open the last HTML report |
| `npm run allure:serve` | Generate + open Allure report |
| `npm run sync:results` | Update Google Sheet with last run results from `reports/last-run.json` |
| `npm run sync:all` | Sync test cases, bugs, and results to Google Sheet |
| `npm run test:group -- "Group Name"` | Run tests for a sheet tab group (auto-syncs results to sheet) |

---

## Auto-Sync to Google Sheet

After any test run, results can be pushed to the Google Sheet automatically:

| Method | How | Auto-sync? |
|--------|-----|------------|
| `node scripts/run-group.js "Group Name"` | Run tests by sheet group | ✅ Yes, auto-syncs |
| `npm run test:sync` | Run all tests | ✅ Yes, auto-syncs |
| `npm test && npm run sync:results` | Run all tests then sync manually | ❌ Must run `sync:results` after |
| `npx playwright test` | Direct Playwright run | ❌ Must run `sync:results` after |

**How it works:** Playwright's JSON reporter writes results to `reports/last-run.json` after every run. The script `scripts/update-sheet-results.js` reads that file and updates the Google Sheet via the Sheets API using the service account key at `/Users/amudhavicky/Downloads/MVP/ai-key-500305-839f56ffb1f2.json`.

The following sheet tabs are updated: Admin Portal, E2E Flows, App Flows Enhanced, Machine Config Basic, Machine Config Enhanced, Installation System, Installation System Enhanced, Installation App Flows, TestWeb Portal, RBAC.

---

## Running Tests by Sheet Group

Tests are grouped to match the Google Sheets tabs. Each group runs only the spec files and TC-IDs belonging to that sheet tab.

```bash
# Usage
npm run test:group -- "Group Name"
# or directly
node scripts/run-group.js "Group Name"

# Pass extra Playwright arguments (e.g. more workers)
node scripts/run-group.js "TestWeb Portal" --workers 6
```

Each group run **automatically syncs results** to the Google Sheet after tests finish.

| Group | Sheet Tab | Description |
|-------|-----------|-------------|
| `Admin Portal` | Admin Portal | All admin portal tests (login, dashboard, settings, datasets, pages, sidebar, email, RBAC) |
| `E2E Flows` | E2E Flows | End-to-end flow tests |
| `App Flows Enhanced` | App Flows Enhanced | Application flows (TC-APP-xxx) |
| `Machine Config Basic` | Machine Config Basic | Machine config (TC-MC-01 to TC-MC-18) |
| `Machine Config Enhanced` | Machine Config Enhanced | Machine config enhanced (TC-MC-001 to TC-MC-031) |
| `Installation System` | Installation System | Installation system basic (TC-INST-01 to TC-INST-20) |
| `Installation System Enhanced` | Installation System Enhanced | Installation system enhanced (TC-INST-001 to TC-INST-060) |
| `Installation App Flows` | Installation App Flows | Installation app flows (TC-INST-APP-xx) |
| `TestWeb Portal` | TestWeb Portal | TestWeb login, register, home, forgot-password, role-based access |
| `RBAC` | RBAC | Role-based access control (admin + testweb) |

**Config file:** `scripts/test-groups.json` — maps each group to spec file globs and grep filters.

---

## Parallel Execution

Tests run **fully parallel** by default — each test gets its own isolated browser context and `page` fixture.

| Setting | Value | Effect |
|---------|-------|--------|
| `fullyParallel` | `true` | Tests within the same spec file run concurrently |
| `workers` | `min(8, CPU cores)` | Up to 8 spec files in parallel |
| `retries` | `1` | Flaky tests retry once before failing |

Override workers per run:
```bash
node scripts/run-group.js "Installation System" --workers 12
```

The only exception is `tests/installation-system/installation-system-application-flows.spec.js` which uses `test.describe.serial` — those tests run in order by design.

---

## How to Add a New Test

### Step 1 — Describe the page
Create `.context/instructions/pages/my-page.md`

### Step 2 — Describe the scenarios
Create `.context/instructions/features/my-feature-flow.md`

### Step 3 — Update the pages map
Add the feature entry to `FEATURE_PAGES_MAP` in `scripts/gen-tests.js`

### Step 4 — Generate
```bash
npm run generate
```

That's it. See `ARCHITECTURE.md` for full details.

---

## Project Structure

```
.context/               ← Universal AI knowledge base (LLM-agnostic .md files)
├── global/             App info, selector rules, coding conventions
├── instructions/       Page + feature instruction files (source of truth)
├── prompts/            AI system prompts for generation
└── skills/             Consolidated skill definitions (works with any LLM)
AGENTS.md               ← Universal entry point (Cline, Roo, etc.)
.cursorrules            ← Cursor config
.github/copilot-instructions.md ← GitHub Copilot config
src/pages/              ← AI-generated (never edit)
tests/                  ← AI-generated (never edit)
tests/fixtures/         ← Shared test fixtures
test-data/              ← Test credentials (you maintain)
scripts/                ← CLI generation + analysis scripts
```

## Current Test Coverage

- **Admin Login** — Happy path + invalid credentials (2 tests)
- **Auth Session Management** — Session persistence, expiry, logout, case-insensitive login (5 tests)
- **Role-Based Access Control** — Access verification for Admin, Sales, Engineer, Customer, Distributor roles across 10 admin routes (10 tests)