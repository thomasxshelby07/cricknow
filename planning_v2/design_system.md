# Design System Strategy (Locked)

> **Status:** PHASE 11 - LOCKED
> **Purpose:** To define a clean, professional, "Meta-style" UI that prioritizes speed, readability, and trust.

---

## 1. Core Philosophy
*   **No Drama:** No glow effects, no neon, no casino-style flashiness.
*   **Trust & Clarity:** A "Corporate/Tech" aesthetic similar to Meta/Facebook or Stripe.
*   **Mobile First:** 70% of users are on mobile. The design is built for 375px width first, then scaled up.

---

## 2. Color Palette (Immutable)
We are locking a specific "Meta-Style" blue theme.

### 🎨 Primary Colors
*   **Primary Blue:** `#0082FB` (Active Buttons, Highlights, Links)
*   **Secondary Blue:** `#0064E0` (Hover States, Focused Elements)
*   **White:** `#FFFFFF` (Cards, Forms, Content backgrounds)

### 🎨 Neutral / Structural Colors
*   **Background:** `#F1F5F8` (Main page background - Soft Grey/Blue)
*   **Dark Navy:** `#1C2B33` (Navbar, Footer, Primary Headings)
*   **Text Grey:** `#4A5568` (Body text - standard Tailwind slate-600 equivalent)
*   **Border:** `#E2E8F0` (Soft dividers)

### ❌ Banned Styles
*   Gradients (Solid colors only)
*   Drop Shadows (Minimal or flat borders only)
*   Neon/Glowing Text

---

## 3. Typography
*   **Font Family:** Use System Sans-Serif stack (Inter or Helvetica/Arial) for maximum speed and readability.
*   **Hierarchy:**
    *   **H1:** #1C2B33, Bold, tight leading.
    *   **H2:** #1C2B33, Semi-bold.
    *   **Body:** #4A5568, Relaxed line-height (1.6) for reading.

---

## 4. Responsive Rules (Mobile-First)

### 📱 Mobile (Default)
*   **Layout:** Single Column (Stack everything).
*   **Navigation:** Sticky Top Bar with Hamburger Menu + Search Icon.
*   **Interactions:** Large touch targets (44px+ height). No hover effects.

### 💻 Desktop (md+)
*   **Layout:** Max-width container (e.g., 1200px) centered.
*   **Grid:** 3-column layouts for Cards/Blogs.
*   **Sidebar:** Visible on large screens.

---

## 5. Component Behavior

### Buttons
*   **Primary:** Background `#0082FB`, Text `White`, Rounded (Medium).
*   **Secondary:** Border `#0082FB`, Text `#0082FB`, Background Transparent.

### Cards (Sites/Offers)
*   **Background:** White `#FFFFFF`.
*   **Border:** 1px Solid `#E2E8F0`.
*   **Behavior:** Stack vertical on Mobile (Image Top -> Content -> CTA Bottom).

### Admin Panel UI
*   **Theme:** "Boring Productivity".
*   **Sidebar:** #1C2B33 (Dark).
*   **Main Area:** #F1F5F8 (Light).
*   **Forms:** White cards, clear labels, standard inputs.

---

## 6. Performance & SEO Impact
*   **Light Paint:** Use of light backgrounds and solid colors ensures low "Time to Contentful Paint".
*   **CLS (Layout Shift):** Sticky headers and fixed-height cards prevent layout shifts.
*   **Accessibility:** High contrast (Navy on Light Grey) meets WCAG standards.

---

## 🔒 Phase 11 Output Checklist
*   [x] "Meta-Style" Color Palette Locked (#0082FB / #1C2B33).
*   [x] "No Glow" Policy confirmed.
*   [x] Mobile-First Layout Rules defined.
*   [x] Typography Hierarchy set.
*   [x] Admin Panel visual theme defined.
