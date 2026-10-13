# Test Web Machine Configuration Flow

## Fixtures
- Use `web-engineer-auth.fixture.js` for authenticated tests (Engineering role)
- Use `web-customer-auth.fixture.js`, `web-distributor-auth.fixture.js`, `web-sales-auth.fixture.js` for cross-role tests

## Page Objects
- `TestWebInstallationSystemPage` — to select solutions and open the configure panel
- `TestWebMachineConfigurationPage` — the machine configuration panel

## Test Cases

### TC-MC-01 — Open configuration panel from solution comparison
- Steps:
  1. Navigate to /installation-system
  2. Select a solution checkbox (e.g. "A210")
  3. Click "Compare / Configure Solutions" button
  4. Click "Configure Solution" on the solution card
- Expected: Configuration panel opens with heading "Configure solution A210". Sub-heading shows machine details. Filter controls and options sections are visible.

### TC-MC-02 — Filter controls displayed in configure panel
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: Filter controls are visible: Fastener group dropdown, Feeder tracks dropdown, Force (kN) range slider. Filtered info text is displayed.

### TC-MC-03 — Machine options section displays option cards
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Machine" section heading is visible. Option cards show name, price, part number, description. Cards for hand tool variants are displayed with prices.

### TC-MC-04 — Options section displays accessory cards
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Options" section heading is visible. Accessory cards are displayed with prices (Process monitoring, MQTT interface, OPC UA interface, Quality Data Viewer, etc.)

### TC-MC-05 — Custom Tooling section displayed
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Custom Tooling" section heading is visible. Custom Tooling card shows price "$0.00" and description about custom tooling placeholder.

### TC-MC-06 — Configuration summary section displayed
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Configuration summary" heading is visible. "Selected options total" shows initial total. "Add manual line item", "Request Quotation / Support" buttons are visible.

### TC-MC-07 — Select a machine option updates total
- Steps:
  1. Open configuration panel for solution "A210"
  2. Click "Add to configuration" or select a machine option (e.g. "Changeover set blind rivet nut f. hand tool A210")
- Expected: The option appears in the Configuration summary. Selected options total updates to reflect the added option price ($615.00).

### TC-MC-08 — Select multiple options updates total cumulatively
- Steps:
  1. Open configuration panel for solution "A210"
  2. Add a machine option
  3. Add an Options section item (e.g. "Process monitoring (force/stroke) (A210)")
- Expected: Both options appear in summary. Total reflects sum of both prices.

### TC-MC-09 — Configuration summary shows option details
- Precondition: One option is selected (e.g. "Changeover set")
- Steps:
  1. Observe the selected option in configuration summary
- Expected: Option name, price, tooling part number, tooling type, quantity (1), and unit price are displayed.

### TC-MC-10 — Download quotation button visible
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Download quotation" button is visible in the configuration summary.

### TC-MC-11 — Download Word button visible
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Download Word" button is visible in the configuration summary.

### TC-MC-12 — Add manual line item button visible
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Add manual line item" button is visible in the configuration summary.

### TC-MC-13 — Request Quotation / Support button visible
- Steps:
  1. Open configuration panel for solution "A210"
- Expected: "Request Quotation / Support" button is visible in the configuration summary.

### TC-MC-14 — Close button dismisses configuration panel
- Steps:
  1. Open configuration panel for solution "A210"
  2. Click × close button on the panel
- Expected: Configuration panel closes. Page returns to solution comparison view.

### TC-MC-15 — All 4 roles can open configuration panel
- Steps:
  1. Repeat for each role (Engineering, Customer, Distributor, Sales):
     a. Log in as role
     b. Navigate to /installation-system
     c. Select solution "A210"
     d. Click "Compare / Configure Solutions"
     e. Click "Configure Solution"
- Expected: All 4 roles can successfully open the configuration panel with options visible.

### TC-MC-16 — Force range filter updates options
- Steps:
  1. Open configuration panel for solution "A210"
  2. Note initial machine option count
  3. Adjust force range slider
- Expected: Available machine options update based on force range filter. Filtered options reflect the selected force range.

### TC-MC-17 — Filter by fastener group
- Steps:
  1. Open configuration panel for solution "A210"
  2. Change "Fastener group" filter
- Expected: Machine options are filtered by the selected fastener group.

