# Mobile Version Optimization Based on Existing UI

Create a dedicated mobile experience for the application by adapting the current UI and all existing features to mobile screens.

## Objective

The current desktop design is already approved and should be treated as the source of truth.

Your task is NOT to redesign the application.

Your task is to optimize the existing UI, components, layouts, and workflows for mobile devices while preserving the current visual identity, user experience, color scheme, hierarchy, and functionality.

---

## Important Constraints

### Preserve Existing Design

* Maintain current design language.
* Maintain current dark theme.
* Maintain current component styling.
* Maintain current visual hierarchy.
* Maintain current branding and spacing philosophy.

### Do Not Affect

* Desktop layout
* Tablet layout
* Existing business logic
* Existing API integrations
* Existing database structure
* Existing features

Desktop and tablet experiences must remain unchanged.

---

## Mobile Optimization Scope

Perform a complete mobile responsiveness audit across the application and adapt every existing screen accordingly.

### Navigation

* Convert desktop navigation into a mobile-friendly experience.
* Ensure all existing navigation items remain accessible.
* Preserve current user menu and dark mode functionality.

### Dashboard

* Adapt all current cards, widgets, statistics, charts, and components to fit mobile screens.
* Preserve information hierarchy.
* Prevent overflow and clipping.

### Master Data

Review all existing UI and optimize for mobile:

* Header actions
* Search section
* Filters
* Product listing
* Pagination
* CRUD actions
* Import / Export functions
* Status indicators
* Forms and dialogs

### Configurator

Review all existing configurator workflows and optimize for mobile:

* Component selectors
* Filtering
* Build summary
* Pricing display
* Validation states
* Action buttons

### Forms

Review all existing forms:

* Create Product
* Edit Product
* Import dialogs
* Settings forms
* Any other existing forms

Ensure every form is usable and intuitive on mobile devices.

### Tables

Audit all existing tables throughout the application.

For each table:

* Determine the most suitable mobile presentation.
* Preserve all information.
* Preserve all actions.
* Avoid horizontal scrolling whenever possible.
* Use responsive patterns that fit the existing design system.

---

## Mobile UX Requirements

* No broken layouts.
* No content overflow.
* No inaccessible actions.
* No clipped text.
* No unusable tables.
* No hidden functionality.
* Touch-friendly interaction areas.
* Smooth scrolling and navigation.
* Consistent spacing across all screens.

---

## Technical Requirements

* Mobile-first responsive implementation for screens below 768px.
* Use existing component architecture.
* Reuse existing UI components whenever possible.
* Follow current project conventions.
* Avoid duplicate components unless necessary.

---

## Expected Result

The application should feel like a polished native mobile experience while remaining visually consistent with the current desktop version.

Every existing screen, feature, component, form, table, and workflow should be reviewed and optimized for mobile without introducing a new design language or altering the approved desktop experience.
