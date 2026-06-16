# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs-First Rule

**Before generating any code, Claude Code MUST first read the relevant file(s) in the `/docs` directory.** All implementation decisions, patterns, and conventions should align with what is documented there. If a relevant docs file exists for the feature or area being worked on, consult it before writing a single line of code.

- /docs/ui.md
- /docs/data-fetching.md
- /docs/auth.mds
- /docs/data-mutations.md
- /docs/routing.md

## Commands

```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 16** with App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via `postcss.config.mjs`)
- **Geist** font family (loaded via `next/font/google`)

## Architecture

This is a fresh Next.js App Router project intended as a lifting diary app — currently just the default scaffold. All pages live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up fonts and the full-height flex body. Styling uses Tailwind utility classes directly in JSX with dark mode support via `dark:` variants.
