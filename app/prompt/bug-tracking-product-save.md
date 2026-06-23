# Bug Tracking: Product Save Issues (PC Builder & Master Data)

## Overview
This document tracks a series of regression bugs related to **Products not saving** in the PC Builder and Master Data sections after UI updates.

## Timeline of Issues and Fixes

### 1. The Category Mismatch Bug
* **Symptom:** Products created in Master Data were saving to the database, but were silently failing to appear in the PC Builder dropdowns.
* **Root Cause:** The `category` field in the Product Creation/Edit forms was a free-text input. Users were typing things like `"GPU "` (with a trailing space) or `"gpu"` (lowercase), which failed to strictly match the predefined `categories` array (`['GPU', 'RAM', 'CPU', 'Chassis', 'Motherboard', 'SSD', 'PSU', 'Cooler', 'ARGB / Accessories']`) used by the Alpine.js component.
* **Fix Applied:** 
  Converted the free-text `<input name="category">` into a strict `<select name="category">` dropdown in both `resources/views/products/create.blade.php` and `resources/views/products/edit.blade.php`.

### 2. Inactive / Deleted Products Bug
* **Symptom:** Products that were saved in old Configurator builds, but later marked as inactive or deleted, would cause the PC builder to break or show empty selections.
* **Root Cause:** The `productsByCategory` object passed to Alpine.js only contained `active` products. If an `existingSelection` contained a legacy/inactive product, the UI could not render its name.
* **Fix Applied:** 
  Updated the Alpine.js `init()` function in `resources/views/configurators/index.blade.php` to append `(Inactive)` to legacy products and dynamically inject them into the `productsByCategory` array so they continue to render properly for historical records.

### 3. The AlpineJS `<select>` Race Condition Bug
* **Symptom:** When a user selected a product in the PC Builder and clicked "Save", the database correctly logged `PC_BUILDER_DB_WRITE_SUCCESS`. However, upon refreshing the page, the dropdowns would revert to `-- Select Product --` (even though the prices and quantities remained accurate).
* **Root Cause:** A timing issue between Alpine.js's `x-model` binding and `<template x-for>`. When Alpine initialized the `x-model="row.product_id"`, the dynamic `<option>` elements had not been stamped out yet by `x-for`. The browser failed to find a matching option value and reset the display to the default empty option.
* **Fix Applied:** 
  Added an explicit `:selected` HTML binding to the `<option>` tag inside the loop. This bypasses the Alpine initial timing issue by forcing the browser natively to select the matching value once it is stamped into the DOM.
  ```html
  <option :value="product.id" :selected="product.id == row.product_id" x-text="product.name"></option>
  ```

## Lessons Learned
- **UI Reactivity:** Always verify dropdown state explicitly when iterating dynamic lists inside Alpine.js `x-model`.
- **Database Logs vs UI state:** A successful database write does not guarantee a successful UI reload. When logs show success but the UI fails, the bug is almost always client-side hydration.
- **Strict Data Integrity:** Forms must enforce categorical data integrity (using `<select>`) to prevent downstream rendering bugs in strict comparisons (`===`).
