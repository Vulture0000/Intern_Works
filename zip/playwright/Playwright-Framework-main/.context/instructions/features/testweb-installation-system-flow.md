# Test Web Installation System Flow

## Fixtures
- Use `base.fixture.js` for unauthenticated tests
- Use `web-engineer-auth.fixture.js` for authenticated tests (Engineering role)
- Use `web-customer-auth.fixture.js`, `web-distributor-auth.fixture.js`, `web-sales-auth.fixture.js` for cross-role tests

## Page Objects
- `TestWebInstallationSystemPage` — the installation system configurator page

## Test Cases

### TC-INST-01 — Unauthenticated user is redirected to login
- Precondition: User is not logged in
- Steps:
  1. Navigate to /installation-system
- Expected: User is redirected to /login page with "Sign in" heading visible

### TC-INST-02 — Page loads with all key sections visible
- Steps:
  1. Navigate to /installation-system
  2. Observe page content
- Expected: URL is /installation-system. H3 headings "Filter functions" and "Select solutions you want to compare" are visible. Solution category cards are displayed.

### TC-INST-03 — Default filter chips are displayed
- Steps:
  1. Navigate to /installation-system
- Expected: Default filter chips show: "Region: NA", "Element types: none selected", "Max thread: Any", "Force: Any", "Compare selected: 0". Matching product count is displayed.

### TC-INST-04 — Toggle element type PEM updates count
- Steps:
  1. Click "PEM" element type button
- Expected: PEM button is active/highlighted. Matching product count updates to show filtered results.

### TC-INST-05 — Toggle multiple element types
- Steps:
  1. Click "PEM" element type button
  2. Click "SHEREX" element type button
- Expected: Both PEM and SHEREX are selected. Filtered count shows combined results.

### TC-INST-06 — Check Process Monitoring capability
- Steps:
  1. Check "Process monitoring required" checkbox
- Expected: Checkbox is checked. Matching product count updates to show only machines with process monitoring.

### TC-INST-07 — Check Robot Integration capability
- Steps:
  1. Check "Robot integration required" checkbox
- Expected: Checkbox is checked. Matching product count updates to show only machines with robot integration.

### TC-INST-08 — Adjust force range minimum
- Steps:
  1. Clear "Minimum (kN)" input
  2. Enter value "50"
- Expected: Minimum force value updates to 50. Force filter chip updates. Matching count changes.

### TC-INST-09 — Reset all filters restores defaults
- Precondition: Multiple filters have been applied
- Steps:
  1. Apply element type PEM + capability Process monitoring + force range 50-250
  2. Click "Reset filters" button
- Expected: All filters reset to defaults. Matching count returns to original unfiltered count. Filter chips reset.

### TC-INST-10 — Select one solution per category
- Steps:
  1. Check "A210" (Handtools)
  2. Check "824 eDrive" (Standalone Machines)
  3. Check "A240-CP" (Robotic Integration)
  4. Check "MDS A100" (InDie)
  5. Check "Full Custom Solution" (Custom)
- Expected: All 5 checkboxes are checked. "Compare selected" chip shows count of 5.

### TC-INST-11 — Compare selected count updates
- Steps:
  1. Check 3 solution checkboxes across categories
- Expected: Filter chip "Compare selected: 3" matches number of selected solutions.

### TC-INST-12 — Deselect a solution
- Precondition: 1 solution is selected
- Steps:
  1. Uncheck the selected solution
- Expected: "Compare selected: 0" is shown. Comparison list shows empty state.

### TC-INST-13 — Comparison empty state visible
- Steps:
  1. Scroll to comparison list section
- Expected: Empty state message is visible: "No solutions selected yet. Check solutions above to compare them here."

### TC-INST-14 — Setup New Application button
- Steps:
  1. Click "Setup New Application" button under Option B
- Expected: Button is clickable. Modal or form opens for creating application.

### TC-INST-15 — Use Existing Application button
- Steps:
  1. Click "Use Existing Application" button under Option B
- Expected: Button is clickable. Existing application selection UI appears.

