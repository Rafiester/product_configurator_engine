# Dark Mode

The application natively supports automatic theme switching between Light Mode and Dark Mode.

## Logic and State Management
- **Persistence**: AlpineJS heavily controls state management for UI paradigms, syncing user preference directly to browser `localStorage`.
- **Strategy**: It utilizes Tailwind's `.dark` class strategy injected globally onto the root `<html>` node.

## Color Mapping System
Instead of simple inversion techniques, the Dark Mode follows a strict bespoke color mapping designed to integrate cleanly with the Pastel Pink accents:
- **Backgrounds**: Surfaces turn to absolute black `#000000` or matte black `#121212` / `#18181B`.
- **Text Color Constraints**: A common frontend mistake is blindly overriding text color with `text-white` globally. 
  
  **Important Rule**:
  ```txt
  Never use `text-white` globally unless the background is always guaranteed to be dark.
  Use `text-gray-900 dark:text-gray-100` for all normal body copy.
  ```

This ensures high readability in Light mode while gracefully rendering soft whites inside Dark Mode components without hurting the user's eyes.
