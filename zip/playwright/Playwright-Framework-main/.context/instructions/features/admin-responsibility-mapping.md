# Admin Responsibility Mapping

## Fixtures
- Use `base.fixture.js` for unauthenticated tests
- Use `admin-auth.fixture.js` for authenticated tests (admin role)

## Page Objects
- `AdminResponsibilityMapPage` — the responsibility map dataset editor page

## Test Cases

### TC-RESP-01 — Responsibility Map page loads for admin
- Steps:
  1. Log in as admin
  2. Navigate to /datasets/responsibility-map
- Expected: URL is /datasets/responsibility-map. Heading "Dataset: Responsibility Map" is visible. Table with columns Responsibility, Region, Sales emails, Engineering emails is displayed.

### TC-RESP-02 — Unauthenticated access redirects to login
- Steps:
  1. Navigate to /datasets/responsibility-map without logging in
- Expected: User is redirected to /login

### TC-RESP-03 — Add mapping button is visible
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
- Expected: "Add mapping" button is visible and clickable

### TC-RESP-04 — View action on a mapping row
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
  3. Click View on the first row
- Expected: View dialog or detail view opens showing the mapping details

### TC-RESP-05 — Edit action on a mapping row
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
  3. Click Edit on the first row
- Expected: Edit form opens with pre-filled values for Responsibility, Region, Sales emails, Engineering emails

### TC-RESP-06 — Delete action on a mapping row
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
  3. Click Delete on a row
- Expected: Confirmation prompt appears. On confirm, row is removed from table.

### TC-RESP-07 — All responsibility brands are listed
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
- Expected: Mappings exist for Haeger, MDS, PEMSerter, PROFIL, Sherex across multiple regions (ASIA, EU, NA)

### TC-RESP-08 — Sales emails are comma-separated in each mapping
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
- Expected: Sales emails column contains one or more valid email addresses separated by commas

### TC-RESP-09 — Engineering emails are present in each mapping
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
- Expected: Engineering emails column contains at least one valid email address

### TC-RESP-10 — Record count matches visible rows
- Steps:
  1. Log in as admin
  2. Navigate to responsibility map
  3. Count table rows
- Expected: Record count text at bottom matches the number of visible table rows
