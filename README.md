# Pencil prototype starter

A **template repo** for turning Pencil comps into interactive prototypes that feel real. Stack: Next.js 16 + React 19 + Tailwind v4 + shadcn/ui (base-nova) + Lucide.

## Use this template

```bash
gh repo create my-prototype --template <your-account>/pencil-prototype-starter --clone
cd my-prototype
pnpm install
pnpm dev
```

## First-run workflow

Open the cloned repo in Claude Code (or any agent with the Pencil MCP) and tell it:

> Sync design tokens from `~/path/to/your-file.pen`.

The agent will read `mcp__pencil__get_variables`, swap the placeholder values in `src/app/globals.css`, and report back. After that you're on tokens that match your design.

The full first-run checklist is in `AGENTS.md` — Claude reads it automatically.

## What's in the box

- **Next.js 16 (App Router)** — read `node_modules/next/dist/docs/` for breaking-change details before writing routes.
- **Tailwind v4** with shadcn-shaped CSS variables in `:root` and `@theme inline` mapping.
- **shadcn/ui** initialized with the baseline kit: button, card, dialog, sidebar, tabs, input, badge, avatar, tooltip, dropdown-menu, separator, scroll-area, textarea, switch, popover, sheet, skeleton.
- **`TooltipProvider`** pre-wired in the root layout.
- **Surface switcher** in `src/app/page.tsx` — a top-bar segmented control that demos multiple frames at once.
- **`@base-ui/react`** under the hood (shadcn's base-nova style) — not Radix.
- **Geist** for `font-sans` (shadcn primitives) + **Inter** for `font-primary` (Pencil-styled custom components).
- **Optional `--lms-*` brand block** for Thought Industries projects — delete it if not applicable.

## Local dev

```bash
pnpm dev      # http://localhost:3000
pnpm lint
pnpm build    # NB: Next 16 has a known prerender issue on /_global-error; use dev for prototyping
```

## Structure

```
src/
  app/
    globals.css         # design tokens (replace values from .pen on first run)
    layout.tsx          # root layout, fonts, TooltipProvider
    page.tsx            # surface switcher (replace placeholder surfaces)
  components/
    ui/                 # shadcn primitives
    <prototype-name>/   # your frame compositions go here
  hooks/
  lib/
    utils.ts            # `cn` helper
```
