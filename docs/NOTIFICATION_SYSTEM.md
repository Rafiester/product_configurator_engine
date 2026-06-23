# Notification System

To maintain the premium SaaS aesthetic across the entire CMS, all native browser popup alerts have been rigorously stripped from the codebase and replaced with a global bespoke notification framework.

## Toast Variations
The UI dynamically triggers interactive sliding toasts depending on the context of the backend or frontend action:
- **Success Toast**: Green themed, used upon successful saves, imports, or exports.
- **Error Toast**: Red themed, used to display validation failures, missing files, or system crashes.
- **Warning Toast**: Yellow themed, used for soft-warnings.

## Modals
Destructive actions (like Delete) trigger custom AlpineJS modal overlays rather than ugly native prompts.

**Important Rule**:
```txt
Do not use alert(), confirm(), or prompt() anywhere in the codebase.
Use the custom `window.notify()` system or Blade components `<x-confirm-modal>` instead.
```
