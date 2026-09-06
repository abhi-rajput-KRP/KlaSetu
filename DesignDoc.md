# Artisan Marketplace — Design Doc
*Reference source: "Shopcart" headphone storefront screenshot*

## 1. Purpose
This doc translates the layout patterns and visual language of the reference screenshot into a reusable design system for **Artisan Marketplace**, an e-commerce site for handmade/artisan goods. The reference is clean, card-based, and product-forward — well suited to showcasing crafted items with strong photography.

---

## 2. What the Reference Does Well
- **Clear brand anchor**: green primary color used consistently across logo, CTAs, and price accents — creates instant recognition.
- **Warm hero section**: soft peach background with a lifestyle photo humanizes the product and breaks up an otherwise white/green palette.
- **Pill-shaped CTAs**: rounded "Shop Now" and "Add to Cart" buttons feel friendly and approachable rather than corporate.
- **Scannable filter bar**: horizontal dropdown pills (Type, Price, Review, Material, Offer) let shoppers narrow results without a heavy sidebar.
- **Consistent product cards**: image, wishlist icon, name, price (with strikethrough original), star rating, and full-width Add to Cart button — repeated identically across all items for easy comparison.

---

## 3. Color Palette (adapted for Artisan Marketplace)

| Role | Reference Color | Artisan Marketplace Equivalent | Hex (suggested) |
|---|---|---|---|
| Primary / Brand | Forest green | Deep clay/terracotta or sage green (craft, earthy) | `#3C6E47` (sage) or `#B5652F` (terracotta) |
| Accent Background | Peach/cream hero | Warm linen / kraft-paper tone | `#F3E6D3` |
| Surface / Cards | White | Off-white / warm white | `#FFFDF9` |
| Text — Primary | Near-black | Charcoal brown | `#2B2420` |
| Text — Secondary | Gray | Warm gray | `#8A8078` |
| Star Rating | Gold | Keep gold | `#F5B301` |
| Sale/Discount Tag | Green | Terracotta or mustard | `#C77B3E` |

**Rationale**: Artisan/handmade brands read better with earthy, textured tones (clay, linen, wood) instead of the tech-retail green, while keeping the same *functional* color roles (one primary brand color + one warm accent background + neutral surfaces).

---

## 4. Typography
| Use | Reference Style | Recommendation |
|---|---|---|
| Logo/Wordmark | Bold sans-serif | Sans-serif for logo, or a soft serif for warmth (e.g. "Fraunces", "Lora") |
| Hero Headline | Bold, large, dark green | Bold serif or slab-serif for craft feel, dark charcoal-brown |
| Body / Nav | Regular sans-serif, small | Sans-serif (Inter, Nunito Sans) for readability |
| Price | Bold | Bold, primary color |
| Product Name | Medium weight | Medium weight, 1–2 lines with ellipsis truncation |

---

## 5. Layout Structure

### 5.1 Header
- Left: logo/wordmark
- Center: nav links (Categories, Shop by Craft, New Arrivals, Delivery/Shipping Info)
- Right: search bar, wishlist icon, account icon, cart icon (with item-count badge)
- Sticky on scroll for persistent access

### 5.2 Hero Banner
- Warm background block (linen/kraft tone), full-width
- Bold headline + short supporting line (e.g. promo, seasonal collection, "Handmade for the Holidays")
- Pill-shaped primary CTA button
- Right-aligned lifestyle photo of an artisan or finished product in use
- Rounded corners on the banner container (8–16px radius) matching card radius elsewhere

### 5.3 Filter Bar
- Horizontal row of pill/dropdown filters directly below hero, left-aligned
- Suggested filters for Artisan Marketplace: **Craft Type** (pottery, textiles, woodwork...), **Price**, **Rating**, **Material**, **Maker Location**, **Handmade/Custom**, **More Filters**
- Sticky or collapsible on mobile

### 5.4 Section Header
- Bold section title (e.g. "Picked For You", "New From Local Makers")
- Optional "See all" link, right-aligned

### 5.5 Product Grid / Card
Each card contains, top to bottom:
1. Product image (square or 4:5 ratio), rounded corners
2. Wishlist heart icon, top-right overlay on image
3. Maker/shop name (small, secondary text) — **new element** vs. reference, important for artisan trust
4. Product name (medium weight, 1–2 lines)
5. Price — bold, with strikethrough original price if discounted
6. Star rating + review count
7. Full-width pill-shaped "Add to Cart" button in primary color

Grid: 4 columns desktop, 2 columns tablet, 1–2 columns mobile. Consistent gutter spacing (16–24px).

---

## 6. Component Notes
- **Buttons**: fully rounded ("pill") corners throughout — hero CTA, Add to Cart, filter pills — for visual consistency and a soft, handcrafted feel.
- **Cards**: subtle drop shadow (`0 2px 8px rgba(0,0,0,0.06)`), 12–16px border radius, white/off-white surface.
- **Icons**: simple line icons (heart, cart, search, user) — consistent stroke weight.
- **Ratings**: gold filled stars + numeric review count in parentheses, small secondary text.
- **Discount badge**: consider a small ribbon/tag ("Handmade", "Limited Batch", "-20%") on the image top-left to complement the wishlist icon top-right.

---

## 7. Suggested Additions Beyond the Reference
Since Artisan Marketplace sells handmade goods (vs. mass-produced electronics), consider:
- **Maker attribution** on every card and product page (name/shop, location, "Meet the Maker" link)
- **Material/technique tags** (e.g. "Hand-thrown stoneware", "Reclaimed oak") shown as small chips
- **Authenticity/handmade badge** near price
- **Story-driven hero** — rotate hero banners to feature different makers/collections rather than only discounts

---

## 8. Responsive Behavior
- Desktop: 4-column grid, full nav visible, filter bar as inline pills
- Tablet: 2-column grid, filter bar becomes horizontally scrollable
- Mobile: 1–2 column grid, nav collapses to hamburger, search icon expands to full-width field, filter bar becomes a "Filters" button opening a bottom sheet

---

## 9. Next Steps
- Define full color tokens and spacing scale in a shared design system (Figma/Tailwind config)
- Build component library: Header, Hero, FilterBar, ProductCard, RatingStars
- Establish photography guidelines (lighting, background, aspect ratio) for consistency across maker-submitted product photos