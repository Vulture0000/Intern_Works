# End-to-End Flows

## Fixture
- Use `base.fixture` (inline login for both portals)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — admin portal login
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — admin routing, navigation
- `TestWebInstallationSystemPage` from `../../src/pages/testweb/TestWebInstallationSystemPage.js` — application creation, solution selection, filters, portfolio management
- `TestWebMachineConfigurationPage` from `../../src/pages/testweb/TestWebMachineConfigurationPage.js` — configuration panel, machine settings

## Test Scenarios
### TC-E2E-001 — Full Flow Admin → Engineering
**Precondition:** Both admin and test web portals are accessible
**Steps:**
1. Admin logs into admin portal
2. Admin checks /users page
3. Admin checks /applications page
4. Engineering logs into test web
5. Engineering navigates to installation system
6. Engineering selects A210 solution and opens comparison
**Expected:** Both portals function; admin sees users/applications, engineering accesses installation system

### TC-E2E-002 — Create Application → Auto-Filter → Configure
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Creates new application "Demo App" with volume 100000
3. Selects A210 solution
4. Clicks Compare/Configure and opens configuration panel
**Expected:** Application is created, solution selected, configuration panel opens with visible heading

### TC-E2E-003 — Multi-App Portfolio
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Creates App Alpha with volume 80000
3. Creates App Beta with volume 120000
4. Verifies portfolio shows combined volume
5. Selects multiple solutions and compares
**Expected:** Both apps created, combined volume displayed, multiple solutions can be compared

### TC-E2E-004 — Use Existing Application
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Creates a new application
3. Clears application selection
4. Uses "Use Existing Application" to reload it
**Expected:** Application can be cleared and reloaded via Use Existing modal

### TC-E2E-005 — Save Config Return Later
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in, creates app, selects solution
2. Logs out
3. Logs back in and navigates to installation system
**Expected:** Session is isolated; user can log back in and access installation system

### TC-E2E-006 — Cross-Portal Admin Creates User → Engineering Uses App
**Precondition:** Both portals are accessible
**Steps:**
1. Admin logs in and checks engineering user in /users
2. Engineering logs into test web
3. Engineering creates an application
4. Admin checks /applications for engineering activity
**Expected:** Admin sees users and applications; engineering can create apps; cross-portal visibility works

### TC-E2E-007 — Negative Access Without Login
**Precondition:** No active session
**Steps:**
1. Try accessing /installation-system without auth
2. Try accessing testweb home without auth
3. Try accessing /login page (should be accessible)
4. Try accessing admin /users without auth
5. Try accessing admin /roles without auth
**Expected:** All protected routes redirect to /login; /login page itself is accessible

### TC-E2E-010 — All Filter Combinations Maximal
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Select all element types (PEM, SHEREX, PROFIL, Other fasteners)
3. Check both capabilities (process monitoring, robot integration)
4. Set force range (min 30)
**Expected:** All filters active simultaneously; matching product count is a non-negative number

### TC-E2E-014 — All 4 Roles Complete Basic Flow
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Customer logs in and navigates to installation system
3. Distributor logs in and navigates to installation system
4. Sales logs in and navigates to installation system
**Expected:** Each role can access installation system with filter and solution selection headings visible

### TC-E2E-015 — Admin Logs Out → Other User Logs In
**Precondition:** Admin portal is accessible
**Steps:**
1. Admin logs into admin portal
2. Admin signs out
3. Engineering logs into admin portal
4. Engineering navigates to /applications
**Expected:** Session isolation works; engineering can access applications after admin logout

### TC-E2E-017 — Tab Switch Filters Persist
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Apply filters (element type, force range)
3. Navigate away to home page
4. Navigate back to installation system
**Expected:** Filtered product count persists after navigation away and back

### TC-E2E-018 — Browser Refresh Preserves App State
**Precondition:** Test web portal is accessible
**Steps:**
1. Engineering logs in and navigates to installation system
2. Creates app and selects solution
3. Refresh browser
**Expected:** Application state is preserved after browser refresh

### TC-E2E-020 — Admin Analytics Reflects Activity
**Precondition:** Both portals are accessible
**Steps:**
1. Engineering uses test web
2. Admin navigates to /analytics
**Expected:** Admin analytics page loads with metrics content visible, reflecting engineering activity
