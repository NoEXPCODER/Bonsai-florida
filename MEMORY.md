# BONSAI FLORIDA — Codex Handover & Session Memory

## HANDOFF SUMMARY (session ended 2026-05-20)

### What was completed this session

- **Save-to-Visit-List system** — `src/lib/visit-list.ts`, `src/hooks/useVisitList.ts`
  - localStorage key `bf_visit_list`, event `bf_visit_list_changed`
  - Max 5 trees, `VisitItem { id, name, price, imageUrl?, treeCode? }`
- **VisitListDrawer** — `src/components/VisitListDrawer.tsx`
  - Bottom sheet showing saved trees, remove buttons, progressive contact form (shown at 4–5 saved)
  - "Book Garden Visit" and "Text Us My List" CTAs
  - Contact form validation with error message on empty name/phone
- **StickyMobileCTA** — `src/components/StickyMobileCTA.tsx`
  - Fixed bottom bar: "Book Garden Visit" + heart badge with count
  - Clicking heart opens VisitListDrawer
- **GlobalStickyBar** — `src/components/GlobalStickyBar.tsx`
  - Added to root layout (inside Providers) — shows on all public pages
  - Hidden on `/admin` and `/book` paths
- **FeaturedTrees homepage** — `src/components/FeaturedTrees.tsx`
  - Homepage cards: View Tree + Ask SMS link only. NO save-to-list (that's /trees only)
- **TreesClient /trees page** — `src/app/trees/TreesClient.tsx`
  - Heart save button on ALL three card views (grid/list/care)
  - Grid: heart overlay top-right of photo
  - List: heart icon beside price
  - Care: heart button in bottom action row
  - Bottom spacer `h-20 md:hidden` so sticky bar doesn't overlap last items
- **Booking flow** — `src/app/book/BookingFlow.tsx` + `src/app/api/book/route.ts`
  - Step 1: Choose reason (6 options)
  - Step 2: Contact form (name, email, phone, notes, optional tree name)
  - Step 2 shows saved visit list (read from localStorage) below notes
  - Step 3: Confirm page — "Pick Your Visit Time" button (user-tapped → Calendar opens → back returns here)
  - Saved trees sent to API and stored in `bookings.saved_trees` (jsonb)
  - Rate limit: 5/hour per email
  - Honeypot: `_hp` field must be empty
- **Booking API fixes**
  - `saved_trees` now saved to DB (was being sent but not inserted)
  - Type guards strengthened for all string fields
  - Rate limit raised from 3→5/hour
- **DistanceBadge** — `src/components/DistanceBadge.tsx`
  - Haversine geolocation, silent on deny, "X miles from you" in Hero
- **WhyBonsaiFlorida** — `src/components/WhyBonsaiFlorida.tsx`
- **FinalCTA** — `src/components/FinalCTA.tsx`
- **Homepage section order**: Hero → FeaturedTrees → HowItWorks → WhyBonsaiFlorida → CareGuidePreview → FinalCTA → ConnectSimple
- **Removed all phone call links** — SMS text only throughout the site
- **GlobalStickyBar fix** — placed inside `<Providers>` in layout.tsx so `useAuth()` in VisitListDrawer works

### Current task / next up

User asked about: **"when they mark and buy, I can select who was person buying it for contact reason later. Their information will come out of database when people come and book a visit to come and input their information"**

This means:
- When admin marks a tree as sold in AdminClient.tsx, there should be a step to link the buyer to an existing booking
- Admin should be able to search/select a booking by name or phone
- The selected booking's contact info (name, phone, email) gets saved with the sold tree record
- Currently `bonsai_trees` has no `buyer_booking_id` or `buyer_name` columns — need to add
- AdminClient.tsx has a "Mark as Sold" modal — this needs a buyer lookup step

**This was NOT yet implemented.** This is the next task for Codex.

### Files changed (not yet committed for the sold-buyer feature)

None — that feature was described but not started.

### Blocked on / next step

1. Add `buyer_booking_id uuid` and `buyer_name text`, `buyer_phone text`, `buyer_email text` columns to `bonsai_trees` table via Supabase migration
2. In AdminClient.tsx "Mark as Sold" modal: add a search box that queries `bookings` table by name/phone/email, lists matches, lets admin select one
3. When sold is confirmed, save buyer info (either by linking `buyer_booking_id` or copying fields) alongside `sold_at`, `sold_note`, `sold_image_url`
4. Admin can see buyer info when viewing sold trees list

---

## Project Overview

Tropical bonsai nursery website in Palm Beach, Florida. Owner is Vietnamese-American (Thanh Van). The site serves English and Vietnamese visitors and is used by the owner/staff to manage tree inventory, print QR tags, and connect with customers on social media.

---

## Tech Stack (NEVER suggest alternatives)

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript (strict)
- **Styling:** Tailwind CSS 3 (custom design tokens — see `tailwind.config.ts`)
- **Database + Storage:** Supabase — project ref `kezvvfocbpbyykgeohsw`
- **Package manager:** npm
- **Deployment:** Vercel (preview URL: `bonsai-florida-git-claude-bon-9b4d8a-nathanvan10-1791s-projects.vercel.app`)
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
- Staff admin credentials must come from server-only environment variables. Do not commit usernames, passwords, or PINs.

---

## Vercel Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://kezvvfocbpbyykgeohsw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon key in supabase.ts>
SUPABASE_SERVICE_ROLE_KEY=<from Supabase dashboard — server only>
ADMIN_PIN=<staff PIN — server only>
ADMIN_USERNAME=<staff username — server only>
ADMIN_PASSWORD=<staff password — server only>
```

---

## Key File Map

```
src/
├── app/
│   ├── layout.tsx                    Root layout — <Providers><children/><GlobalStickyBar/></Providers>
│   ├── page.tsx                      Homepage (server — fetches 4 trees + logo)
│   ├── book/
│   │   ├── page.tsx                  Booking page (server — fetches logo)
│   │   └── BookingFlow.tsx           3-step booking: reason → contact+trees → confirm+calendar
│   ├── admin/
│   │   ├── page.tsx                  Admin entry
│   │   ├── AdminClient.tsx           Staff dashboard: add/edit/mark-sold trees
│   │   ├── settings/SettingsClient.tsx  Logo upload
│   │   ├── devices/DevicesClient.tsx   Revoke sessions
│   │   └── qr-tags/QrTagsClient.tsx    QR tag print
│   ├── api/admin/
│   │   ├── auth/route.ts             POST login, session cookie
│   │   ├── auth/logout/route.ts      POST logout
│   │   ├── trees/route.ts            GET/POST trees
│   │   ├── trees/[id]/route.ts       PATCH/DELETE tree
│   │   ├── trees/list/route.ts       GET full tree list for admin
│   │   ├── upload/route.ts           POST image upload
│   │   ├── settings/route.ts         GET/PATCH site_settings
│   │   ├── settings/logo/route.ts    POST/DELETE logo
│   │   ├── species/route.ts          GET all species
│   │   └── devices/ + [id]           GET/DELETE staff sessions
│   ├── api/book/route.ts             POST booking — rate-limited (5/hr), honeypot, saves to bookings table
│   ├── tree/[tree_code]/
│   │   ├── page.tsx                  Tree detail (server)
│   │   └── TreePageClient.tsx        Tree detail client: carousel, care guide
│   ├── trees/
│   │   ├── page.tsx                  Collection (server)
│   │   └── TreesClient.tsx           Collection client: grid/list/care views + heart save buttons
│   ├── care-guides/                  Species care library
│   └── care/page.tsx                 redirect('/care-guides')
├── components/
│   ├── Navbar.tsx                    Sticky nav — EN/VI toggle, nav links, Text Us CTA
│   ├── Hero.tsx                      Homepage hero — DistanceBadge, Book Visit CTA, photo swiper
│   ├── FeaturedTrees.tsx             Homepage 4-tree grid — View Tree + Ask SMS only (NO save list)
│   ├── HowItWorks.tsx                4-step process
│   ├── WhyBonsaiFlorida.tsx          4 reason cards
│   ├── CareGuidePreview.tsx          3 species cards
│   ├── FinalCTA.tsx                  Bottom booking CTA
│   ├── ConnectSimple.tsx             Contact row
│   ├── Footer.tsx                    Footer
│   ├── VisitListDrawer.tsx           Bottom sheet: saved trees, contact form, Book/Text CTAs
│   ├── StickyMobileCTA.tsx           Fixed bottom bar: Book Garden Visit + heart badge
│   ├── GlobalStickyBar.tsx           Layout wrapper: renders StickyMobileCTA, hidden on /admin + /book
│   ├── DistanceBadge.tsx             Haversine geolocation badge in Hero
│   ├── BookAppointment.tsx           <a href="/book"> button component
│   ├── Icons.tsx                     SVG icons (PhoneIcon, MessageIcon, SunIcon, WaterIcon, etc.)
│   └── Providers.tsx                 <AuthProvider> wrapper
├── hooks/
│   └── useVisitList.ts               React hook: syncs visit list from localStorage via custom event
├── lib/
│   ├── i18n.tsx                      AuthProvider, useAuth(), useMessages()
│   ├── visit-list.ts                 getVisitList/addToVisitList/removeFromVisitList/clearVisitList
│   ├── customer-session.ts           saveCustomer/getCustomer for localStorage name+phone
│   ├── session.ts                    httpOnly cookie session helpers
│   ├── supabase.ts                   Public anon client + DbTree/DbSpecies types
│   ├── supabase-server.ts            Service role client (server only)
│   ├── admin-auth.ts                 Server-only staff PIN helper
│   ├── image-optimizer.ts            Client-side image resizing
│   ├── tree-images.ts                getPrimaryTreeImageUrl()
│   └── species.ts                    getSpeciesDifficulty(), getSpeciesLatin(), makeSpeciesSlug()
├── config/
│   ├── contact.ts                    Phone (sms/tel/display), email, social URLs, coordinates
│   └── auth.ts                       Staff credentials — server only
└── messages/
    ├── en.ts                         All English strings (source of truth for type)
    └── vi.ts                         All Vietnamese (must match en.ts shape exactly — TypeScript enforces)
```

---

## Supabase Tables

### `bonsai_trees`
`id, name, species, price (text), level, sun, water, notes, image_url, image_urls (jsonb), sold_image_url, sold_note, sold_at, tree_code, location_row, location_tree, species_id (fk→tree_species), is_active, status, created_at`

### `bookings`
`id (uuid), reason (text), name (text), email (text), phone (text), notes (text nullable), tree_name (text nullable), saved_trees (jsonb nullable), status (text default 'pending'), created_at, interests (text[]), budget (text), visit_goal (text), lead_score (int default 0), lead_type (text default 'cold')`

### `tree_species`
`id, name_en, name_vi, species_latin, latin_name, level, sun_en, sun_vi, water_en, water_vi, care_en, care_vi, light_en, light_vi, watering_en, watering_vi, fertilizer_en/vi, pruning_en/vi, repotting_en/vi, watch_for_en/vi, florida_tips_en/vi, weekly_checklist_en/vi, created_at`

### `staff_sessions`
`id, token_hash, device_name, created_at, last_used_at, expires_at, revoked_at`

### `site_settings`
`key, value, updated_at` — currently stores `logo_url`

**Storage bucket:** `bonsai-trees` (public)
- Tree photos: root path
- Sold photos: `sold/` prefix
- Brand logo: `settings/logo.{ext}`

---

## Visit List System

- **localStorage key:** `bf_visit_list`
- **Event name:** `bf_visit_list_changed` (dispatched on every change for cross-component sync)
- **Max:** 5 trees
- **VisitItem shape:** `{ id: string, name: string, price: number, imageUrl?: string, treeCode?: string }`
- **Save buttons:** only on `/trees` page (all 3 card views). NOT on homepage FeaturedTrees.
- **Drawer:** opened by tapping heart badge in StickyMobileCTA (mobile bottom bar)
- **Progressive contact form:** shown in drawer when 4–5 trees saved and no customer session
- **Customer session:** `bf_customer` in localStorage — `{ name: string, phone: string }`

---

## Booking Flow

1. `/book` — reason step (6 options: Buy/Browse/Care Help/Gift/Specific/Pickup)
2. Contact step — name, email, phone, optional notes, optional "which tree?" (shown when reason=specific)
3. Contact step shows saved visit list from localStorage below notes (read-only display)
4. Submit → `POST /api/book` → confirm page
5. Confirm page shows "Pick Your Visit Time" button → opens Google Calendar
6. Back button from Calendar returns to confirm page

**Google Calendar URL:** `https://calendar.google.com/calendar/appointments/schedules/AcZssZ2rQtgIgRIvKdusIMMARHlSxDTqPkyVpjcaRj8FYeULUNtJkIU8sMhWsD9ccA1iymKsd4wjE3Xw?gv=true`

**API guards:** honeypot `_hp` must be empty, rate limit 5/hr per email, field length checks, type guards.

---

## i18n System

- `useMessages()` — returns translated strings for active locale
- All client components with user-facing text must call `useMessages()`
- When adding new text: add to `en.ts` → mirror in `vi.ts` (TypeScript errors if shape differs)
- `GlobalStickyBar` and `VisitListDrawer` use `useAuth()` — must be inside `<Providers>`

---

## Design System

**Colors:** `forest`, `forest-light`, `sage`, `sage-pale`, `cream`, `cream-warm`, `cream-light`, `bonsai-pink`, `bonsai-pink-pale`, `ink`, `ink-light`

**Typography:** `font-serif` = Playfair Display, `font-sans` = Inter

**Utility classes:** `btn-primary`, `btn-secondary`, `card`, `section-heading`, `section-label`, `section-wrap`, `pink-divider`

**SMS only** — no phone call links anywhere on the site. All phone links use `sms:5613129576`.

---

## Errors Log

### window.open() blocked on mobile in async context
`window.open(url)` called after `await fetch()` is treated as an unsolicited popup on mobile. Fix: don't auto-open; show confirm page with a user-tapped `<a href={url} target="_blank">` button instead.

### GlobalStickyBar must be inside Providers
If `GlobalStickyBar` is placed outside `<Providers>` in layout.tsx, it renders `VisitListDrawer` which calls `useAuth()` — crashes with "useAuth must be used inside AuthProvider". Fix: place inside `<Providers>{children}<GlobalStickyBar/></Providers>`.

### Rate limit too low during testing
Original 3/hr rate limit blocked the owner after testing the booking form 3 times. Raised to 5/hr. If you need to clear test bookings: `DELETE FROM bookings WHERE email = 'nathanvan10@gmail.com';`

### config/auth.ts — do not delete
Imported by `/api/admin/auth/route.ts` for staff login. Reads staff credentials from server-only environment variables.

### ESLint: no-html-link-for-pages
Use `<Link href="/">` from `next/link` for internal navigation, not `<a href="/">`.

### New components not translating
All components with user-facing text must be `'use client'` and use `useMessages()`. Server components cannot use the locale context.

### price is a string in DbTree
`tree.price` is a `string` in the DB type. When used as a number (e.g. for VisitItem), cast with `parseFloat(tree.price)`.
