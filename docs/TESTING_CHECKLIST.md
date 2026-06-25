# Testing Checklist

Whenever major changes occur, ensure this manual testing checklist is run to verify core app functionality.

## Products
- [ ] Create product successfully (starts completely empty, placeholders match specs)
- [ ] Edit product details (verify base fields, SDP, Page Price, SRP, Global Qty)
- [ ] Delete product (triggers custom modal)
- [ ] Import Excel (skips duplicates, parses cleanly)
- [ ] Export Excel (contains properly formatted numbers, colors, and calculated columns)
- [ ] Search/filter input returns correct datasets
- [ ] Verify Light mode readability
- [ ] Verify Dark mode readability

## Master Categories
- [ ] Create new category successfully (starts empty, select status unselected by default)
- [ ] Edit category (name change cascades to all existing products and mappings)
- [ ] Delete category (verifies deletion is blocked if category is associated with products)
- [ ] Verify active categories dynamically populate the dropdown options in Product details

## PC Builder
- [ ] Create new Builder successfully
- [ ] Edit Builder name/status
- [ ] Expand dynamic Builder interface
- [ ] Category rows collapse and expand
- [ ] Dropdowns successfully list all active products in that category
- [ ] Quantity changes correctly trigger live pricing re-renders
- [ ] Save build executes without breaking
- [ ] Verify Grand Total calculations match manually calculated test data
- [ ] Verify Margin calculation is logically sound

## Theme & UI
- [ ] Toggle Dark/Light mode from the user profile dropdown
- [ ] Check global text contrast
- [ ] Check hover states on Pastel Pink buttons (verify color changes when hovered)
- [ ] Check table borders and alternating row styling readability
