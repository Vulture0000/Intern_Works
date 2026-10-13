# Admin Settings

## Fixture
- Use `base.fixture` (inline login)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form for admin portal
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — page routing, heading verification

## Test Scenarios
### TC-ADM-024 — Profile Settings page loads at /settings/profile
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /settings/profile
**Expected:** Profile settings page heading is visible

### TC-ADM-044 — Profile Overview page loads at /profile with "Edit Profile" button
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /profile
**Expected:** Profile overview page heading is visible with "Edit Profile" button

### TC-ADM-045 — Settings General page loads at /settings/general
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /settings/general
**Expected:** Settings general page heading is visible

### TC-ADM-046 — Settings Permissions page loads at /settings/permissions
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /settings/permissions
**Expected:** Settings permissions page heading is visible

### TC-ADM-047 — Settings Security page loads at /settings/security
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /settings/security
**Expected:** Settings security page heading is visible

### TC-ADM-051 — All Settings tabs navigation (Profile, General, Permissions, Security)
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /settings/profile
3. Verify settings tabs are present
**Expected:** Settings profile page loads with all tabs (Profile, General, Permissions, Security) visible
