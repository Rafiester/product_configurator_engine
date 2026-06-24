# Configurator Table Layout & Scroll Improvements

## Objective
Improve the Configurator Builder table usability and visual consistency without changing any business logic, calculations, CRUD operations, save functionality, import/export functionality, or existing configurator behavior.

---

## Layout Improvements

### 1. Horizontal Table Scroll
The table is currently being cut off on smaller viewports and some columns become inaccessible.

Implement:

- Wrap the entire builder table inside a horizontal scroll container.
- Allow horizontal scrolling when table width exceeds available card width.
- Do NOT shrink columns aggressively.
- Preserve current column widths.

Example:

```tsx
<div className="overflow-x-auto">
  <table className="min-w-[1400px] w-full">
    ...
  </table>
</div>
```

Requirements:

- Desktop: table remains fully visible.
- Smaller screens: horizontal scrolling appears automatically.
- No content clipping.
- No hidden columns.
- Grand Total row must remain aligned with table columns.

---

### 2. Match Card Content Padding

Current issue:
The table starts closer to the card edge than the title/description section.

Adjust spacing so table aligns perfectly with:

- Configurator Title
- Description
- Status Badge
- Summary Metrics

Use consistent spacing:

```css
padding-left: 32px;
padding-right: 32px;
```

Apply to:

- Table header
- Table body
- Grand total section
- Save button container

Result:

All content should visually align on the same vertical grid.

---

### 3. Save Button Alignment

Current issue:
Save Configuration button alignment feels detached from table layout.

Requirements:

- Keep button bottom-right.
- Align button with table horizontal padding.
- Match right edge of table content.
- Maintain spacing below table.

Suggested spacing:

```css
padding-top: 24px;
padding-bottom: 32px;
padding-right: 32px;
```

---

## Save Button Visual Refresh

Replace current styling with pastel pink SaaS design.

### Dark Mode

Background:

```css
#EC7FB6
```

Hover:

```css
#F090C1
```

Text:

```css
#FFFFFF
```

Shadow:

```css
0 8px 24px rgba(236,127,182,0.25)
```

---

### Light Mode

Background:

```css
#EC7FB6
```

Text:

```css
#FFFFFF
```

Border:

```css
1px solid rgba(236,127,182,0.25)
```

---

### Button Specs

```css
height: 52px;
padding-inline: 28px;
border-radius: 14px;
font-size: 15px;
font-weight: 600;
```

Use same visual language as:

- Collapse Builder button
- Dashboard pastel pink accents
- Success modal actions

---

## Table Responsiveness

Requirements:

### Never allow:

- Column clipping
- Text overlapping
- Grand Total misalignment
- Margin % column being cut off

### Always allow:

- Horizontal scroll
- Full table visibility
- Consistent spacing
- Proper column alignment

---

## Functional Safety Requirements

DO NOT modify:

- Configurator CRUD
- Save Configuration logic
- Product selection logic
- Margin calculations
- SDP calculations
- Total SDP calculations
- Page Price calculations
- SRP calculations
- Grand Total calculations
- Import Product functionality
- Export Product functionality
- Dashboard widgets
- Dark Mode toggle logic
- Light Mode toggle logic

This update is strictly UI/layout only.

---

## Acceptance Criteria

✓ Entire table accessible without clipping

✓ Horizontal scrolling appears when required

✓ Margin % column always visible

✓ Table aligned with card title and description

✓ Save button aligned with table content

✓ Save button updated to pastel pink SaaS style

✓ Grand Total row remains correctly aligned

✓ Dark Mode preserved

✓ Light Mode preserved

✓ No changes to calculations or data persistence

✓ Configurator save functionality remains fully operational