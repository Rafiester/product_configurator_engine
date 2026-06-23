Refactor the Configurator module flow to simplify the UI and remove unnecessary separate edit-page builder flow.

The spreadsheet-style Dynamic PC Builder is already correct. Keep that builder layout and move it into the main Configurator card/list page.

This is a UI/UX flow simplification task. Do not change pricing calculations or backend business logic unless required for saving from the main page.

---

# CORE GOAL

Change the Configurator flow from:

Configurator List
→ Edit Configurator Page
→ Dynamic PC Builder

Into:

Configurator List
→ Expand Builder directly inside configurator card
→ Edit/save configuration in the same page

---

# 1. CONFIGURATOR LIST PAGE

Each configurator should be displayed as a card or clean list row.

Each configurator item must show:

* Configurator name
* Status badge: Publish / Unpublish or Active / Inactive
* Actions:

  * Edit Details
  * Delete
  * Expand Builder / Collapse Builder

---

# 2. REMOVE SEPARATE BUILDER PAGE FLOW

Do not require the user to open a separate edit page just to access the Dynamic PC Builder.

The Dynamic PC Builder should be embedded directly inside the expanded configurator card.

The separate edit page should only be used for basic configurator metadata if still needed, such as:

* Name
* Status

But the builder itself must live in the main Configurator page.

---

# 3. EXPAND / COLLAPSE BUILDER

Add an Expand / Collapse button on each configurator card.

Behavior:

* Default: collapsed
* Click "Expand Builder" → show Dynamic PC Builder inside that card
* Click "Collapse Builder" → hide builder
* Only one builder should be open at a time if possible, to keep the UI clean

Button style:

* Pastel pink primary accent
* Smooth transition
* Text changes dynamically:

  * Expand Builder
  * Collapse Builder

---

# 4. EMBED EXISTING SPREADSHEET BUILDER

Keep the existing Dynamic PC Builder table layout exactly as the stable version.

Builder columns:

* Category
* Product
* Qty
* SDP (RM)
* Total SDP (RM)
* Page Price (RM)
* SRP (RM)
* Margin
* Margin %

Rows:

* GPU
* RAM
* CPU
* Chassis
* Motherboard
* SSD
* PSU
* Cooler
* ARGB / Accessories

Do not convert it into rule blocks, chips, or nested cards.

Keep it as spreadsheet-style table.

---

# 5. REMOVE INTERNAL SCROLL

The builder must not have internal scroll inside the card/tab.

Rules:

* No overflow-y-auto inside builder
* No fixed max-height scroll container
* No nested scrolling
* The page itself should handle scrolling naturally

If the builder is long, allow the full page to scroll, not the builder card.

---

# 6. SAVE CONFIGURATION

Place the "Save Configuration" button inside the expanded builder header.

Position:

* Top right of builder section

Style:

* Pastel pink primary button
* White text
* Rounded
* Soft shadow

Behavior:

* Saves the current builder selections
* Ignores empty/unselected rows safely
* Does not delete master products
* Only updates the configurator’s selected components

---

# 7. CONFIGURATOR CARD HEADER

When collapsed, each configurator card should stay compact.

Header layout:

Left:

* Configurator name
* Status badge

Right:

* Edit Details
* Delete
* Expand Builder

When expanded:

* Same header remains visible
* Builder appears below the header

---

# 8. IMPORTANT UI RULES

Do not reintroduce:

* Rule engine UI
* Chip-heavy UI
* Separate preview page
* Separate builder edit page
* Nested product manager inside configurator
* Internal scrolling containers

The correct layout is:

Configurator Card
↓
Expand Builder
↓
Spreadsheet Dynamic PC Builder Table
↓
Save Configuration

---

# 9. UX GOAL

After implementation:

* Configurator flow becomes shorter and easier
* Admin does not need to switch pages
* Builder is accessible directly from the configurator card
* Spreadsheet builder remains stable and familiar
* Page feels like a SaaS admin tool, not a multi-page form maze

---

# 10. DO NOT CHANGE

* Product master data structure
* Pricing formula
* Margin formula
* Product CRUD flow
* Existing dropdown calculation behavior

Only simplify the configurator layout and move the stable builder into the main configurator card.
