# AI Assistant Workflow Rules

When contributing to this project via AI assistance, the following rules **MUST** be adhered to:

## Strict Restrictions
- **Do not redesign stable UI** unless explicitly requested by the user. If the task is a backend logic fix, leave the CSS classes and layout completely alone.
- **Do not change backend logic during styling tasks**. If the user asks to change a button color, do not refactor the controller returning the view.
- **Always inspect existing files first**. Use tools to search for related logic, check how AlpineJS directives are currently applied, and trace Controller responses before writing blind fixes.

## Commit Guidelines
- Use conventional commits when pushing or suggesting changes.
- Ensure all tests or verification steps (from `TESTING_CHECKLIST.md`) pass before closing a task.

Example commit messages:
```txt
docs: refactor project documentation
docs: add configurator builder guide
docs: add import export documentation
feat: integrate product export logic
fix: patch alpinejs click propagation on hidden file input
```

## Documentation Philosophy
- Keep the `README.md` strictly as a high-level product overview aimed at onboarding non-technical stakeholders or new developers trying to understand *what* the app is.
- Keep all technical, architectural, and deep-dive notes isolated inside the `/docs` folder for focused reading.
