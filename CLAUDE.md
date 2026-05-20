# Bonsai Florida Development Rules

## Product Goal

Build Bonsai Florida as a **content + local community engine**, not a complicated ecommerce platform first.

The goal is to create a fast, elegant, SEO-friendly bonsai website focused on education, events, local trust, beautiful images, and easy customer connection.

## Core Philosophy

- Fast pages
- Minimal dependencies
- Static-first
- Mobile-first
- SEO-first
- Simple database
- Optimized images
- Easy contact and trust-building

## Biggest Risks To Avoid

- Overbuilding
- Slow performance
- Messy architecture
- Too many AI-generated files
- No clear content system
- Complicated ecommerce too early
- Large admin panel before basic content works

## Recommended Stack

| Layer | Tool |
|---|---|
| Frontend | Next.js 15 |
| Language | TypeScript |
| Styling | Tailwind CSS |
| Database | Supabase |
| CMS | MDX first, Notion later if needed |
| Hosting | Vercel |
| Images | Cloudinary or optimized next/image pipeline |
| Analytics | Plausible or PostHog |
| Email | Resend |
| Forms | Server Actions |
| Store Later | Shopify Headless or Stripe links |

## Do Not Start With

Avoid these early:

- Complex ecommerce
- Huge admin panel
- Heavy animations
- WordPress plugins
- Multiple databases
- Custom CMS
- Forum/community system
- AI chatbot
- Native mobile app
- Full CRM

For Bonsai Florida, **content + local SEO + trust + beautiful images = the money engine**.

## Site Structure: Phase 1 MVP

```txt
/
├── Home
├── Trees for Sale
├── Beginner Bonsai Guide
├── Care Guides
├── Event Calendar
├── About Bonsai Florida
├── Contact
├── Instagram / Social Feed
└── Blog
```

## Phase 2 Later

- Wishlist
- Member account
- Workshop booking
- Tree history tracking
- Collector dashboard
- AI care helper
- Marketplace
- Checkout/payment system

## Clean Project Structure

Use this structure:

```txt
/app
/components
/lib
/types
/styles
/content
/public
/scripts
```

Component organization:

```txt
/components
  /ui
  /layout
  /bonsai
  /cards
  /blog
```

Do not dump many unrelated files into one folder. Keep modules isolated and easy to review.

## Development Rules

- Always sync from GitHub before starting work: fetch the remote, check the active branch, and pull/rebase the latest target branch before editing files.
- After finishing, always tell the user exactly what was done, what changed, what was tested, and what remains.
- Plan before coding.
- Build one feature per PR.
- Keep PRs small and reviewable.
- Prefer static pages whenever possible.
- Use Server Components by default.
- Only use Client Components when interaction requires them.
- Avoid unnecessary packages.
- Do not create duplicate components.
- Keep code readable and modular.
- Never delete files without clear reason.
- Do not create files outside the project directory.
- Run lint, typecheck, and build before marking complete.
- Review before merge.

## SEO Rules

- Every page needs metadata.
- Every tree/species page needs structured data.
- Use semantic HTML.
- Use clean URLs.
- Optimize for local South Florida bonsai keywords.
- Each care guide should target a clear search intent.
- Every tree page should be simple, readable, and helpful.

Target SEO topics:

- Florida bonsai care
- Tropical bonsai Florida
- South Florida bonsai
- Palm Beach bonsai
- Beginner bonsai care
- Ficus bonsai Florida care
- Juniper bonsai Florida
- Buttonwood bonsai Florida
- Bonsai watering in Florida heat

## Performance Rules

- Lighthouse target: 90+.
- Optimize all images.
- Use `next/image` where appropriate.
- Prefer WebP/AVIF.
- Lazy-load non-critical media.
- Avoid raw iPhone images on public pages.
- Avoid heavy animation libraries.
- Avoid client-side rendering unless necessary.
- Keep pages fast on mobile.

## Security Rules

- Never expose API keys.
- Use environment variables.
- No service role key in frontend code.
- Validate form submissions server-side.
- Protect admin and inventory writes.
- Use Supabase Row Level Security for database access.
- Never store raw PINs or passwords.
- Use secure server-side session validation for staff tools.

## Content Strategy

Bonsai Florida wins through:

- Educational authority
- Local SEO
- Beautiful images
- Repeat traffic
- Event/workshop visibility
- Care sheets
- Tree transformations
- Beginner-friendly guidance

The real content moat:

- Florida bonsai care
- Tropical bonsai care
- Beginner bonsai education
- South Florida climate notes
- Event coverage
- Tree progression stories
- Before/after styling photos