### TC-INST-16 — Add new application in params section
- Steps:
  1. Scroll to "Enter your application parameters" section
  2. Click "Add new application"
- Expected: Button is clickable. New application form/modal opens for defining part parameters.

### TC-INST-17 — Portfolio totals show empty state
- Steps:
  1. Scroll to Portfolio totals section
- Expected: All KPI values show "—" (Total annual volume, Total fasteners/year, Fasteners/part, Element types/part, Parts/year)

### TC-INST-18 — All 4 roles can access the page
- Steps:
  1. Repeat for each role (Engineering, Customer, Distributor, Sales):
     a. Log in as role
     b. Navigate to /installation-system
- Expected: All 4 roles successfully access /installation-system with solution grid visible.

### TC-INST-19 — User menu shows correct info
- Steps:
  1. Observe user menu button in header
- Expected: User menu shows avatar "DW", name "David Wilson", role "Engineering"

### TC-INST-20 — Request Support button visible
- Steps:
  1. Scroll to bottom of page
- Expected: "Request Support" button is visible fixed at bottom-left

### TC-INST-003 (enhanced) — Header elements visible
- Steps:
  1. Navigate to /installation-system as Engineering
- Expected: Header shows "System Selector & Configurator" text, Region selector (default North America), user menu (David Wilson/Engineering). Brand links: pemnet, profil-global, haeger, autoriv, sherex.

### TC-INST-006 — Element type SHEREX selection
- Steps:
  1. Click SHEREX element type button
- Expected: SHEREX becomes active. Count changes. Filter chip updates.

### TC-INST-007 — Element type PROFIL selection
- Steps:
  1. Click PROFIL element type button
- Expected: PROFIL becomes active. Count changes.

### TC-INST-008 — Element type Other fasteners selection
- Steps:
  1. Click "Other fasteners" element type button
- Expected: Other fasteners becomes active. Count changes.

### TC-INST-010 — All four element types selected
- Steps:
  1. Select PEM, SHEREX, PROFIL, and Other fasteners
- Expected: All 4 active. Count shows union of all types.

### TC-INST-011 — Toggle off element type
- Precondition: PEM is selected
- Steps:
  1. Click PEM again to deselect
- Expected: PEM inactive. Count reverts. Chip updates.

### TC-INST-013 — Uncheck capability
- Precondition: Process monitoring is checked
- Steps:
  1. Uncheck Process monitoring
- Expected: Count reverts. Checkbox unchecked.

### TC-INST-015 — Both capabilities checked
- Steps:
  1. Check Process monitoring required
  2. Check Robot integration required
- Expected: Both checked. Count = intersection (less than each individually).

### TC-INST-018 — Force range min > max validation
- Steps:
  1. Set Minimum=200, Maximum=50
- Expected: No crash. Either auto-correction, validation error, or zero results.

### TC-INST-019 — Force range full range (21-300)
- Steps:
  1. Set Min=21, Max=300
- Expected: Maximum count showing all solutions in range.

### TC-INST-020 — Force range narrow range
- Steps:
  1. Set Min=100, Max=110
- Expected: Only solutions in 100-110 kN range shown.

### TC-INST-021 — Force range reset
- Precondition: Force range is set
- Steps:
  1. Click Reset or Any link
- Expected: Resets to default "Any". Count returns.

### TC-INST-026 — All 47 solution checkboxes exist
- Steps:
  1. Count all solution checkboxes on the page
- Expected: 47 checkboxes across 5 categories and 13 subcategories. Each has unique id.

### TC-INST-028 — Compare/Configure button shows comparison cards
- Steps:
  1. Select A210 solution
  2. Click Compare / Configure Solutions button
- Expected: Button text shows solution count. Comparison cards appear with solution details.

### TC-INST-029 — Comparison card details
- Steps:
  1. Select a solution, click Compare/Configure
- Expected: Card shows solution name, category, subcategory, TOTAL INSTALLATION COST PER PART, OPERATOR UTILIZATION, MACHINE UTILIZATION, Key Characteristics (expandable), Configure Solution button, Machine cost allocation, Download Cost Analysis, Generate ROI Report.

