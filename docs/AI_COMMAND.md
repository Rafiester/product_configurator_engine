# Fix Missing Nested Horizontal Scroll Inside Configurator Builder Table

## Current Problem

The Dynamic PC Builder table is wider than the card container.

However:

- Table width expands the card/container.
- No horizontal scrollbar appears.
- Right-most columns become inaccessible.
- User cannot scroll inside the builder section.

This means overflow is happening at the wrong container level.

---

## Required Behavior

The Configurator Card should remain fixed width.

The Builder Table should become horizontally scrollable inside the card.

User must be able to:

- Scroll left/right inside table area
- Access SRP
- Access Margin
- Access Margin %
- Access Grand Total columns

without expanding the card width.

---

## Correct Structure

Use:

```tsx
<Card>

  <ConfiguratorHeader />

  <div className="builder-table-wrapper">
      <div className="builder-scroll-container">
          <table>
              ...
          </table>
      </div>
  </div>

</Card>
```

---

## Container Rules

### Builder Wrapper

```css
.builder-table-wrapper {
  width: 100%;
  overflow: hidden;
}
```

---

### Scroll Container

```css
.builder-scroll-container {
  width: 100%;
  overflow-x: auto;
  overflow-y: hidden;

  scrollbar-width: thin;

  -webkit-overflow-scrolling: touch;
}
```

---

### Table Width

DO NOT use:

```css
width: 100%;
```

for the table.

Instead use:

```css
min-width: 1500px;
```

or

```css
min-width: max-content;
```

Example:

```tsx
<table className="min-w-[1500px]">
```

This forces the table to be wider than the card and activates horizontal scrolling.

---

## Important

Remove any of these if present:

```css
overflow-hidden
```

on:

- table container
- builder section
- card body

because they block horizontal scrolling.

---

## Grand Total Row

Grand Total must remain inside the same scrollable table.

Do NOT separate it outside the table.

Otherwise alignment will break.

---

## Scrollbar Styling

Dark Mode:

```css
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #131b2d;
}

::-webkit-scrollbar-thumb {
  background: #EC7FB6;
  border-radius: 999px;
}
```

---

## Acceptance Criteria

✓ Card width stays fixed

✓ Table does not stretch card

✓ Horizontal scrollbar visible

✓ User can scroll to SRP

✓ User can scroll to Margin

✓ User can scroll to Margin %

✓ Grand Total remains aligned

✓ Desktop works

✓ Mobile works

✓ No changes to calculations

✓ No changes to save functionality

✓ No changes to CRUD operations

This is a layout-only fix.