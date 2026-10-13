# Admin Email Notifications

## Fixtures
- Use `admin-auth.fixture.js` for authenticated admin tests
- Use `web-customer-auth.fixture.js` for customer role tests

## Page Objects
- `AdminSmtpPage` — SMTP configuration page
- `AdminResponsibilityMapPage` — responsibility mapping page
- `TestWebLoginPage` — login page
- `TestWebInstallationSystemPage` — installation system configurator
- `TestWebHomePage` — home page

## Test Cases

### TC-EMAIL-01 — SMTP page loads for admin
- Steps:
  1. Log in as admin
  2. Navigate to /smtp
- Expected: URL is /smtp. Heading "SMTP" is visible. From Email and From Name inputs are visible.

### TC-EMAIL-02 — SMTP enabled toggle reflects current state
- Steps:
  1. Log in as admin
  2. Navigate to /smtp
- Expected: Enabled checkbox reflects whether task notification emails are currently enabled

### TC-EMAIL-03 — Admin can update From Email and From Name
- Steps:
  1. Log in as admin
  2. Navigate to /smtp
  3. Modify From Email and From Name fields
  4. Click Save
- Expected: Changes are saved and persist after page reload

### TC-EMAIL-04 — Send Test button is clickable
- Steps:
  1. Log in as admin
  2. Navigate to /smtp
  3. Enter a valid test recipient email
  4. Click Send Test
- Expected: Send Test action completes without error (email delivery depends on SMTP config)

### TC-EMAIL-05 — Reload button refreshes SMTP config
- Steps:
  1. Log in as admin
  2. Navigate to /smtp
  3. Click Reload
- Expected: Page reloads with current SMTP configuration from server

### TC-EMAIL-06 — Responsibility Map drives RFQ email recipients
- Steps:
  1. Log in as admin
  2. Navigate to /datasets/responsibility-map
  3. Check mapping for a product (e.g. Haeger in NA)
- Expected: Sales emails and Engineering emails are configured for each product/region combination

### TC-EMAIL-07 — RFQ by customer triggers email to mapped sales
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Create an application
  4. Select a solution (e.g. A210)
  5. Open configuration panel
  6. Click "Request Quotation / Support"
- Expected: RFQ submission completes. Email notifications are sent to the sales and engineering emails mapped in Responsibility Map for the relevant product and region.

### TC-EMAIL-08 — RFQ by customer shows confirmation
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Create an application
  4. Select a solution
  5. Open configuration panel
  6. Click "Request Quotation / Support"
- Expected: Confirmation message is displayed to the customer that their request has been submitted

### TC-EMAIL-09 — Task created in admin after RFQ
- Steps:
  1. Submit an RFQ as customer
  2. Log in as admin
  3. Navigate to /tasks
- Expected: A new task appears in the admin Tasks list corresponding to the RFQ

### TC-EMAIL-10 — Task notification email includes RFQ details
- Steps:
  1. Configure SMTP with a test recipient
  2. Submit an RFQ as customer
  3. Check test recipient inbox (manual verification step)
- Expected: Email includes RFQ snapshot, configured machine options, application details
