# Runbook: Fixing PC Builder Product Save/Render Issues

If the PC Builder stops saving or stops displaying saved products after a page reload, follow these step-by-step diagnostic and fix procedures.

## Step 1: Verify the Request Payload & Database Save
First, determine if the issue is in the backend (database/controller) or frontend (Alpine.js/Blade).

1. Check `storage/logs/laravel.log`.
2. Look for the `PC_BUILDER_ITEMS_TRANSFORMED` and `PC_BUILDER_DB_WRITE_SUCCESS` log entries.
   ```bash
   grep -C 5 "PC_BUILDER_DB_WRITE_SUCCESS" storage/logs/laravel.log
   ```
3. **If you DO NOT see `PC_BUILDER_DB_WRITE_SUCCESS`:**
   - The backend is failing validation. Check if any new required columns were added to the `configurator_product_mappings` table.
   - Check if the CSRF token has expired or if the user was logged out.
4. **If you DO see `PC_BUILDER_DB_WRITE_SUCCESS`:**
   - The data is correctly saved in the database. The issue is 100% on the frontend rendering. Proceed to Step 2.

## Step 2: Verify Master Data Category Spelling
The PC Builder relies on strict category mapping.

1. Open `resources/views/configurators/index.blade.php`.
2. Check the `categories` array in the `Alpine.data` initialization:
   ```javascript
   categories: ['GPU', 'RAM', 'CPU', 'Chassis', 'Motherboard', 'SSD', 'PSU', 'Cooler', 'ARGB / Accessories']
   ```
3. Run `php artisan tinker` and ensure no products have misspelled categories (e.g., trailing spaces like `"GPU "` or mismatched case like `"gpu"`):
   ```php
   App\Models\Product::pluck('category')->unique();
   ```
4. **Fix:** Ensure `resources/views/products/create.blade.php` and `edit.blade.php` use a strict `<select>` dropdown for `category` that perfectly matches the `categories` array in Alpine.js. Do not allow free-text typing.

## Step 3: Fix Alpine.js Dropdown Race Conditions
If the prices and quantities load correctly on page refresh, but the Product Dropdown shows `-- Select Product --`, the UI is experiencing a timing issue.

1. Open `resources/views/configurators/index.blade.php`.
2. Locate the `<select x-model="row.product_id">` block.
3. Ensure the `<option>` element inside the `<template x-for>` loop has a native HTML `:selected` binding tied to the `row.product_id`.

**Correct Format:**
```html
<select x-model="row.product_id" @change="onProductChange(row)" class="...">
    <option value="">-- Select Product --</option>
    <template x-for="product in (productsByCategory[row.category] || [])" :key="product.id">
        <option :value="product.id" :selected="product.id == row.product_id" x-text="product.name"></option>
    </template>
</select>
```
*Note: Without the `:selected` attribute, Alpine.js may evaluate `x-model` before the dynamic options exist in the DOM, causing the dropdown to visually revert to the blank option.*

## Step 4: Verify Legacy / Inactive Product Handling
If a product was deleted or marked inactive but is still part of an old configurator, it will not appear in `$allProductsByCategory`.

1. Ensure the `init()` method inside the Alpine component injects the legacy product into `this.productsByCategory` dynamically.
2. The logic should look for `existingSelections` and push a fallback object:
   ```javascript
   this.productsByCategory[category].push({
       id: existing.id,
       name: existing.name + ' (Inactive)',
       sdp: existing.pivot.sdp,
       // ... other pivot fields
   });
   ```
