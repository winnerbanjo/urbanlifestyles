# Urbanlifestyles — Premium Headless Fashion Storefront Powered by Nile

A bespoke, production-ready, mobile-first luxury fashion ecommerce storefront built with Next.js App Router, TypeScript, Tailwind CSS, and headless commerce powered by the [Nile Storefront API v1](https://app.nile.ng/docs).

The storefront takes direct visual inspiration from the reference layout: exceptionally clean 2-column mobile product listing, sage-green accents (`#BDD2BF`), editorial typography (*Cormorant Garamond* & *DM Sans*), understated pricing, floating circular bag buttons, and a fixed mobile navigation bar with safe-area insets.

---

## Key Features & Architecture

### 1. Visual Hierarchy & Design System (Matching Reference)
- **Top Announcement Bar:** Sage green (`#BDD2BF`) with rotating editorial notices (`FASHION IS FREEDOM`, `WORLDWIDE SHIPPING 🌐`, and live `settings.storeNotice` from Nile).
- **Shop All Page (`/shop`):** 
  - Editorial header with sage accent underline.
  - Interactive sorting dropdown: *Newest*, *Price: Low to High*, *Price: High to Low*, *Best Selling* (mapped to documented Nile parameters `sortBy` and `sortOrder`).
  - Scrollable horizontal category pills (`ALL`, `DRESSES`, `SETS`, `TOPS`, `BOTTOMS`, `NEW IN`) populated from Nile categories.
  - Strict 2-column mobile product grid with 4:5 aspect ratio portrait photography and `#EDEDEB` studio backdrop.
  - Floating circular sage-green Add-to-Bag buttons on image cards with instant variant selection drawers.
  - Live color swatch circles that dynamically preview corresponding variant colorways.
- **Fixed Mobile Navigation:** 5 icons (*Home*, *Shop*, *Collections*, *Wishlist*, *Account*) with active indicator in sage green and safe-area inset padding (`env(safe-area-inset-bottom)`).
- **Floating WhatsApp Concierge:** Automatically surfaced when `socials.whatsappLink` is configured in Nile, floating seamlessly above bottom navigation.

### 2. Full Nile Storefront API Integration
Strictly complies with the official Nile Storefront API v1 specification (`https://api.nile.ng/storefront/v1`):

| Area | Nile Endpoints | Implementation Details |
|------|---------------|------------------------|
| **Store Branding** | `GET /store` | Fetches store name, logo, currency (`NGN`), notices, shipping threshold, connected payment gateways, WhatsApp & socials. |
| **Catalog & Products** | `GET /products`<br>`GET /products/:uuid` | Paginated catalog, search queries, filtering, variant matrix (`attributesValues`, `productVariants` with sizes & colors). |
| **Categories & Collections** | `GET /categories`<br>`GET /categories/:id/products` | Categories act as collections with product counts, hero imagery, and dedicated category pages (`/category/[id]`). |
| **Cart Operations** | `GET /cart`<br>`POST /cart/items`<br>`PATCH /cart/items`<br>`DELETE /cart/items/:productId`<br>`DELETE /cart` | Anonymous cart ID persisted in `localStorage` under `x-anonymous-cart-id` and sent on every request. Server-authoritative totals and prices. Slide-out cart drawer with free shipping progress bar. |
| **Checkout & Payments** | `POST /checkout`<br>`POST /checkout/:orderId/payment` | 2-column desktop / single-column mobile flow with exact payload schema. Initializes connected payment gateway (Paystack) and redirects to `authorizationUrl`. |
| **Customer Auth** | `POST /customers/auth/sendOtp`<br>`POST /customers/auth/verifyOtp`<br>`GET /customers/auth/profile`<br>`GET /customers/auth/orders` | Passwordless one-time passcode verification. Secure JWT session handling, profile display, and historical orders list with payment badges. |
| **Reviews** | `GET /products/:uuid/reviews`<br>`POST /reviews` | Real client reviews with ratings, star breakdown, and verified purchase flags. |
| **Wishlist** | Local device storage | Saved locally per device with live catalog reconciliation and explicit cross-device limitation notice. |

---

## Environment Configuration

Create a `.env.local` file in the project root:

```env
# Nile Storefront API Base URL
NEXT_PUBLIC_NILE_API_URL=https://api.nile.ng/storefront/v1

# Nile Merchant Publishable API Key (Safe for browser bundles)
NEXT_PUBLIC_NILE_PUBLISHABLE_KEY=pk_live_your_actual_publishable_key_here
```

> **Note on Nile Allowed Origins:**
> In your Nile Merchant Dashboard under **Apps → API keys → Allowed origins**, register your frontend domain:
> - Development: `http://localhost:3050` (or `http://localhost:3000`)
> - Production: `https://your-custom-domain.com`

*When no live publishable key is set, the application automatically enables high-fidelity fallback mode with luxury ready-to-wear items matching the Urbanlifestyles aesthetic for local testing.*

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

Visit [http://localhost:3050](http://localhost:3050) (or the active port displayed in the console).

### 3. Production Build
```bash
npm run build
npm run start
```

---

## Directory Structure

```text
src/
├── app/
│   ├── layout.tsx              # Root HTML, Google Fonts (Cormorant & DM Sans), Providers
│   ├── globals.css             # Tailwind v4 theme, design tokens, safe area insets
│   ├── page.tsx                # Luxury Editorial Homepage
│   ├── shop/page.tsx           # Shop All page matching the reference screenshot
│   ├── product/[uuid]/page.tsx # Product Detail Page (gallery, variants, reviews, sticky bar)
│   ├── collections/page.tsx    # Collections overview from Nile categories
│   ├── category/[id]/page.tsx  # Category-filtered product listing
│   ├── cart/page.tsx           # Dedicated full shopping bag page
│   ├── checkout/page.tsx       # 2-step checkout flow connected to Nile
│   ├── checkout/payment/page.tsx # Payment verification and status handler
│   ├── account/page.tsx        # Customer dashboard and orders history
│   ├── account/login/page.tsx  # Passwordless OTP login flow
│   ├── wishlist/page.tsx       # Wishlist with catalog reconciliation
│   ├── search/page.tsx         # Full catalog search page
│   └── about/page.tsx          # Brand story, atelier sizing, shipping policies
├── components/
│   ├── Providers.tsx           # Global context wrapper
│   ├── cart/
│   │   └── CartDrawer.tsx      # Slide-out shopping bag drawer with free-shipping tracker
│   ├── layout/
│   │   ├── AnnouncementBar.tsx # Rotating sage-green top bar
│   │   ├── Header.tsx          # Minimalist luxury header with search & drawer
│   │   ├── MobileNav.tsx       # 5-icon fixed bottom mobile bar with active states
│   │   ├── Footer.tsx          # Editorial brand footer
│   │   └── WhatsAppButton.tsx  # Floating WhatsApp action button
│   ├── product/
│   │   ├── ProductCard.tsx     # 2-col reference card, swatches, circular add-to-bag
│   │   └── QuickAddModal.tsx   # Variant selection drawer for quick add
│   └── search/
│       └── SearchModal.tsx     # Debounced modal search overlay
└── lib/
    ├── context/
    │   ├── AuthContext.tsx     # Passwordless OTP auth
    │   ├── CartContext.tsx     # Anonymous cart ID & Nile sync
    │   ├── StoreContext.tsx    # Store branding & currency formatter
    │   └── WishlistContext.tsx # Local device wishlist
    └── nile/
        ├── api.ts              # Strongly typed Nile API client
        ├── types.ts            # Official Nile Storefront v1 TypeScript types
        └── mock-data.ts        # Luxury reference mock catalog (Lily Set, Klohe Dress, etc.)
```

---

## Design System Tokens

- **Main Background:** `#FAF9F6`
- **Sage Green:** `#BDD2BF`
- **Sage Hover:** `#A9C3AE`
- **Sage Dark / Forest Text:** `#37533E`
- **Text:** `#171717`
- **Muted Text:** `#777777`
- **Borders:** `#E9E7E3`
- **Product Backdrop:** `#EDEDEB`
- **Headlines & Logo:** *Cormorant Garamond* (Editorial Serif)
- **UI & Catalog:** *DM Sans* / *Inter* (Clean Modern Sans)
