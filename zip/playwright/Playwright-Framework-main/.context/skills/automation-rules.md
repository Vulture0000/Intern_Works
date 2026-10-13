# Automation Rules

Before writing a single line of code for a new test case, **must** follow these steps in order.

---

## Pre-Automation Checklist

1. **Read the framework architecture** — `.context/skills/framework-architecture.md` for POM conventions, selector priorities, and project layout
2. **Consult Playwright best practices** — `.agents/skills/playwright-best-practices/SKILL.md` and its reference files:
   - `core/locators.md` — selector priority, chaining, anti-patterns
   - `core/page-object-model.md` — POM structure, composition, factory patterns
   - `core/assertions-waiting.md` — auto-waiting, explicit waits, polling
   - `core/fixtures-hooks.md` — fixture patterns, setup/teardown
   - `core/test-suite-structure.md` — test file organization, describe blocks
   - `debugging/flaky-tests.md` — fixing flaky tests, race conditions, state isolation
   - `testing-patterns/forms-validation.md` — form interaction patterns
3. **Read `.context/global/global-context.md`** — understand current app info, selector rules, coding conventions, pages in scope
4. **Read relevant `.context/instructions/` files** — check if the page or feature already has an instruction file. If yes, read it. If no, create it FIRST
5. **Read the test sheet** — if the user references a Google Sheet URL, fetch and parse it to understand exact test case IDs, descriptions, steps, and expected results. Map each row to a `test()` block
6. **Confirm credentials** — verify all required test accounts exist in `test-data/users.json`. If missing, ask the user before proceeding
7. **Check portal availability** — before writing tests for a portal, run a quick probe to confirm the page loads and renders. If the portal is down, inform the user and do not write failing tests

---

## File Creation Order (NEVER skip steps)

```
Step 1: .context/instructions/pages/<page-name>.md       ← page instruction
Step 2: .context/instructions/features/<feature-name>.md  ← feature instruction
Step 3: src/pages/<PageName>.js                            ← POM (generated)
Step 4: tests/<feature-name>/<feature-name>.spec.js        ← test spec (generated)
Step 5: tests/fixtures/<name>.fixture.js                    ← fixture (if needed)
```

- Page and feature instructions are **source of truth**. Generated files (POMs, tests) are **derived**.
- If a POM, test, or fixture already exists but its corresponding `.md` instruction is missing, **flag this as a deviation** and create the instruction file to match.
- Never edit generated files directly without also updating the instruction file.

---

## Self-Explanatory Assertions

Every assertion must be wrapped in `assertThat()` from `tests/fixtures/expect-helper.js`. Never call `expect()` directly in test code.

```js
import { assertThat } from '../fixtures/expect-helper.js';

// ✅ Good
await assertThat('Sign in should redirect to /users page', () => expect(page).toHaveURL(/\/users/));
```

- Description must be a complete sentence explaining what SHOULD happen, in present tense
- Use `test.step()` for action grouping + `assertThat()` for every assertion
- Never use raw `expect()` outside an `assertThat()` wrapper

---

## Naming Conventions

| Artifact | Convention | Example |
|----------|-----------|---------|
| Page instruction file | `.context/instructions/pages/<kebab-case>.md` | `admin-login-page.md` |
| Feature instruction file | `.context/instructions/features/<kebab-case>.md` | `admin-login-flow.md` |
| Page Object class | `src/pages/<Category>/<PascalCase>.js` | `src/pages/admin/AdminLoginPage.js` |
| Test spec file | `tests/<feature-name>/<feature-name>.spec.js` | `tests/admin-login/admin-login.spec.js` |
| Fixture file | `tests/fixtures/<name>.fixture.js` | `tests/fixtures/admin-auth.fixture.js` |
| Test data | `test-data/<name>.json` | `test-data/users.json` |

---

## Verification Before Declaring Done

Before completing a task:
1. Run `npx playwright test <spec-file> --project=chromium` to verify tests execute
2. Check that screenshots are captured in `test-results/`
3. Confirm no `test.only` or `test.skip` (unless intentionally skipped for unavailable portals)
4. Confirm no hardcoded credentials (all loaded from `test-data/users.json`)
5. Confirm no `page.waitForTimeout()` in POMs
6. Confirm every `expect()` is wrapped in `assertThat()` — grep for `\bexpect\(` and verify no raw uses outside `assertThat` callbacks
7. Generate the fancy report: `npm run report:fancy` and confirm `reports/fancy-report/index.html` exists
