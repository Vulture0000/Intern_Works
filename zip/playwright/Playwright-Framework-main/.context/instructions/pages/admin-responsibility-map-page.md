# Admin Responsibility Map Page

## URL
`/datasets/responsibility-map` (relative to Admin Portal base URL `https://admin.configurator.dev.pemnet.ai`)

## Elements
- Page heading (h1) — "Dataset: Responsibility Map"
- Page description — "Record-level editor for mappings (id: id). These mappings drive the default 'My tasks' filter in the Selector."
- Add mapping button — `getByRole('button', { name: /add mapping/i })` — opens a form to create a new responsibility mapping

### Table
- Table with columns: Responsibility, Region, Sales emails, Engineering emails, Actions
- Table rows — each row contains:
  - Responsibility name (text, e.g. "Haeger", "MDS", "PEMSerter", "PROFIL", "Sherex")
  - Region name (text, e.g. "ASIA", "EU", "NA")
  - Sales emails (comma-separated email addresses)
  - Engineering emails (comma-separated email addresses)
  - Actions — 3 icon buttons per row:
    - View — `getByRole('button', { name: /view/i })` — opens view-only detail
    - Edit — `getByRole('button', { name: /edit/i })` — opens edit form
    - Delete — `getByRole('button', { name: /delete/i })` — deletes the mapping
- Record count text — "X records" at bottom of table

## Actions
- Navigate to responsibility map page
- Click Add mapping button
- Click View on a specific row by index
- Click Edit on a specific row by index
- Click Delete on a specific row by index
- Get responsibility name from a specific row
- Get region from a specific row
- Get sales emails from a specific row
- Get engineering emails from a specific row
- Get total record count

## Notes
- React SPA — requires authentication (admin role only)
- Non-admin users cannot access this page (will see 403 or redirect)
- These mappings drive the 'My tasks' filter in the Test Web Selector
- When an external customer clicks "Request Quotation / Support", emails are sent to the mapped sales and engineering emails based on product and region
