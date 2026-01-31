# Conversion Strategy (Locked)

> **Status:** PHASE 8 - LOCKED
> **Purpose:** To define the "Money Engine" (Betting Sites & Promotions) and how traffic converts to revenue.

---

## 1. Core Philosophy
*   **Betting Sites = SEO Landing Pages:** These are not just database entries; they are full-fledged pages (e.g., `/betting-sites/1xbet`) designed to rank for commercial keywords like "1xBet Review".
*   **Promotions = CTR Boosters:** Separate entities that can be attached to multiple locations (Home Page, Sidebar, Site Page) to drive clicks.
*   **Traffic Flow:** Content (Blogs/News) -> Context (Betting Site Review) -> Conversion (Promotion/CTA).

---

## 2. Betting Site Creation Flow (The Money Page)
**Goal:** Create high-authority pages that rank and convert.

### 🔹 Minimum Viable Page (Required)
*   **Name:** "Parimatch"
*   **Slug:** `/betting-sites/parimatch`
*   **Type:** `Betting`
*   **Status:** `Draft` / `Published`

### 🔹 Conversion Features (Optional)
*   **Promotions Block:** "150% Welcome Bonus".
*   **Affiliate Link:** Direct redirect for the CTA button.
*   **Deep Content:** "Full Review of Parimatch 2026" (Rich Text).
*   **SEO:** Custom Title/Meta to target "Best Betting Site" keywords.

---

## 3. Promotion Creation Flow (The Hook)
**Goal:** Flexible offers that can be rotated without changing the parent site page.

### 🔹 Minimum Viable Offer (Required)
*   **Title:** "IPL 2026 Deposit Bonus"
*   **Slug:** `/offers/ipl-deposit-bonus`
*   **Related Site:** Linked to `Parimatch` (Data consistency).

### 🔹 CTR Features (Optional)
*   **Bonus Code:** "IPL2026" (Copy to clipboard function).
*   **Deep Link:** Overrides the default site link if needed.
*   **Visibility:** "Show on Home", "Show on Sidebar".

---

## 4. Traffic & Conversion Flow
The system is designed to funnel users from Information to Action.

1.  **Acquisition:** User lands on Blog "How to bet on IPL".
2.  **Nurturing:** User sees Sidebar Widget "Best IPL Betting Sites" (Internal Link).
3.  **Evaluation:** User clicks to `/betting-sites/parimatch` (Review Page).
4.  **Conversion:** User sees "150% Bonus" Promotion -> Clicks "Claim Now".
5.  **Revenue:** User hits Affiliate Link -> Registers.

---

## 5. Home Page as Conversion Hub
The Admin controls the "Storefront".
*   **Hero Section:** Manually select the top 3 highest-converting sites.
*   **Featured Offers:** Pinned Promotions for seasonal events.
*   **Top Lists:** "Top 10 Betting Sites" (Ordered by Admin logic, not random).

---

## 6. SEO Safety for Money Pages
*   **Permanence:** Betting Site pages build authority over time. We **Soft Delete** (Archive) only; never Hard Delete.
*   **Canonical Safety:** If a Promotion page is thin, it can be set to `No-Index` or Canonicalized to the main Betting Site page.

---

## 🔒 Phase 8 Output Checklist
*   [x] Betting Site "Money Page" role defined.
*   [x] Promotion "CTR Booster" role defined.
*   [x] Traffic Funnel (Blog -> Site -> Offer) mapped.
*   [x] Home Page commercial signals established.
