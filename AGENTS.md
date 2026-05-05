# Working in this prototype

This project is a starter for **Pencil → code** prototypes:
Next.js 16 (App Router) + React 19 + Tailwind v4 + shadcn/ui (base-nova / `@base-ui/react` primitives) + Lucide icons. The intent is to take comps from a `.pen` file and turn them into something interactive enough to feel real.

## On first run of a clone

The `:root` block in `src/app/globals.css` ships with **placeholder** values. They render fine, but they aren't your project's design tokens. Before building screens:

1. Identify the project's `.pen` file (ask the user for the path).
2. Call `mcp__pencil__get_variables` with that path.
3. Replace the values in `:root` (the variable **names** stay — they're the contract shadcn/ui depends on).
4. If the project doesn't use the Thought Industries LMS branding, remove the `--lms-*` block.
5. Add the Light theme's font (`--font-primary`) — the template wires Inter via `next/font/google`. Swap to the design's font if it differs.
6. Leave the `.dark` block empty until dark mode is in scope.

## Pencil tooling

The `pencil` MCP server is the source of truth for visuals. Lean on it.

- `mcp__pencil__get_editor_state` — see what frames the user has selected.
- `mcp__pencil__get_variables` — design tokens (use to populate `globals.css`).
- `mcp__pencil__get_guidelines` (`Code` and `Tailwind` guides) — read once before generating components.
- `mcp__pencil__batch_get` with `readDepth: 4`, `resolveInstances: true` — pull a frame's structure when building it.
- `mcp__pencil__get_screenshot` — pin the visual target before coding, and verify after.

Never `Read` or `Grep` `.pen` files — they're encrypted; only the MCP tools work.

## Component conventions

- shadcn primitives live in `src/components/ui/` — already initialized. Run `pnpm dlx shadcn@latest add <name>` to pull more as needed.
- Project-specific compositions live in `src/components/<prototype-name>/`. Keep the folder name aligned with the prototype (e.g. `conversational-search`).
- Tailwind v4: tokens go in `:root` (and `@theme inline` for the Tailwind utility mapping). **Never** wrap font stacks in `:root` — define them as `@layer base` utility classes (the template provides `font-primary` and `font-sans`).
- Match Pencil reusable component **names** when you build matching React components — it makes future Pencil-to-code drops easier.

## Surface switcher

`src/app/page.tsx` ships with a top-bar segmented control that swaps between surfaces. It's the demo entry point — every Pencil frame in scope should be reachable from there. Replace the two placeholder cards with your real frame compositions.

## Prototype scope discipline

The cheapest way to feel real is **one** flow with proper interactivity (focus states, hover, keyboard, motion, fake-but-believable agent latency) — not 20 static screens. Make at least one surface fully interactive before adding more.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->
