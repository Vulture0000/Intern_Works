# Installation System Enhanced

## Fixture
`base.fixture` (inline login)

## Pages Involved
- `TestWebHomePage` from `../../src/pages/testweb/TestWebHomePage.js` — home page with user menu and brand links
- `TestWebInstallationSystemPage` from `../../src/pages/testweb/TestWebInstallationSystemPage.js` — installation system page with region selector, thread selector, and solution listings

## Test Scenarios
### TC-INST-043 — User Menu - Engineering
**Precondition:** Login as engineering@penn.com
**Steps:**
1. Click the user menu avatar/button
**Expected:** Avatar shows "DW", name "David Wilson", role "Engineering"

### TC-INST-044 — User Menu - Customer
**Precondition:** Login as customer@penn.com
**Steps:**
1. Click the user menu avatar/button
**Expected:** Avatar shows "EB", name "Emily Brown", role "External/Customer"

### TC-INST-045 — User Menu - Distributor
**Precondition:** Login as distributor@penn.com
**Steps:**
1. Click the user menu avatar/button
**Expected:** Avatar shows "RD", name "Robert Davis", role "Distributor/Partner"

### TC-INST-046 — User Menu - Sales
**Precondition:** Login as sales@penn.com
**Steps:**
1. Click the user menu avatar/button
**Expected:** Avatar shows "MJ", name "Michael Johnson", role "Sales"

### TC-INST-053 — Home Page "Find Your Installation System" Button
**Precondition:** Navigate to /
**Steps:**
1. Click "Find Your Installation System" button
**Expected:** Navigated to /installation-system

### TC-INST-054 — Brand Links on Home Page
**Precondition:** Navigate to /
**Steps:**
1. Observe all brand links
**Expected:** All 5 brand links (pemnet, profil-global, haeger, autoriv, sherex) are visible and clickable

### TC-INST-058 — Region Selector
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Observe the Region selector
2. Change the Region selection
**Expected:** Region selector is a react-select dropdown, default value "North America", changing the region updates pricing/messaging accordingly

### TC-INST-059 — Max Thread Selector
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Observe the Max Thread selector
2. Change the Max Thread selection
**Expected:** Max Thread selector is a react-select dropdown, default value "Any", changing the Max Thread filters the displayed solutions

### TC-INST-009 — Multi-select PEM+SHEREX element types
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Click PEM button
2. Click SHEREX button
**Expected:** Both PEM and SHEREX active. Filter chip shows "Element types: PEM, SHEREX".

### TC-INST-017 — Set force range maximum value only
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Set Maximum (kN) to 100
**Expected:** Force chip updates. Count changes.

### TC-INST-023 — Select A210 solution specifically
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Check A210 checkbox
2. Uncheck A210 checkbox
**Expected:** Checkbox toggles correctly.

### TC-INST-030 — Key Characteristics expandable on comparison card
**Precondition:** Comparison card visible for A210
**Steps:**
1. Click Key Characteristics expand/collapse
**Expected:** Section expands to show product features, collapses back.

### TC-INST-031 — Configure Solution opens config panel
**Precondition:** Comparison card visible for A210
**Steps:**
1. Click Configure Solution on A210 card
**Expected:** Configuration panel opens as overlay.

### TC-INST-032 — Download Cost Analysis button visible
**Precondition:** Comparison card visible
**Steps:**
1. Observe Download Cost Analysis button
**Expected:** Button visible on comparison card.

### TC-INST-033 — Generate ROI Report button visible
**Precondition:** Comparison card visible
**Steps:**
1. Observe Generate ROI Report button
**Expected:** Button visible on comparison card.

### TC-INST-034 — Machine Cost Allocation section visible
**Precondition:** Comparison card visible
**Steps:**
1. Observe Machine cost allocation section
**Expected:** Shows "100% utilization" and "Dedicated" options.

### TC-INST-040 — Params add existing application button
**Precondition:** Navigate to /installation-system (logged in)
**Steps:**
1. Click Add existing application under params section
**Expected:** Use Existing modal opens.

### TC-INST-041 — Params empty state message visible
**Precondition:** Navigate to /installation-system (logged in), no apps
**Steps:**
1. Observe Applications subsection
**Expected:** "No applications yet" message visible.
