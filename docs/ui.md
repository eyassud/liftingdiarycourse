# UI Coding Standards

## Component Library

**Only shadcn/ui components may be used for UI in this project.**

- Do NOT create custom UI components (buttons, inputs, cards, modals, etc.)
- Every UI element must be sourced from the shadcn/ui library
- If a needed component is not yet installed, add it via the CLI: `npx shadcn@latest add <component>`
- shadcn/ui components live in `src/components/ui/` — do not modify them

## Date Formatting

All date formatting must use **date-fns**.

Dates must be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

Use `format` with the `do MMM yyyy` format string:

```ts
import { format } from "date-fns";

format(date, "do MMM yyyy"); // → "1st Sep 2025"
```
