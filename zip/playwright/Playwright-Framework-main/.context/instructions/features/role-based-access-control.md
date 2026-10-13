# Role-Based Access Control

## Fixture
- Use `base.fixture.js` for unauthenticated tests
- Use `admin-auth.fixture.js` for admin authenticated tests
- Use `web-engineer-auth.fixture.js`, `web-customer-auth.fixture.js`, `web-distributor-auth.fixture.js`, `web-sales-auth.fixture.js` for test web authenticated tests

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form for admin portal
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — sidebar navigation, page routing, access verification
- `AdminSmtpPage` from `../../src/pages/admin/AdminSmtpPage.js` — SMTP settings form (From Email, Relay URL, Save button)
- `TestWebLoginPage` from `../../src/pages/testweb/TestWebLoginPage.js` — test web login
- `TestWebHomePage` from `../../src/pages/testweb/TestWebHomePage.js` — test web home page

## Test Scenarios

### TC-ROLE-001 — Admin has unrestricted access
**Precondition:** Logged in as admin user
**Steps:** Access all system areas: admin console, all tasks, all applications, all API endpoints
**Expected:** All areas accessible; no 403 responses

### TC-ROLE-002 — Internal Sales person is able to perform the allowed permissions
**Precondition:** Logged in as Internal Sales
**Steps:** Navigate and perform Internal Sales person activities
**Expected:** Internal Sales person is able to perform all the allowed activities

### TC-ROLE-003 — Internal Sales cannot access admin console
**Precondition:** Logged in as Internal Sales
**Steps:** Attempt to navigate to the admin console URL
**Expected:** System returns 403; admin console is not rendered

### TC-ROLE-004 — Engineer is able to perform the allowed permissions
**Precondition:** Logged in as Engineer
**Steps:** Navigate and perform Engineer activities
**Expected:** Engineer is able to perform all the allowed activities

### TC-ROLE-005 — External user sees only their own applications
**Precondition:** Logged in as external/customer user
**Steps:** Attempt to retrieve another user's application by ID
**Expected:** System returns 403 or 404; other user's data is not returned

### TC-ROLE-006 — External user cannot access cost analysis
**Precondition:** Logged in as external/customer user
**Steps:** Call the cost analysis endpoint
**Expected:** System returns 403; no pricing data is exposed

### TC-ROLE-007 — Distributor restriction flag limits visible work
**Precondition:** Distributor user with restriction flag enabled
**Steps:** Browse applications and tasks
**Expected:** Only work assigned to them is visible; other customers' records are not returned

### TC-ROLE-008 — canQuote flag grants quoting without admin
**Precondition:** User has canQuote flag (not isAdmin)
**Steps:** Access quoting endpoints; attempt admin-only endpoints
**Expected:** Quote endpoints accessible; admin endpoints return 403

### TC-ROLE-009 — canSeePrices flag exposes pricing without quoting rights
**Precondition:** User has canSeePrices flag (not canQuote, not isAdmin)
**Steps:** Access cost analysis endpoint
**Expected:** Cost analysis with pricing is accessible; quote submission endpoints still return 403

### TC-ROLE-010 — Role change by admin takes effect immediately
**Precondition:** Admin updates a user's role
**Steps:** Target user makes an API request without re-logging in
**Expected:** Request is evaluated against the new role; old-role access is no longer granted

### TC-RBAC-002 — Admin can expand all sidebar groups
**Precondition:** Logged in as admin
**Steps:**
1. Click Machine sidebar group
2. Click Fasteners sidebar group
3. Click Tooling sidebar group
4. Click Pricing sidebar group
5. Click Calculations sidebar group
6. Click Content sidebar group
**Expected:** Each group expands and has `aria-expanded="true"` attribute

### TC-RBAC-010 — Distributor blocked from admin-only routes
**Precondition:** Logged in as distributor user
**Steps:**
1. Attempt to access /roles
2. Attempt to access /change-log
3. Attempt to access /analytics
4. Attempt to access /datasets/* routes
**Expected:** All routes return 403 or redirect for distributor user

### TC-RBAC-011 — Admin user menu shows Sign Out option
**Precondition:** Logged in as admin
**Steps:**
1. Open user menu
**Expected:** Sign Out button is visible in the user menu

### TC-RBAC-012 — Customer sees only own applications at /applications
**Precondition:** Logged in as customer user
**Steps:**
1. Navigate to /applications
**Expected:** Applications page loads without 403 or "Access Denied" errors

### TC-RBAC-013 — Sales can view Pemserter Price EUR at /datasets/pemserter-eur
**Precondition:** Logged in as sales user
**Steps:**
1. Navigate to /datasets/pemserter-eur
**Expected:** Page is accessible, page heading is visible

### TC-RBAC-014 — Sales can view Pemserter Price USD at /datasets/pemserter-usd
**Precondition:** Logged in as sales user
**Steps:**
1. Navigate to /datasets/pemserter-usd
**Expected:** Page is accessible, page heading is visible

### TC-RBAC-015 — Admin SMTP access at /smtp
**Precondition:** Logged in as admin
**Steps:**
1. Navigate to /smtp
**Expected:** SMTP page loads with heading, description, and form elements (From Email, Relay URL, Save button)

### TC-RBAC-016 — Admin Settings/Profile access at /settings/profile
**Precondition:** Logged in as admin
**Steps:**
1. Navigate to /settings/profile
**Expected:** Page is accessible with profile heading visible

### TC-RBAC-017 — Sales changelog Undo buttons not visible
**Precondition:** Logged in as sales user
**Steps:**
1. Navigate to /change-log
**Expected:** If accessible, no Undo buttons are present; otherwise redirect/403 is acceptable