### TC-INST-035 — Solution names present in grid
- Steps:
  1. Verify solution grid contains expected names
- Expected: Key solution names visible (A210, FLEX-18, 824 eDrive, T-Series, A220-CP, A240-CP, MDS A100, Full Custom Solution, etc.)

### TC-INST-038 — Option B default state
- Steps:
  1. Observe Option B section with no app loaded
- Expected: Shows "No application selected." Both "Setup New Application" and "Use Existing Application" buttons visible.

### TC-INST-042 — Portfolio KPIs visible
- Steps:
  1. Observe Portfolio Totals section
- Expected: KPIs: Total annual volume (—), Total fasteners/year (—), Fasteners/part (—), Element types/part (—), Parts/year (—). Clear selection disabled.

### TC-INST-052 — Category cards with labels
- Steps:
  1. Verify each category heading and subcategory labels
- Expected: Handtools (15), Standalone Machines (13), Robotic Integration (13), InDie (3), Custom (3). Subcategory labels visible.

### TC-INST-055 — Filter combination all active
- Steps:
  1. Select PEM element type
  2. Check Process monitoring required
  3. Set force Min=50
- Expected: All 3 filters active simultaneously. Count reflects intersection.

### TC-INST-056 — Reset preserves solution selection
- Precondition: Solutions + filters applied
- Steps:
  1. Select A210 solution
  2. Apply filters
  3. Click Reset filters
- Expected: Filters reset. Solution A210 remains selected.

### TC-INST-057 — Zero results state
- Steps:
  1. Apply very restrictive filters (PROFIL + robot int + force 250-300)
- Expected: Shows "0 matching product(s)". No matching solutions in grid.

### TC-INST-060 — Force range inputs visible
- Steps:
  1. Observe force range inputs
- Expected: Two number inputs with placeholders "Min" and "Max". Two range sliders. Reset link button. "Any" text indicator.

### TC-APP-006 — Zero volume edge case
- Steps:
  1. Create app with volume=0
- Expected: Either accepted (app created) or rejected with validation. Document behavior.

### TC-APP-008 — Extremely large volume
- Steps:
  1. Create app with volume=999999999
- Expected: Either accepted with formatted display or rejected. Check number formatting.

### TC-APP-011 — ESC key closes modal
- Steps:
  1. Open Setup New Application modal
  2. Press Escape key
- Expected: Modal closes. No app created.

### TC-APP-014 — Remove fastener before save
- Steps:
  1. Add a fastener in new app modal
  2. Remove the fastener entry before saving
  3. Click Save
- Expected: App created without the removed fastener.

### TC-APP-020 — Add fastener to existing app
- Precondition: App exists without fasteners
- Steps:
  1. Edit existing app
  2. Add a fastener
  3. Save
- Expected: Fastener added to existing app. Visible on re-edit.

### TC-APP-021 — Remove fastener from existing app
- Precondition: App exists with fasteners
- Steps:
  1. Edit existing app
  2. Remove a fastener entry
  3. Save
- Expected: Fastener removed. App card updates.

### TC-APP-034 — Empty table state in Use Existing modal
- Steps:
  1. Open Use Existing Application with no saved apps
- Expected: Table shows empty state message "No applications found". Buttons still visible.

### TC-APP-038 — Clear selection button state
- Steps:
  1. With no apps: observe Clear selection button
  2. Add an app: observe button state
- Expected: Clear selection disabled when no apps loaded. Enabled when at least one app loaded.

### TC-APP-040 — Customize assumptions modify and save
- Precondition: App loaded
- Steps:
  1. Open Customize assumptions
  2. Modify a value (e.g., utilization rate)
  3. Click Save/Apply
- Expected: Assumptions updated. Portfolio KPIs may recalculate.

### TC-APP-041 — Customize assumptions cancel without saving
- Precondition: App loaded
- Steps:
  1. Open Customize assumptions
  2. Modify a value
  3. Click Cancel
- Expected: Changes NOT applied. Assumptions remain at previous values.

### TC-APP-044 — Special characters in app name
- Steps:
  1. Create app with name "Test-App #1 (OEM)"
