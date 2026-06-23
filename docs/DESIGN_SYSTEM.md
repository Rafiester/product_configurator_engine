# Design System

The PC Configurator CMS leverages an exclusive SaaS-style Pastel Pink design system, built heavily on TailwindCSS and injected dynamically into both Light and Dark modes.

## Primary Accent Palette

```txt
Pastel Pink Base: #F9A8D4
Hover State: #F472B6
Active/Focus State: #EC4899
```

## Typography & Spacing
Typography leans on Inter/System fonts, cleanly spaced using robust `py-x` and `px-x` padding arrays inside rounded cards to emulate premium modern SaaS products. Tables emphasize borderless rows or subtle horizontal dividers over rigid grid-lines.

## UI Components
- **Buttons**: Thick padding, rounded borders. Primary buttons are fully pink with high-contrast text. Secondary buttons are outlined using transparent backgrounds and pink borders.
- **Cards**: Smooth shadows, `rounded-xl` or `rounded-2xl` borders, using stark white (`bg-white`) in light mode and deep matte black (`bg-[#121212]`) in dark mode.
- **Badges**: pill-shaped `rounded-full` elements primarily used for `Publish` and `Unpublish` statuses.
- **Tables**: Clean spreadsheet-style padding with sticky headers where applicable.

This design logic is hardcoded deeply into `tailwind.config.js` and global CSS files to ensure consistency across the admin panel.
