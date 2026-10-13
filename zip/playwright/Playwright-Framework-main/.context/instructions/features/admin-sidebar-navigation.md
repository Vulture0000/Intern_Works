# Admin Sidebar Navigation

## Fixture
- Use `base.fixture` (inline login)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form for admin portal
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — sidebar navigation links, page routing, heading verification

## Test Scenarios
### TC-ADM-014 — Sidebar navigation complete with all items visible
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Verify all sidebar navigation items are present
**Expected:** All sidebar items visible: Dashboard, Analytics, Users, Roles, Applications, Tasks, Changelog, Machine, Fasteners, Tooling, Pricing, Calculations, Content, SMTP, Profile

### TC-ADM-015 — Navigate all main sidebar routes and verify page headings
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to each route: /dashboard/overview, /analytics, /users, /roles, /applications, /tasks, /changelog, /smtp, /profile
3. Verify each page is accessible with correct heading
**Expected:** Each page loads successfully with correct heading, no 403 errors
