# Admin Login Flow

## Fixture
- Use `base.fixture.js` for unauthenticated tests (login flow)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form, email/password fields, sign-in button, error messages
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — user menu, sign-out functionality, page heading verification

## Test Scenarios
### TC-ADM-LOGIN-01 — Happy path login with valid admin credentials redirects to dashboard
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Fill email with admin@penn.com
3. Fill password with "12345678"
4. Click Sign In
**Expected:** Redirected to /users page with heading "All Users", Sign In button no longer visible

### TC-ADM-LOGIN-02 — Invalid credentials show generic error
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Fill email with invalid credentials
3. Click Sign In
**Expected:** Stays on /login page, generic error message "Sign-in could not be completed" is visible

### TC-ADM-003 — Invalid password shows generic error
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Enter valid email (admin@penn.com) with wrong password
3. Click Sign In
**Expected:** Stays on /login page, generic error message does not reveal which field is wrong

### TC-ADM-004 — Empty fields show validation on sign-in attempt
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Click Sign In without entering any credentials
**Expected:** Page stays on /login with validation preventing submission

### TC-ADM-005 — Empty password field prevents submission
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Enter email
3. Switch to password mode
4. Click Sign In without entering a password
**Expected:** Page stays on /login, validation prevents submission

### TC-ADM-007 — Password field characters are masked
**Precondition:** Admin portal is accessible
**Steps:**
1. Navigate to Admin Login page
2. Switch to password mode
3. Type a password
**Expected:** Password input has `type="password"` attribute, characters displayed as bullets

### TC-ADM-011 — Session cleared after logout redirects to login
**Precondition:** User is logged in as admin
**Steps:**
1. Sign out via user menu dropdown
2. Navigate to protected /users page
**Expected:** Redirected to /login page, session is cleared

### TC-ADM-012 — User menu displays John Smith after login
**Precondition:** User is logged in as admin
**Steps:**
1. Log in as admin user
2. Verify user menu button
**Expected:** User menu button is visible displaying "John Smith"

### TC-ADM-013 — Page refresh preserves session and stays on dashboard
**Precondition:** User is logged in as admin
**Steps:**
1. Refresh the page
2. Verify session is preserved
**Expected:** User remains on /users dashboard, user menu button still visible
