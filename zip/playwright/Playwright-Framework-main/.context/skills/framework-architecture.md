# Framework Architecture

An AI-driven E2E QA automation framework. Engineers write plain-English `.md` instruction files. AI reads them and generates all Page Objects and test specs. Failures are auto-analyzed and filed as Jira bugs.

**Test portals:**
- Admin Portal: https://admin.configurator.dev.pemnet.ai
- Test Web Portal: https://testweb.configurator.dev.pemnet.ai

**Stack:** Playwright · JavaScript (ESM) · AI-assisted generation

---

## Project Layout

```
ai-playwright-framework/
├── .context/                          ← Universal AI knowledge base
│   ├── global/global-context.md       App info, selector rules, coding conventions
│   ├── instructions/
│   │   ├── pages/                     One .md per UI page (elements, selectors, actions)
│   │   └── features/                  One .md per test flow (scenarios, test data)
│   ├── prompts/                       System prompts guiding generation quality
│   │   ├── pom-generator.md
│   │   ├── test-generator.md
│   │   └── failure-analyzer.md
│   └── skills/                        Consolidated LLM-agnostic skill definitions
│       ├── framework-architecture.md  This file
│       ├── automation-rules.md        Pre-automation checklist + workflow
│       ├── pr-description.md          PR description rules
│       └── playwright-best-practices/ Playwright reference (symlinked/imported)
├── src/pages/                         ← AI-generated Page Objects (do NOT edit)
│   ├── base/BasePage.js
│   ├── admin/
│   └── testweb/
├── tests/                             ← AI-generated test specs (do NOT edit)
│   ├── fixtures/
│   │   ├── base.fixture.js
│   │   ├── admin-auth.fixture.js
│   │   ├── web-customer-auth.fixture.js
│   │   ├── web-distributor-auth.fixture.js
│   │   ├── web-engineer-auth.fixture.js
│   │   ├── web-sales-auth.fixture.js
│   │   ├── data-helper.js
│   │   ├── expect-helper.js
│   │   └── step-runner.js
│   ├── admin-login/
│   ├── role-based-access-control/
│   └── ... (feature-based test dirs)
├── test-data/users.json               Test credentials (never hardcode in specs)
├── scripts/                           CLI generation + analysis scripts
├── playwright.config.js
├── AGENTS.md                          Universal LLM entry point
├── .cursorrules                       Cursor config
├── .github/copilot-instructions.md    GitHub Copilot config
├── .claude/                           Thin wrappers (for Claude Code compat)
└── package.json
```

---

## Core Conventions

### Page Object Model Rules
- Every POM class **must extend `BasePage`** (`src/pages/base/BasePage.js`)
- Constructor receives only: `page` (Playwright Page object)
- All selectors defined as `this.elementName = page.locator(...)` in constructor — **never inline inside methods**
- All public methods must be `async`
- **Action methods** (click, fill, navigate) return `this` for chaining
- **Getter methods** (getErrorMessage, getItemCount) return the value, not `this`
- No `expect()` inside Page Objects — assertions belong only in test files
- No `page.waitForTimeout()` — use `locator.waitFor()` only
- Max timeout: 10,000 ms
- Include JSDoc comment above every public method

### Selector Priority (follow this order strictly)
1. `page.getByRole('...', { name: /regex/i })` — always try first
2. `page.getByLabel('...')` — for form fields with visible labels
3. `page.locator('[data-test="..."]')` — explicit test attributes
4. `page.locator('#id')` — last resort only

### Test Spec Rules
- Always import from fixture files — **never** from `@playwright/test` directly
- Use `base.fixture.js` for unauthenticated tests (login flow)
- Use role-specific auth fixtures for authenticated tests
- Load test credentials from `test-data/users.json` — never hardcode
- All tests wrapped in `test.describe()` with a name matching the feature
- Each test must be 100% independent — no shared state between tests
- No `test.only` or `test.skip` in generated output
- Use `step()` from `fixtures/step-runner.js` for test step logging
- Use `assertThat()` from `fixtures/expect-helper.js` for readable assertions

---

## How to Generate a Page Object

1. Read `.context/global/global-context.md`
2. Read the relevant `.context/instructions/pages/<page-name>.md`
3. Follow the system prompt at `.context/prompts/pom-generator.md`
4. Output file: `src/pages/<PageName>.js` — nested in `admin/` or `testweb/` subfolder
5. First line: `import { BasePage } from '../base/BasePage.js';` (adjust relative path)
6. Named export: `export class PageName extends BasePage { ... }`
7. File must end with a blank line

---

## How to Generate a Test Spec

1. Read `.context/global/global-context.md`
2. Read the relevant `.context/instructions/features/<feature-name>.md`
3. Read the relevant generated POM files from `src/pages/`
4. Follow the system prompt at `.context/prompts/test-generator.md`
5. Output file: `tests/<feature-name>/<feature-name>.spec.js`
6. Update `FEATURE_PAGES_MAP` in `scripts/gen-tests.js` if adding a new feature

---

## NPM Commands

| Command | Description |
|---------|-------------|
| `npm test` | Run all tests headless (Chromium) |
| `npm run test:headed` | Run with browser visible |
| `npm run test:ui` | Playwright interactive UI mode |
| `npm run generate` | Generate all POMs + test specs from instructions |
| `npm run gen:pom` | Generate Page Objects only |
| `npm run gen:tests` | Generate test specs only |
| `npm run analyze` | AI analysis of test failures |
| `npm run report:bugs` | Analyze last run + create Jira bug tickets |
| `npm run test:report-bugs` | Run tests + auto-create Jira bugs on failure |
| `npm run report` | Open Playwright HTML report |
| `npm run report:fancy` | Generate custom HTML report from last run |
| `npm run allure:serve` | Generate + open Allure report |

---

## Environment Setup

Required in `.env`:
```
AI_API_KEY=sk-...                      # Provider-specific (Anthropic, OpenAI, etc.)
BASE_URL=https://admin.configurator.dev.pemnet.ai
JIRA_BASE_URL=https://your-domain.atlassian.net
JIRA_EMAIL=your-email@example.com
JIRA_API_TOKEN=...
JIRA_PROJECT_KEY=TP
```