### TC-MC-18 — Open configuration for a different solution
- Steps:
  1. Navigate to /installation-system
  2. Select two solutions: "A210" and "824 eDrive"
  3. Click "Compare / Configure Solutions"
  4. Click "Configure Solution" on "824 eDrive" card
- Expected: Configuration panel opens for "824 eDrive" with its specific machine options and pricing.

### TC-MC-19 — Auto-Feed toggle is visible on MSPe machine comparison card
- Steps:
  1. Navigate to /installation-system
  2. Select solution "824 MSPe"
  3. Click "Compare / Configure Solutions"
- Expected: The comparison card for 824 MSPe shows an "Auto-Feed On" toggle button with aria-pressed="true"

### TC-MC-20 — Toggle Auto-Feed Off changes the displayed state
- Steps:
  1. Navigate to /installation-system
  2. Select solution "824 MSPe"
  3. Click "Compare / Configure Solutions"
  4. Click the Auto-Feed toggle button
- Expected: Toggle text changes to "Auto-Feed Off". aria-pressed changes to "false". Slider moves to left position.

### TC-MC-21 — Toggle Auto-Feed On and Off cycles state
- Steps:
  1. Navigate to /installation-system
  2. Select solution "824 MSPe"
  3. Click "Compare / Configure Solutions"
  4. Toggle Auto-Feed Off, then back On
- Expected: Final state is "Auto-Feed On" with aria-pressed="true"

### TC-MC-22 — Auto-Feed toggle affects costs on MSPe machine
- Steps:
  1. Navigate to /installation-system
  2. Select solution "824 MSPe"
  3. Click "Compare / Configure Solutions"
  4. Note initial Total Installation Cost per Part value
  5. Toggle Auto-Feed Off
- Expected: Total Installation Cost per Part value changes after toggling Auto-Feed

### TC-MC-23 — Auto-Feed toggle not visible on non-MSPe machines
- Steps:
  1. Navigate to /installation-system
  2. Select solution "A210" (Handtools)
  3. Click "Compare / Configure Solutions"
- Expected: Auto-Feed toggle is NOT visible on the A210 comparison card

### TC-MC-24 — Auto-Feed toggle on 618 MSPe comparison card
- Steps:
  1. Navigate to /installation-system
  2. Select solution "618 MSPe"
  3. Click "Compare / Configure Solutions"
- Expected: The comparison card for 618 MSPe shows the Auto-Feed toggle (similar to 824 MSPe)

### TC-MC-023 — Different solutions show different options
- Steps:
  1. Select A210, configure, note options
  2. Close, configure 824 eDrive
- Expected: Different solutions show different machine options and accessories specific to that product.

### TC-MC-028 — Price format USD
- Steps:
  1. Open configuration panel
- Expected: Prices in USD: $X,XXX.XX format. Thousands separated by commas.

### TC-MC-029 — Total shows $0.00 default
- Steps:
  1. Open configuration panel with no selections
- Expected: "Selected options total" shows $0.00 or equivalent.

### TC-MC-030 — Select/deselect same option
- Steps:
  1. Add option (total=$615)
  2. Remove option (total=$0)
  3. Add again (total=$615)
- Expected: Toggle works correctly. No double-counting.

### TC-MC-031 — Zero options with restrictive filters
- Steps:
  1. Apply very restrictive config filters
- Expected: Zero options shown. Empty state or message may appear.

### TC-MC-002 — Header info displayed in config panel
- Steps:
  1. Open configuration panel for A210
- Expected: Header shows solution info (A210). Close button present.

### TC-MC-005 — Filter by feeder tracks
- Steps:
  1. Open configuration panel
  2. Change Feeder tracks dropdown
- Expected: Panel remains functional. Options update.

### TC-MC-007 — Combined filters update options
- Steps:
  1. Open configuration panel
  2. Set all 3 filters (Fastener group, Feeder tracks, Force)
- Expected: All filters applied simultaneously. Panel remains functional.

### TC-MC-008 — Available machine options heading visible
- Steps:
  1. Open configuration panel
- Expected: "Available machine options" heading is visible.

### TC-MC-014 — Add accessory option updates total
- Steps:
  1. Open configuration panel
  2. Click an option in Options section
- Expected: Option added. Total reflects addition.

### TC-MC-017 — Remove selected option updates total
- Steps:
  1. Open configuration panel
  2. Add a machine option
  3. Remove it from summary
- Expected: Option removed from summary.
