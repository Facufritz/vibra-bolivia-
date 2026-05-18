# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build
npm run lint         # ESLint via next lint
npm test             # Run all tests with Jest
npm run test:coverage  # Tests with coverage report
```

Run a single test file:
```bash
npx jest __tests__/api/subscribe.test.ts
```

## Environment Variables

Requires `.env.local` with:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Architecture

Single-page landing for Vibra Bolivia 2027, built with Next.js 16 (App Router), React 19, Tailwind CSS, Framer Motion, and Supabase.

**Page composition** — `src/app/page.tsx` composes 6 section components in order: `Hero → Stats → Aftermovie → Timeline → SpotifyPlayer → EmailRegister`. Each section is a standalone component in `src/components/`. `SocialMedia` and `Teaser2027` exist as components but are currently not mounted.

**Section wrapper pattern** — `SectionWrapper` is the reusable container used by most sections. It handles parallax clouds, grass/mountain bottom decorations, scroll-triggered fade-in animations, and reduced motion support.

**API route** — `src/app/api/subscribe/route.ts` is the only backend endpoint. It validates email, inserts into Supabase's `subscribers` table, and returns 409 on duplicate (Postgres error code `23505`). The Supabase client is a shared singleton at `src/lib/supabase.ts`.

**Data** — `src/lib/timeline-data.ts` contains the 2026 lineup as a static typed array (`TIMELINE_2026`). Each entry maps an artist to a `photoFolder` name used to load images from `public/assets/`.

**Hooks** — `src/hooks/useCountUp.ts` animates a number from 0 to a target using `requestAnimationFrame` with a cubic ease-out. Accepts a `trigger` boolean to start the animation (used with Intersection Observer in `Stats`).

## Styling Conventions

- **Brand colors** are defined in `tailwind.config.ts` as `vibra-orange`, `vibra-pink`, `vibra-purple`, `vibra-blue`.
- **Fonts**: `font-display` (Bebas Neue, CSS var `--font-display`) for headings; `font-sans` (Inter, CSS var `--font-body`) for body text.
- **Background texture**: utility class `vibra-texture` applies `public/assets/branding/fondo.jpg`.
- The base background is `#5B2D8E` (vibra-purple); all pages default to white text.

## Brainstorming UI

`C:\tmp\brainstorm\content\` holds standalone HTML snippets used for visual previews during design discussions (e.g., section order confirmations, background style choices). These are throwaway artifacts, not part of the build.

## Testing

Tests live in `__tests__/` mirroring `src/` structure. The Jest config maps `@/` to `src/` and uses `jsdom`. The subscribe API route is tested by mocking `@/lib/supabase`.