## Content Database Direction

Use simple structured tables when needed:

| Table | Purpose |
|---|---|
| trees | Tree inventory and public tree pages |
| species | Bonsai species profiles |
| care_guides | Watering and care instructions |
| events | Shows, workshops, and markets |
| blog_posts | SEO articles |
| galleries | Before/after and tree progression |

## MDX Content Rule

Use MDX for articles and guides first:

```txt
/content/blog
/content/guides
/content/species
```

Benefits:

- Git-friendly
- AI-friendly
- Fast
- SEO clean
- No CMS complexity early

Do not build a custom CMS until content volume proves it is needed.

## Image System Best Practice

Bonsai is visual. Optimize media carefully.

Use:

- Cloudinary or a structured image optimization pipeline
- `next/image`
- WebP/AVIF
- Responsive sizes
- Compressed public images

Avoid:

- Raw 20MB iPhone images on public pages
- Autoplay videos everywhere
- Huge galleries without pagination or lazy loading

## Design Direction

Use:

- Japanese minimalism
- Soft natural colors
- Deep forest green
- Warm ivory / cream
- Soft pink floral accents
- Large whitespace
- Magazine/editorial feel
- Nature textures
- Calm typography
- Large readable text for older customers
- Big tap-friendly buttons

Avoid:

- Flashy startup SaaS look
- Neon gradients
- Heavy animations
- Tiny text
- Complicated navigation

## Customer Connection Rule

The website must make it effortless for people, especially older customers, to connect.

Every important public page should make contact easy through:

- Call button
- Text button
- Facebook button
- Instagram / TikTok / YouTube links where relevant
- Email option

The customer should never need more than one tap to call, text, or open the preferred social channel.

## Tree Page Rule

Each public tree page should be simple and easy to read:

- Large photo
- Tree name
- Price
- Availability status
- Beginner level
- Water guide
- Sun guide
- Best location
- Florida care warning
- Beginner tip
- Call/Text/Facebook buttons

Do not make the customer feel like they are using inventory software. It should feel like a calm bonsai gallery page.

## QR Inventory Rule

Use one QR code per tree.

QR opens:

```txt
/tree/[tree_code]
```

Public customers see:

- Tree photo
- Price
- Care guide
- Contact buttons

Logged-in staff/admin see:

- Edit price
- Change status
- Upload photo
- Update care guide

The same QR should serve both customer and staff views based on authentication state.

## Staff Login Rule

For staff/dad phone workflow:

- Use PIN login for quick access.
- Remember the device using secure httpOnly cookies.
- Do not store raw PINs.
- Do not use localStorage for session tokens.
- Staff should not need to log in again on the same phone unless the session expires, browser data is cleared, logout is used, or the device is revoked.
- Quick updates should take under 10 seconds.

## ECC Agent Workflow

Use this agent sequence when available:

```txt
planner → builder → reviewer → performance-reviewer → seo-reviewer → security-reviewer → quality-gate
```

Do not use 30 random agents. Use only what the task needs.

## Development Flow

1. Plan the feature.
2. Build the isolated feature.
3. Review code quality.
4. Review performance.
5. Review SEO.
6. Review security.
7. Run tests.
8. Merge only when checks pass.

## What Makes Money

| Feature | Why It Matters |
|---|---|
| SEO articles | Compounding traffic |
| Event/workshop pages | Local authority |
| Tree showcase pages | Trust + conversion |
| Email newsletter | Repeat buyers |
| Instagram/social integration | Social proof |
| Care guides | Organic search + customer confidence |

## What Saves Time

| Tool/Pattern | Why It Helps |
|---|---|
| MDX content | No CMS headaches |
| Static pages | Faster and cheaper |
| Shared templates | Consistency |
| Tailwind CSS | Faster UI |
| Cloudinary / image pipeline | Automatic optimization |
| Simple database | Easier scaling |
| Small PRs | Easier review and fewer bugs |

## Best Initial MVP

The best first version is:

- Homepage
- Trees for Sale
- 10 care guides
- 5 tree pages
- Events page
- Blog
- Contact
- Newsletter
- Instagram/social section

Launch fast. Build authority. Add commerce later.

## Merge Criteria

Before any PR is merged:

- `npm install` works
- `npm run lint` passes
- `npm run typecheck` passes if available
- `npm run build` passes
- No secrets are committed
- Mobile layout is checked
- SEO metadata exists for new pages
- Images are optimized or constrained
- Public pages remain simple and fast
- Admin/staff writes are protected
