# Cricknow Project Constitution & SEO Strategy (Locked)

> **Status:** PHASE 1 - LOCKED
> **Purpose:** To define the immutable laws of the Cricknow platform before any code is written.

---

## 1. Core Purpose
The platform exists for two specific goals:
1.  **Bring Organic Traffic** (via Blogs & News)
2.  **Convert Traffic** (via Betting Sites & Promotions)

**Strict Exclusions:**
*   No live betting or odds APIs.
*   No gambling systems or user wallets.
*   No real-time match data.

---

## 2. Target Audience & Search Intent
The admin panel and frontend must cater to these specific user intents:

| Intent | Description | Example Query | Content Type |
| :--- | :--- | :--- | :--- |
| **Informational** | Learning about betting/cricket | "How online betting works" | Blog |
| **Commercial** | Looking for options | "Best betting sites India" | Betting Site (List/Review) |
| **Promotional** | Seeking bonuses | "500% welcome bonus" | Promotion |
| **Navigational** | Looking for a specific brand | "1xBet review" | Betting Site (Review) |

---

## 3. Content Types (SEO Assets)
The system is built around these four distinct content entities:

### 1. Blogs (Traffic Engine)
*   **Role:** Long-form, evergreen content for ranking.
*   **Key Fields:** Title, Content (Rich Text), Author, Category, Tags, SEO Meta.

### 2. News (Freshness Signal)
*   **Role:** Short, frequent updates to signal site activity to search engines.
*   **Key Fields:** Title, Short Content, Date, SEO Meta.

### 3. Betting Sites (Money Pages)
*   **Role:** High-intent review and comparison pages.
*   **Key Fields:** Brand Name, Logo, Rating, Review Content, Affiliate Link, Key Features, SEO Meta.

### 4. Promotions (CTR Boosters)
*   **Role:** Specific offers linked to betting sites.
*   **Key Fields:** Bonus Amount, Bonus Code, Expiry, Terms, Link to Betting Site, SEO Meta.

---

## 4. Page Structure & Visibility
The frontend architecture is fixed as follows:

**Core Pages (Dynamic):**
*   **Home:** The central hub (Custom layout).
*   **Blogs:** `/blogs` (Archive) & `/blogs/[slug]` (Single).
*   **News:** `/news` (Archive) & `/news/[slug]` (Single).
*   **Offers:** `/offers` (Archive) & `/offers/[slug]` (Single).
*   **Betting Sites:** `/betting-sites` (List) & `/betting-sites/[slug]` (Review).
*   **Cricket:** `/cricket` (Category hub).
*   **Casino:** `/casino` (Category hub).

**Support Pages (Static/Admin Managed):**
*   About Us
*   Contact
*   Disclaimer
*   Responsible Gaming
*   Privacy Policy

---

## 5. URL Strategy (SEO-First)
IMMUTABLE RULE: Extensions are controlled by the admin slug, but the base path is fixed.

*   **Blogs:** `domain.com/blogs/how-online-betting-works`
*   **News:** `domain.com/news/betting-industry-update`
*   **Betting Sites:** `domain.com/betting-sites/site-name`
*   **Promotions:** `domain.com/offers/site-name-bonus`

**Why?** Clean hierarchy, easy to classify in GSC (Google Search Console), no tech debt.

---

## 6. Admin SEO Control Requirements
The Admin Panel **MUST** provide these controls for every single page/post type:

1.  **Page Title:** Custom `<title>` tag.
2.  **Meta Description:** Custom `<meta name="description">`.
3.  **URL Slug:** Fully editable (e.g., changing `smart-betting-tips` to `smart-cricket-betting-tips`).
4.  **Index Status:** Toggle `index` / `no-index`.
5.  **Canonical URL:** Option to set a custom canonical field.
6.  **Internal Links:** Manual selection of "Related Posts" or "Related Sites".
7.  **Date Control:** Ability to update "Last Updated" schema without changing publish date.

---

## 7. Internal Linking Strategy (The Web)
*   **Blogs** → MUST link to relevant **Betting Sites** and **Offers**.
*   **Betting Sites** → MUST link to their specific **Offers**.
*   **News** → Links to contextually relevant **Blogs**.
*   **Home Page** → Manually curated links to "Top Betting Sites", "Featured Offers", "Latest News".

---

## 8. Home Page Architecture
The Home Page is an SEO landing page and link distributor.
**Sections:**
1.  **Hero (H1):** Keyword focused (e.g., "Best Cricket Betting Sites in India").
2.  **Top Betting Sites:** A table/list of the highest-converting partners.
3.  **Promotions:** Featured bonuses.
4.  **Latest Blogs:** Link to informational content.
5.  **Latest News:** Freshness signal.
6.  **Casino & Cricket Categories:** Deep links to hubs.

---

## 9. Technical Constraints & Exclusions
*   NO Live Odd APIs.
*   NO User Accounts (End users do not log in).
*   NO Payment Gateways.
*   **Performance:** Must pass Core Web Vitals (Green).
*   **Mobile First:** Design for mobile users first, desktop second.
