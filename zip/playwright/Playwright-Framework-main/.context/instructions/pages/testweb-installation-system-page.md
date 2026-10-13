# Test Web Installation System Page

## URL
`/installation-system` (relative to Test Web Portal base URL `https://testweb.configurator.dev.pemnet.ai`)

## Elements

### Navigation/Header
- Logo — button with Installation Systems logo image
- "System Selector & Configurator" heading text — visible next to logo
- Region selector — react-select dropdown (default: "North America")
- User menu — button showing avatar initials, name, and role
- User avatar — circular element with initials (e.g. "DW")
- User name — "David Wilson" text in user menu
- User role — "Engineering" text in user menu
- Top brand bar — links: pemnet, profil-global, haeger, autoriv, sherex

### Option A — Set Filters Manually
- Page heading — `h3` "Filter functions"
- Page description — "Use these filters to narrow down the solution list."
- Reset filters button — "Reset filters" button with refresh icon
- Section heading — "Option A" / "Set Filters Manually"
- **Fastener element type(s)** — toggle button group with 4 buttons: PEM, SHEREX, PROFIL, Other fasteners
- **Maximum thread size** — react-select dropdown (default: "Any")
- **Must-have capabilities** — 2 checkboxes:
  - "Process monitoring required"
  - "Robot integration required"
- **Installation force range (kN)**:
  - "Any" text indicator
  - "Reset" link button
  - Dual range sliders: "Minimum installation force", "Maximum installation force" (range 21-300)
  - Numeric inputs: "Minimum (kN)" (placeholder "Min"), "Maximum (kN)" (placeholder "Max")
- **Matching products** — text showing "63 matching product(s)"
- **Filter chips** — displayed as badges:
  - "Region: NA"
  - "Element types: none selected"
  - "Max thread: Any"
  - "Force: Any"
  - "Compare selected: 0"

### Option B — Automatic Setting of Filters Based on Application
- Section heading — "Option B" / "Automatic Setting of Filters Based on Application"
- Description — "Create or select an application to auto-set filters."
- "Setup New Application" button
- "Use Existing Application" button
- Status text — "No application selected."

### Solution Selection Grid
- Section heading — `h3` "Select solutions you want to compare"
- Description — "Choose one or more solutions, then click Compare / Configure Solutions."
- 5 category card groups:
  1. **Handtools** (15 matching) — subcategories: Pneumo Hydraulic Handtools, Pneumatic Handtools, Mechanical Handtools
  2. **Standalone Machines** (13 matching) — subcategories: Servo-Electric, Hydraulic, Air-over-Oil, Pneumatic
  3. **Robotic Integration** (13 matching) — subcategories: Robotic Stations (Air-over-Oil), Robotic Tools, Robotic Stations (Hydraulic)
  4. **InDie** (3 matching) — subcategories: InDie
  5. **Custom** (3 matching) — subcategories: Custom
- 63 solution checkboxes with labels and `id="solution-{name}"`

### Comparison List
- Section heading — `h3` "Comparison list"
- Description — "Review selected solutions side-by-side and open configuration to create quotations."
- Empty state — "No solutions selected yet. Check solutions above to compare them here."
- Solution comparison cards — appear after selecting solutions and clicking "Compare / Configure Solutions"
- "Compare / Configure Solutions" button — shows selected count, opens comparison cards panel
- Solution card on each comparison card — shows product name, category, subcategory, key characteristics, pricing fields
- **Auto-Feed toggle** — on MSPe machine comparison cards: a toggle button with `aria-pressed` attribute showing "Auto-Feed On" or "Auto-Feed Off". When toggled, costs and option availability change. Includes a green/gray slider switch next to the text.
- "Configure Solution" button — on each comparison card, opens the configuration panel for that solution
- "Total Installation Cost per Part" — shows "—" until application added
- "Key characteristics" — expandable list of product features
- "Machine cost allocation" — shows "100% utilization"
- "Download Cost Analysis" and "Generate ROI Report" buttons

### Application Parameters
- Section heading — `h3` "Enter your application parameters"
- Description — "Define one or more applications to generate indicative cost and utilization KPIs."
- Sub-heading — `h4` "Applications"
- "Add new application" button
- "Add existing application" button
- Empty state — "No applications yet..."
- Portfolio totals:
  - "Total annual volume" — value (default: "—")
  - "Total fasteners / year" — value (default: "—")
