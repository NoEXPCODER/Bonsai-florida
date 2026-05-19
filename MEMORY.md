# BONSAI FLORIDA — Codex Handover & Session Memory

## Project Overview

Tropical bonsai nursery website in Palm Beach, Florida. Owner is Vietnamese-American (Thanh Van). The site serves English and Vietnamese visitors and is used by the owner/staff to manage tree inventory, print QR tags, and connect with customers on social media.

---

## Tech Stack (NEVER suggest alternatives)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3 (custom design tokens — see `tailwind.config.ts`)
- **Database + Storage:** Supabase — project ref `kezvvfocbpbyykgeohsw`
- **Package manager:** npm
- **Deployment:** Vercel
- **Branch:** `claude/bonsai-florida-website-XzS9G`

---

## Core Rules (apply every session, no exceptions)

1. **Ask, don't assume.** If anything is unclear, ask before writing a single line.
2. **Simplest solution first.** No abstractions, flexibility, or cleverness beyond what was asked.
3. **Don't touch unrelated code.** If a file is not part of the current task, do not modify it.
4. **Flag uncertainty.** If not confident about an approach, say so before proceeding.
5. **No comments** unless the WHY is non-obvious (workaround, hidden constraint, subtle invariant).
6. **No emojis** unless explicitly requested.
7. Before any significant change (rewriting sections, removing code): describe what you're changing and why. Wait for confirmation.
8. After every coding task: **Files changed** / **What was modified** / **Files not touched** / **Follow-up needed**.

---

## Security Rules (MANDATORY — never violate these)

- `SUPABASE_SERVICE_ROLE_KEY` and `ADMIN_PIN` are server-only secrets. **NEVER** prefix with `NEXT_PUBLIC_`, never import into client components, never log values.
- All session tokens stored as SHA-256 hashes in DB, never raw.
- httpOnly cookie `bf_staff` for staff auth. **Never** localStorage.
- All mutation API routes verify the cookie server-side before acting.
- Staff admin credentials: `thanhvan` / `bonsai2026` (in `src/config/auth.ts` — server side only via API route).

---

## Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://kezvvfocbpbyykgeohsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  (in supabase.ts)
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard — server only>
ADMIN_PIN=<staff PIN — server only>
```

---

## Key File Map

```
src/
├── app/
│   ├── layout.tsx                    Root layout — wraps everything in <Providers>
│   ├── page.tsx                      Homepage (server component, fetches 4 trees)
│   ├── admin/
│   │   ├── page.tsx                  Admin entry (server auth check → AdminClient)
│   │   ├── AdminClient.tsx           Main staff dashboard (login + tree CRUD)
│   │   ├── settings/
│   │   │   ├── page.tsx              Settings page (server auth check)
│   │   │   └── SettingsClient.tsx    Logo upload UI
│   │   ├── devices/
│   │   │   ├── page.tsx              Remembered devices page
│   │   │   └── DevicesClient.tsx     Revoke sessions UI
│   │   └── qr-tags/
│   │       ├── page.tsx              QR tag print page
│   │       └── QrTagsClient.tsx      QR tag layout
│   ├── api/admin/
│   │   ├── auth/route.ts             POST login, validates credentials, creates session cookie
│   │   ├── auth/logout/route.ts      POST logout, clears cookie
│   │   ├── trees/route.ts            GET/POST trees
│   │   ├── trees/[id]/route.ts       PATCH/DELETE tree
│   │   ├── trees/list/route.ts       GET full tree list for admin
│   │   ├── upload/route.ts           POST image upload to Supabase storage
│   │   ├── settings/route.ts         GET/PATCH site_settings table
│   │   ├── settings/logo/route.ts    POST/DELETE brand logo upload
│   │   ├── species/route.ts          GET all species for combobox
│   │   └── devices/route.ts + [id]   GET/DELETE staff sessions
│   ├── tree/[tree_code]/
│   │   ├── page.tsx                  Tree detail server component
│   │   └── TreePageClient.tsx        Tree detail client: photo carousel, care guide
│   └── trees/
│       ├── page.tsx                  Collection page (server)
│       └── TreesClient.tsx           Collection client: list/grid/card views
├── components/
│   ├── Navbar.tsx                    Sticky nav — EN/VI toggle, nav links, Call Now CTA
│   ├── Hero.tsx                      Homepage hero (client — uses i18n)
│   ├── FeaturedTrees.tsx             Homepage tree grid (client — uses i18n)
│   ├── HowItWorks.tsx                3-step process (client — uses i18n)
│   ├── CareGuidePreview.tsx          4 care guide cards (client — uses i18n)
│   ├── VisitSection.tsx              Visit section (client — uses i18n)
│   ├── ConnectSimple.tsx             Contact icons grid (client — uses i18n)
│   ├── Footer.tsx                    Footer (client — uses i18n)
│   ├── ConnectSection.tsx            Full connect section (not on homepage)
│   ├── BonsaiCollection.tsx          Collection UI component
│   ├── CareGuide.tsx                 Full care guide detail component
│   ├── Icons.tsx                     All SVG icons (PhoneIcon, MessageIcon, etc.)
│   ├── Providers.tsx                 Wraps app in <AuthProvider> for i18n
│   └── SoldTreePopup.tsx             (unused — removed from homepage)
├── config/
│   ├── contact.ts                    Phone, email, all social URLs — edit here to update site-wide
│   └── auth.ts                       Staff credentials (username/password) — server-only
├── data/
│   ├── care-guides.ts                Static care guide data for CareGuidePreview
│   └── trees.ts                      Static fallback tree data
├── lib/
│   ├── i18n.tsx                      AuthProvider, useAuth(), useMessages() — locale context
│   ├── session.ts                    httpOnly cookie session helpers (SHA-256 hashing)
│   ├── supabase.ts                   Public anon client + DbTree/DbSpecies interfaces
│   ├── supabase-server.ts            Service role client (server only)
│   ├── admin-auth.ts                 Server-only staff PIN helper
│   ├── image-optimizer.ts            Client-side image resizing before upload
│   └── tree-images.ts                getPrimaryTreeImageUrl() helper
└── messages/
    ├── en.ts                         All English strings
    └── vi.ts                         All Vietnamese strings (matches en.ts type exactly)
