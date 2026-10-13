# Test Web Role-Based Access Control

## Fixtures
- Use `base.fixture.js` for unauthenticated tests
- Use `web-engineer-auth.fixture.js` for Engineering role
- Use `web-customer-auth.fixture.js` for External/Customer role
- Use `web-distributor-auth.fixture.js` for Distributor/Partner role
- Use `web-sales-auth.fixture.js` for Sales role

## Page Objects
- `TestWebLoginPage` — login page
- `TestWebHomePage` — home/dashboard page
- `TestWebInstallationSystemPage` — installation system configurator

## Permission Matrix (from RBAC sheet)

| Role | Create own apps | Work For users | See prices | Generate quote | Generate ROI/Cost Analysis | Eng approval | Switch Region | Manage users/roles | Manage master data |
|------|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| Admin | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes | Yes |
| Sales | Yes | Yes | Yes | Yes | Yes | Yes | No | No | No |
| Engineering | Yes | Yes | Yes | Yes | Yes | Yes | Yes | No | No |
| Customer | Yes | No | No | No | No | No | No | No | No |
| Distributor | Yes | Yes | No | No | No | No | No | No | No |

## Test Cases

### TC-TWEB-RBAC-01 — Admin can access all features
- Steps:
  1. Log in as admin
  2. Navigate to installation system
  3. Create an application
- Expected: Admin can create applications and see all management features

### TC-TWEB-RBAC-02 — Sales can create, work for, see prices, generate quote and ROI
- Steps:
  1. Log in as sales
  2. Navigate to installation system
  3. Create an application
  4. Select a solution and open configuration
- Expected: Sales can see prices, generate quotes, and access ROI/Cost Analysis on the config panel

### TC-TWEB-RBAC-03 — Sales cannot switch region
- Steps:
  1. Log in as sales
  2. Navigate to installation system
- Expected: Region selector is disabled, read-only, or not displayed for Sales role

### TC-TWEB-RBAC-04 — Engineering can create, work for, see prices, generate quote and ROI
- Steps:
  1. Log in as engineering
  2. Navigate to installation system
  3. Create an application
  4. Select a solution and open configuration
- Expected: Engineering can see prices, generate quotes, ROI/Cost Analysis, and switch region

### TC-TWEB-RBAC-05 — Engineering can switch region
- Steps:
  1. Log in as engineering
  2. Navigate to installation system
- Expected: Region selector is interactive and can be changed

### TC-TWEB-RBAC-06 — Customer can create own applications
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Create a new application
- Expected: Customer can successfully create an application

### TC-TWEB-RBAC-07 — Customer cannot see prices
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Select a solution and open configuration
- Expected: Prices are not displayed to customer. Price fields show "—" or are hidden.

### TC-TWEB-RBAC-08 — Customer cannot generate quotes
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Select a solution, open configuration
- Expected: "Download quotation" and "Download Word" buttons are not visible for customer

### TC-TWEB-RBAC-09 — Customer cannot generate ROI/Cost Analysis
- Steps:
  1. Log in as customer
  2. Navigate to installation system
  3. Open a solution comparison
- Expected: "Download Cost Analysis" and "Generate ROI Report" buttons are not visible

### TC-TWEB-RBAC-10 — Distributor can create own applications and work for users
- Steps:
  1. Log in as distributor
  2. Navigate to installation system
  3. Create a new application
- Expected: Distributor can successfully create an application

### TC-TWEB-RBAC-11 — Distributor cannot see prices
- Steps:
  1. Log in as distributor
  2. Navigate to installation system
  3. Select a solution and open configuration
- Expected: Prices are not displayed to distributor

### TC-TWEB-RBAC-12 — Distributor cannot generate quotes or ROI
- Steps:
  1. Log in as distributor
  2. Navigate to installation system
  3. Select a solution, open configuration
- Expected: "Download quotation", "Download Word", "Download Cost Analysis", "Generate ROI Report" buttons are not visible

### TC-TWEB-RBAC-13 — Unauthenticated user cannot access installation system
- Steps:
  1. Navigate to /installation-system without logging in
- Expected: Redirected to /login