- Derived inputs:
  - "Fasteners / part (avg.)" — value (default: "—")
  - "Element types / part (avg.)" — value (default: "—")
  - "Parts / year" — value (default: "—")
- "Clear selection" button (disabled when no applications)
- "Customize assumptions" button

### Floating Support
- "Request Support" button — fixed bottom-left, visible on scroll

## Elements (Application Forms)

### Setup New Application Modal
- Modal heading — "New application"
- App name input — `#app-name` (required, placeholder "e.g., Samplepart 1")
- App number input — `#app-number` (placeholder "e.g., A-001 / 12345")
- App OEM input — `#app-oem` (placeholder "e.g., BMW")
- App program input — `#app-program` (placeholder "e.g., Vehicle / platform / program")
- App volume input — `#app-volume` (type="number", placeholder "e.g., 200000")
- App batch size input — `#app-batch-size` (type="number", placeholder "e.g., 500")
- App material input — `#app-material` (placeholder "e.g., Aluminum EN AW-6082 T6")
- Add fastener button — "Add fastener"
- Fastener brand — react-select input `#react-select-5-input`
- Fastener type search — input with placeholder "Start typing (e.g., SS / A4 / CLS ...)"
- Fastener qty per part A — `input[name="fasteners.0.qtyPerPartA"]` (placeholder "e.g., 12")
- Fastener qty per part B — `input[name="fasteners.0.qtyPerPartB"]` (placeholder "e.g., 12")
- Cancel button — "Cancel"
- Save button — "Save"
- × close button — `getByLabel('Close')`

### App Card (After Save)
- Edit button — "Edit" on the app card
- Remove button — "Remove" on the app card
- Reset application button — "Reset application" under Option B
- Selected status text — "Selected: {app name}"

### Use Existing Application Modal
- Modal heading — h2 "My applications"
- Table with columns: Select (checkbox), Name, App No., OEM, Program, Company, Owner, Actions (Edit, Delete buttons per row)
- Select all button — "Select all"
- New application button — "New application"
- Refresh button — "Refresh"
- Edit button (header) — "Edit"
- Delete button (header) — "Delete"
- Close button (text) — "Close" (not the aria-label close)
- OK button — "OK" (not the aria-label close)

## Actions
- Navigate to /installation-system
- Click "Compare / Configure Solutions" button to view comparison cards
- Toggle Auto-Feed on MSPe machine comparison cards (click the Auto-Feed On/Off button)
- Get Auto-Feed toggle state (aria-pressed attribute value)
- Get Auto-Feed toggle text content ("Auto-Feed On" or "Auto-Feed Off")
- Click "Configure Solution" on a comparison card to open the configuration panel
- Click element type buttons (PEM, SHEREX, PROFIL, Other fasteners)
- Check/uncheck capability checkboxes (Process monitoring, Robot integration)
- Set force range minimum value
- Set force range maximum value
- Reset all filters
- Select/deselect solution checkboxes by name
- Get matching product count
- Get compare selected count
- Click Setup New Application
- Click Use Existing Application
- Click Add new application (in Application Parameters section)
- Click Add existing application
- Get portfolio total values
- Get derived input values
- Get user menu info (name and role)
- Check support button visibility
- Fill new application form (name, app number, OEM, program, volume, batch size, material)
- Click Save / Cancel / × on modal
- Add a fastener (brand, type, qty A, qty B)
- Click Edit / Remove on app card
- Click Reset application
- Click Select all / Refresh / Close / OK in Use Existing modal
- Select an existing app by checkbox
- Click New application / Edit / Delete in Use Existing modal
- Get app card text / count
- Get selected app text
- Get applications heading text
- Clear selection
- Click Customize assumptions

## Notes
- React SPA — requires JavaScript execution
- Requires authentication — unauthenticated users redirected to /login
- All 4 test roles can access the page (Engineering, Customer, Distributor, Sales)
- Region selector uses react-select library (skip interactive testing)
- Max thread size uses react-select library (skip interactive testing)
- No `data-test` attributes on the page — use role selectors and label text
- Setup New Application and Add new application (params section) open the same modal
- Use Existing Application and Add existing application (params section) open the same modal
