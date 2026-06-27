# Context & Task Update
The "Create New Builder" modal is looking good with the component category checklist. Now, we need to implement the core logic in the **Builder Table View** to support adding **multiple instances of ANY category**. 

Whether the user wants 2 RAMs, 2 GPUs, multiple ARGB/Accessories, or multiple Storage/SSDs, the system must handle duplicate categories flawlessly without overwriting data. The Grand Total and Save functionalities must remain perfectly intact.

Please implement the code using my current tech stack: [TULIS_TECH_STACK_KAMU_DISINI, cth: React + Tailwind CSS + TypeScript]. Ensure full support for Dark/Light mode and responsive mobile layouts.

# Detailed Requirements

## 1. Refactor State Management (Crucial for ALL Categories)
* **Change from Object to Array of Objects:** The current state likely uses categories as object keys (which prevents duplicate categories). You MUST refactor the builder state into an array of objects. Every row must have a unique identifier (like a UUID), not just a category name.
* **Expected State Structure (Example showing duplicates across different categories):**
  ```json
  [
    { "id": "uuid-1", "category": "CPU", "productId": null, "price": 0, "qty": 1 },
    { "id": "uuid-2", "category": "GPU", "productId": null, "price": 0, "qty": 1 },
    { "id": "uuid-3", "category": "GPU", "productId": null, "price": 0, "qty": 1 }, 
    { "id": "uuid-4", "category": "RAM", "productId": null, "price": 0, "qty": 1 },
    { "id": "uuid-5", "category": "RAM", "productId": null, "price": 0, "qty": 1 },
    { "id": "uuid-6", "category": "ARGB / Accessories", "productId": null, "price": 0, "qty": 1 }
  ]