```

---

## Public Routes

| Route | Description |
|---|---|
| `/` | Homepage — Hero, FeaturedTrees, HowItWorks, CareGuidePreview, VisitSection, ConnectSimple |
| `/trees` | Full tree collection with list/grid/card views |
| `/tree/[tree_code]` | Individual tree page — photo carousel, care guide, staff edit if logged in |
| `/admin` | Staff inventory dashboard (login required) |
| `/admin/settings` | Logo upload and site settings (login required) |
| `/admin/devices` | View and revoke remembered devices (login required) |
| `/admin/qr-tags` | Print QR tags for selected trees (login required) |

---

## Supabase Tables

- **`bonsai_trees`** — `id, name, species, price, level, sun, water, notes, image_url, image_urls, sold_image_url, sold_note, sold_at, tree_code, location_row, location_tree, species_id, is_active, status, created_at`
- **`tree_species`** — `id, name_en, name_vi, species_latin, level, sun_en, sun_vi, water_en, water_vi, care_en, care_vi, quick_facts_en/vi, light_en/vi, watering_en/vi, fertilizer_en/vi, pruning_en/vi, repotting_en/vi, watch_for_en/vi, florida_tips_en/vi, weekly_checklist_en/vi, created_at`
- **`staff_sessions`** — `id, token_hash, device_name, created_at, last_used_at, expires_at, revoked_at`
- **`site_settings`** — `key, value, updated_at` — stores `logo_url` and other settings

**Storage bucket:** `bonsai-trees` (public)
- Tree photos: root path (e.g. `1234567890-0-tiger-ficus.jpg`)
- Sold photos: `sold/` prefix
- Brand logo: `settings/logo.{ext}`

---

## i18n System

- **`src/lib/i18n.tsx`** — `AuthProvider` wraps the whole app via `Providers.tsx`. Holds locale state (`en` | `vi`). `toggleLocale()` switches between them.
- **`useAuth()`** — returns `{ locale, toggleLocale }`. Must be inside AuthProvider.
- **`useMessages()`** — returns the full message object for the active locale (`en.ts` or `vi.ts`).
- All components that show user-facing text must be `'use client'` and use `useMessages()`.
- `vi.ts` exports `vi: Messages` — TypeScript enforces it matches the `en.ts` shape exactly.
- When adding text to any component, always add to **both** `en.ts` and `vi.ts`.

---

## Design System (Tailwind tokens)

**Colors:**
- `forest` / `forest-light` / `forest-dark` — deep green, brand primary
- `sage` / `sage-pale` — muted green, subtle accents
- `cream` / `cream-warm` / `cream-light` — warm ivory page backgrounds
- `bonsai-pink` / `bonsai-pink-lt` / `bonsai-pink-pale` — soft floral pink accent
- `ink` / `ink-light` — dark text colors

**Typography:** `font-serif` = Playfair Display, `font-sans` = Inter

**Reusable CSS classes (in globals.css):**
- `btn-primary` — forest green pill button
- `btn-secondary` — outline pill button
- `card` — cream-light card with border and shadow
- `section-heading` — Playfair Display serif heading
- `section-label` — small uppercase pink tracking label
- `section-wrap` — max-w-6xl centered container
- `pink-divider` — thin pink horizontal rule

---

## Component Patterns

**Server components** that need Supabase data (e.g. page.tsx files) pass data as props to client components.

**Client components** that need translated text use `'use client'` at the top and call `useMessages()`.

**Admin pages pattern:**
```tsx
// page.tsx (server)
const store = await cookies()
const rawToken = store.get('bf_staff')?.value
const session = await validateSession(rawToken)
if (!session) redirect('/admin')
return <ClientComponent initialData={data} />
```

**All new text** goes into `en.ts` first, then mirror it in `vi.ts` (TypeScript will error if they don't match).

---

## Completed Features

- Public homepage: Hero, FeaturedTrees, HowItWorks, CareGuidePreview, VisitSection, ConnectSimple
- Full tree collection page (`/trees`) with list/grid/card views and search
- Individual tree pages (`/tree/[code]`) with photo carousel and care guide
- Staff admin dashboard: add tree, edit tree, mark as sold, bulk select, CSV export, QR tag printing
- Staff session auth (httpOnly cookie, remember device 30 days, device management)
- EN/VI language toggle in navbar — all components translate on the fly
- `/admin/settings` page with logo upload to Supabase storage
- Persistent Navbar on all public pages
- Back link on tree detail: `← Inventory` for staff, `← Collection` for public
- `$` prefix on all prices
- Staff admin nav links open Collection/Public Site in new tab

---

## Known Issues / Follow-up Needed

- Logo: owner has not yet uploaded a custom logo. Currently shows the built-in `logo.svg`. Upload via `/admin/settings`.
- The `SoldTreePopup` component (`src/components/SoldTreePopup.tsx`) is no longer used — can be deleted.
- `src/data/trees.ts` contains static fallback tree data — may be stale relative to DB.

---

## Errors Log (what NOT to do)

### config/auth.ts — do not delete
Deleted accidentally thinking it was only for i18n. Actually imported by `/api/admin/auth/route.ts` for staff login. Restored.

### ESLint: `_autoName` unused arg warning
`next/typescript` doesn't configure `argsIgnorePattern` by default. Fixed in `.eslintrc.json`:
```json
{ "rules": { "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }] } }
```

### `<a href="/">` ESLint error in Navbar
`no-html-link-for-pages` rule. Must use `<Link href="/">` from `next/link` for internal navigation.

### New homepage components not translating
The new homepage components (Hero, HowItWorks, etc.) were server components — they can't use `useMessages()`. Fix: add `'use client'` and call `useMessages()`. All components with user-facing text MUST be client components.

### `i` defined but never used in .map()
Removed unused index param: `guides.map((guide, i) =>` → `guides.map((guide) =>`.
