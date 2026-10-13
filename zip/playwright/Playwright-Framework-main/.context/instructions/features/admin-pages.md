# Admin Pages

## Fixture
- Use `base.fixture` (inline login)

## Pages Involved
- `AdminLoginPage` from `../../src/pages/admin/AdminLoginPage.js` — login form for admin portal
- `AdminDashboardPage` from `../../src/pages/admin/AdminDashboardPage.js` — page routing, heading verification, access check

## Test Scenarios
### TC-ADM-023 — SMTP Settings page loads correctly
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /smtp
**Expected:** SMTP page heading is visible

### TC-ADM-031 — User List Table displays with columns
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /users
**Expected:** User table is visible with columns: Name, Email, Role, Status, Last Active

### TC-ADM-032 — Roles page shows Add Role button
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /roles
**Expected:** "Add Role" button is visible on the roles page

### TC-ADM-033 — Applications list page loads
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /applications
**Expected:** Applications page heading is visible

### TC-ADM-034 — Tasks list page loads
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /tasks
**Expected:** Tasks page heading is visible

### TC-ADM-035 — Analytics dashboard loads with metrics
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /analytics
**Expected:** Analytics page is accessible with heading visible

### TC-ADM-041 — Approvals page loads with heading "Approvals"
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /approvals
**Expected:** Approvals page heading is visible

### TC-ADM-048 — Tasks Raw Dataset page loads
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /datasets/tasks-raw
**Expected:** Tasks raw dataset page heading is visible

### TC-ADM-052 — Register page shows 404 "Page not found"
**Precondition:** Admin portal is accessible
**Steps:**
1. Log in as admin user
2. Navigate to /register
**Expected:** 404 "Page not found" is displayed with "Back to Home" link
