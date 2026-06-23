# Testing Checklist

Whenever major changes occur, ensure this manual testing checklist is run to verify core app functionality.

## Products
- [ ] Create product successfully
- [ ] Edit product details
- [ ] Delete product (triggers custom modal)
- [ ] Import Excel (skips duplicates, parses cleanly)
- [ ] Export Excel (contains properly formatted numbers, colors, and calculated columns)
- [ ] Search/filter input returns correct datasets
- [ ] Verify Light mode readability
- [ ] Verify Dark mode readability

## Configurator
- [ ] Create new Configurator successfully
- [ ] Edit Configurator name/description
- [ ] Expand dynamic Builder interface
- [ ] Category rows collapse and expand
- [ ] Dropdowns successfully list all active products in that category
- [ ] Quantity changes correctly trigger live pricing re-renders
- [ ] Save configuration executes without breaking
- [ ] Verify Grand Total calculations match manually calculated test data
- [ ] Verify Margin calculation is logically sound

## Theme & UI
- [ ] Toggle Dark/Light mode from the user dropdown
- [ ] Check global text contrast
- [ ] Check hover states on Pastel Pink buttons
- [ ] Check table borders and alternating row styling readability
