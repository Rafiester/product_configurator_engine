Fix Products CRUD save issue after recent dark mode / UI updates.

This is a regression bug. Product create/edit was working before styling updates, but now product data no longer saves.

Do NOT redesign UI. Do NOT change database structure. Do NOT change pricing logic.

---

# CORE GOAL

Find the exact cause why Products are not saving, then fix it safely.

---

# 1. TRACE THE FULL PRODUCT SAVE FLOW

Inspect and verify:

* Product create form
* Product edit form
* ProductController store method
* ProductController update method
* Product model fillable fields
* Product routes
* CSRF token
* form method/action
* validation rules
* request payload
* redirect/error handling
* database insert/update result

---

# 2. CHECK FOR UI REGRESSION CAUSED BY DARK MODE UPDATE

Recent dark mode updates may have accidentally broken:

* input `name` attributes
* select `name` attributes
* hidden fields
* CSRF token `@csrf`
* method spoofing `@method('PUT')`
* form `action`
* submit button type
* disabled inputs
* missing required fields
* incorrect status values
* incorrect numeric field formatting

Inspect all of them carefully.

---

# 3. IMPORTANT FIELD REQUIREMENTS

Products must save these fields correctly:

* name
* category
* quantity
* sdp
* page_price
* srp
* status

If total_sdp exists, it should be calculated from:

quantity × sdp

Do not require total_sdp as manual user input unless the current backend already expects it.

---

# 4. VALIDATION FIX

Ensure validation accepts correct values:

* quantity: numeric/integer
* sdp: numeric
* page_price: numeric
* srp: numeric
* status: publish/unpublish OR active/inactive depending on existing database values

Do not mismatch status values between form and backend.

Example issue to check:
Frontend sends "Publish" but backend expects "publish" or "active".

---

# 5. DEBUG REQUIREMENT

Add temporary debugging if needed:

* log request payload
* log validation errors
* log database exception
* show form errors in UI

Use Laravel logging:

logger()->info('Product save request', $request->all());

If validation fails, make sure errors are visible on the page.

---

# 6. DATABASE / MODEL CHECK

Check Product model:

* `$fillable` includes all product fields
* casts are correct for numeric fields if needed
* no guarded issue blocking mass assignment

Check migration/database columns match form field names.

---

# 7. FORM CHECK

Ensure form includes:

* `@csrf`
* correct `method="POST"`
* edit form includes `@method('PUT')`
* submit button has `type="submit"`
* all input/select fields have correct `name=""`

---

# 8. DO NOT BREAK DARK MODE

Keep the current dark mode UI.

Only fix save functionality and any missing error display.

Do not rollback the design.

---

# 9. EXPECTED RESULT

After fix:

* Creating a product saves correctly
* Editing a product saves correctly
* Validation errors display clearly
* Laravel log shows clean request payload
* No silent failure
* Dark mode/light mode styling remains intact

Before marking complete, test BOTH:
1. Create a new product with all fields filled
2. Edit an existing product and confirm changes persist after refresh

If it fails, show the exact validation error or Laravel log output instead of guessing.