- Expected: App created with special characters. Name displays correctly.

### TC-APP-045 — Long app name
- Steps:
  1. Create app with very long name (500+ chars)
- Expected: Long name truncated, wrapped, or rejected. No UI breaking or crash.

### TC-APP-046 — Remove all fasteners then save
- Precondition: App exists with one fastener
- Steps:
  1. Edit app with fastener
  2. Remove the only fastener
  3. Save
- Expected: App saved without fasteners. App card updates.

### TC-APP-047 — Search functionality in Use Existing modal
- Precondition: Multiple apps exist in system
- Steps:
  1. Open Use Existing Application modal
  2. Use search/filter field
  3. Type app name
- Expected: Table filters to show matching apps only. Search clears to restore full list.

### TC-INST-APP-01 — Setup New Application modal UI
- Steps:
  1. Click "Setup New Application" under Option B
- Expected: Modal heading "New application" with fields: name (required), app-no, OEM, program, volume, batch-size, material. Buttons: Add fastener, Cancel, Save, × close.

### TC-INST-APP-02 — Setup New Application save with name only
- Steps:
  1. Click "Setup New Application"
  2. Fill name field only
  3. Click Save
- Expected: Modal closes. App appears in params section. Option B shows "Selected: {name}". "Reset application" button appears.

### TC-INST-APP-03 — Setup New Application save with all fields
- Steps:
  1. Click "Setup New Application"
  2. Fill all fields
  3. Click Save
- Expected: App card shows name, app number, volume. Portfolio totals update.

### TC-INST-APP-04 — Required field validation
- Steps:
  1. Open modal, leave name empty, click Save
- Expected: Save is prevented. Modal remains open. No app created.

### TC-INST-APP-05 — Negative volume validation
- Steps:
  1. Open modal, enter negative volume, try to save
- Expected: Input validation prevents negative value or save is blocked.

### TC-INST-APP-06 — Zero batch size
- Steps:
  1. Open modal, set batch size to 0, try to save
- Expected: Either app saves successfully or validation prevents it.

### TC-INST-APP-07 — Cancel closes modal
- Steps:
  1. Fill fields, click Cancel
- Expected: Modal closes. No app created.

### TC-INST-APP-08 — × close button
- Steps:
  1. Fill fields, click ×
- Expected: Modal closes. No app created.

### TC-INST-APP-09 — Add single fastener
- Steps:
  1. Fill name, add fastener (brand, type, qtyA, qtyB), save
- Expected: App created with fastener details.

### TC-INST-APP-10 — Add multiple fasteners
- Steps:
  1. Fill name, add 2 fasteners, save
- Expected: App created with 2 fasteners.

### TC-INST-APP-11 — After save auto-sets filters
- Steps:
  1. Create app
- Expected: Element types chip updates. Matching product count changes. Reset application button appears.

### TC-INST-APP-12 — Portfolio updates after save
- Steps:
  1. Create app with volume and batch size
- Expected: Total annual volume matches entered volume. Parts/year matches.

### TC-INST-APP-13 — Edit existing application
- Precondition: App exists
- Steps:
  1. Click Edit on app card
  2. Modify fields
  3. Click Save
- Expected: Edit form opens pre-filled. App updates after save.

### TC-INST-APP-14 — Cancel edit preserves values
- Precondition: App exists
- Steps:
  1. Click Edit, change fields, click Cancel
- Expected: Original values preserved.

### TC-INST-APP-15 — Remove application
- Precondition: App exists
- Steps:
  1. Click Remove on app card
- Expected: App removed. "No application selected" returns. Empty state returns.

### TC-INST-APP-16 — Reset application
- Precondition: App exists and is selected
- Steps:
  1. Click "Reset application" under Option B
- Expected: Filters reset. App deselected but still in params section.

### TC-INST-APP-17 — Use Existing Application modal UI
- Steps:
  1. Click "Use Existing Application"
- Expected: Modal with heading "My applications", table with Select/Name/App No./OEM/etc. Buttons: Select all, New application, Refresh, Edit, Delete, Close, OK.

