# Admin Dashboard

## Fixture
- Use `base.fixture` (inline login)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form for admin portal
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — page routing, heading verification, access check

## Test Scenarios
### TC-ADM-042 — Dashboard Overview shows KPI metrics
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /dashboard/overview
**Expected:** Dashboard overview page loads with heading visible

### TC-ADM-043 — Dashboard Reports page loads
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /dashboard/reports
**Expected:** Dashboard reports page loads with heading visible

### TC-ADM-049 — KPI metrics cards visible on Dashboard Overview
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /dashboard/overview
**Expected:** KPI metric cards (Total Users, Active Users, Total Applications, Pending, Approved, Rejected) are visible

### TC-ADM-050 — Sales user cannot access Dashboard Overview
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as sales user
2. Navigate to /dashboard/overview
**Expected:** Sales user gets 403 or redirect; page is not accessible
