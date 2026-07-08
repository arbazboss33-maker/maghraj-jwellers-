# Maghraj Jewellers — Luxury Showroom Platform

A full-stack, no-code-manageable jewellery e-commerce platform for **Maghraj
Jewellers** (Bahadurganj, Bihar), built with Next.js 15, TypeScript, Tailwind
CSS, Framer Motion, and Supabase.

## Brand Design System

- **Palette**: antique hallmark gold (`#A9812E`), ink black (`#12100D`),
  warm ivory (`#FBF8F1`), Bihar bridal maroon (`#611F26`) — deliberately
  avoiding the bright-yellow-gold-gradient look of Tanishq/Malabar/Kalyan.
- **Typography**: Fraunces (display serif) + Manrope (body) + JetBrains Mono
  (small-caps labels for a jewellery-invoice feel).
- **Signature motif**: the **Assay Seal** (`components/shared/assay-seal.tsx`)
  — a hand-stamped circular hallmark graphic used in the hero, as a section
  divider, and as the loading/brand mark, literalizing "Trusted Hallmark Gold."

## Getting Started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase + Razorpay keys
npm run dev
```

1. Create a Supabase project, then run `supabase/schema.sql` in the SQL editor.
2. Create two Storage buckets: `product-media` and `site-assets` (public read).
3. Create your admin user in Supabase Auth, then set
   `raw_app_meta_data: { "role": "admin" }` on that user so `/admin` unlocks.
4. Deploy to Vercel; add the same env vars there.

## What's Included

- **Storefront**: Home (hero, featured/latest/trending/bestsellers/bridal
  rails, testimonials, Instagram grid, FAQ, newsletter), Shop (filters,
  sort, search), Product Detail (zoom gallery, video, transparent price
  breakdown, hallmark specs, WhatsApp inquiry, share, wishlist, related
  products), Cart, Checkout, Order Tracking, About, Gallery, Blog, Contact
  (map + call/WhatsApp/email + hours), floating WhatsApp button, light/dark
  mode, SEO metadata + sitemap.xml + robots.ts.
- **Admin CMS** (`/admin`, auth-protected): dashboard analytics, full
  Products CRUD (hallmark/weight/pricing/media upload), Categories, Banners
  & homepage, Coupons/Offers, Orders (status + tracking), Customers, Reviews
  moderation, Blog CMS, and a Settings page for logo, theme colors, contact
  info, business hours, and SEO — all writing directly to Supabase.
- **Pricing engine** (`lib/pricing.ts`): computes a transparent, itemized
  price (metal value + wastage + making charges + stone charges + GST) from
  live gold rate and weight — shown to customers as a trust signal.

## What to Finish Before Launch

This is a large, genuinely production-shaped scaffold, not a finished,
tested build — a few things need your attention before going live:

- **Run `npm install` and `npm run build` locally** to catch any version
  mismatches (this environment has no network access to verify the build).
- **Payments**: the Razorpay order-creation flow is wired server-side; you
  still need to add the Razorpay Checkout **client-side modal** (their JS
  SDK) in `app/checkout/page.tsx` to actually collect payment, plus a
  webhook route to confirm payment and update `orders.payment_status`.
  UPI/PhonePe/GPay in India typically run *through* Razorpay's UPI intent.
- **Image uploads**: product/banner/logo uploads assume Supabase Storage
  buckets `product-media` and `site-assets` exist with public read policies.
- **Seed data**: add your real products, categories, and banners through
  `/admin` — the storefront falls back to placeholder demo content
  (`lib/demo-data.ts`) until real data exists, so it always looks complete.
- **Auth for customers**: wishlist/orders currently assume a logged-in
  Supabase Auth customer; add a customer login/signup flow if you want
  accounts (guest checkout already works).
- **Real photography**: replace the placeholder image blocks with your
  showroom's product photography — this is what will make the site look
  premium in practice.