### TC-INST-APP-18 — Select and load existing app
- Precondition: App exists in system
- Steps:
  1. Open Use Existing modal
  2. Check an app row
  3. Click OK
- Expected: App loads into params section. Option B shows selected app.

### TC-INST-APP-19 — Select all
- Steps:
  1. Open modal, click Select all, click OK
- Expected: Multiple (or all) apps load into params section.

### TC-INST-APP-20 — New application from modal
- Steps:
  1. Open modal, click New application
- Expected: Setup New Application form opens. User can create app from this entry point.

### TC-INST-APP-21 — Delete from modal
- Precondition: App exists in system
- Steps:
  1. Open modal, click Delete in a row's Actions column
- Expected: App deleted from system.

### TC-INST-APP-22 — Edit from modal
- Precondition: App exists in system
- Steps:
  1. Open modal, click Edit in a row's Actions column
- Expected: Edit form opens pre-filled.

### TC-INST-APP-23 — Refresh list
- Steps:
  1. Open modal, click Refresh
- Expected: List refreshes. Modal remains visible.

### TC-INST-APP-24 — Close modal without selecting
- Steps:
  1. Open modal, click Close
- Expected: Modal closes. No app selected.

### TC-INST-APP-25 — Add existing from params section
- Steps:
  1. Click "Add existing application" in params section
- Expected: Same Use Existing modal opens. Select and load app into params.

### TC-INST-APP-26 — Add new application from params section
- Steps:
  1. Click "Add new application" in params section
- Expected: Same setup new application form opens. Create app fills into params.

### TC-INST-APP-27 — Add two applications
- Steps:
  1. Create first app via Setup New Application
  2. Add second app via Add new application
- Expected: Both apps appear. Heading shows count. Portfolio totals combine.

### TC-INST-APP-28 — Remove one of two apps
- Precondition: Two apps exist
- Steps:
  1. Remove one app card
- Expected: One app removed. Other remains. Portfolio recalculates.

### TC-INST-APP-29 — Clear selection
- Precondition: App(s) loaded
- Steps:
  1. Click "Clear selection"
- Expected: All apps cleared. Empty state returns. Filters reset.

### TC-INST-APP-30 — Customize assumptions
- Precondition: App loaded
- Steps:
  1. Click "Customize assumptions"
- Expected: Assumptions configuration dialog/panel opens.

### TC-APP-031 — Use Existing app delete from modal
- Precondition: App exists in system
- Steps:
  1. Open Use Existing modal
  2. Click Delete on a row
- Expected: Delete action is attempted. Confirmation dialog may appear.

### TC-APP-032 — Use Existing app refresh list
- Precondition: Use Existing modal open
- Steps:
  1. Click Refresh button
- Expected: Table data refreshes.

### TC-APP-033 — Use Existing app close without selecting
- Precondition: Use Existing modal open
- Steps:
  1. Click Close button
- Expected: Modal closes. No app selected.

### TC-APP-035 — Multiple apps add two via add new
- Precondition: One app already created
- Steps:
  1. Click Add new application
  2. Fill form and save
- Expected: Both apps visible. Heading shows count.

### TC-APP-036 — Multiple apps verify portfolio calculations
- Precondition: Two apps with different volumes
- Steps:
  1. Create App One with volume=100000
  2. Create App Two with volume=50000
- Expected: Total annual volume shows combined value (150,000).

### TC-APP-037 — Clear selection removes all apps
- Precondition: Apps loaded
- Steps:
  1. Click Clear selection
- Expected: All apps cleared. Empty state returns.

### TC-APP-039 — Customize assumptions modal opens
- Precondition: App loaded
- Steps:
  1. Click Customize assumptions
- Expected: Customize assumptions modal/dialog opens.

### TC-APP-042 — Add existing from params section
- Precondition: App exists in system
- Steps:
  1. Clear selection
  2. Click Add existing application under params section
  3. Select an app and click OK
- Expected: App loads into params section.

### TC-APP-043 — Add new from params section
- Precondition: On installation-system page
- Steps:
  1. Click Add new application under params section
  2. Fill form and save
- Expected: App created and displayed.
