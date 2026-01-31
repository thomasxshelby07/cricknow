# Blog & News Strategy (Locked)

> **Status:** PHASE 7 - LOCKED
> **Purpose:** To define the "Traffic Engine" (Blogs) and "Freshness Signal" (News) that drive organic growth.

---

## 1. Core Distinction
| Feature | **Blogs 📝** | **News 📰** |
| :--- | :--- | :--- |
| **Goal** | Organic Traffic & Ranking | Crawl Frequency & Freshness |
| **Content Type** | Long-form, Evergreen | Short-form, Time-sensitive |
| **Update Cycle** | Quarterly Refresh (Update Date) | Daily/Weekly (New Posts) |
| **Examples** | "Best Betting Apps 2026" | "New Casino Bonus Launched" |

---

## 2. Blog Creation Flow (The Traffic Engine)
Designed for high-quality SEO content creation.

### 🔹 Minimum Viable Post (Required)
*   **Title:** "How to Bet on Cricket"
*   **Slug:** `/blogs/how-to-bet-on-cricket`
*   **Category:** `Guides`
*   **Content:** Rich Text Body
*   **Status:** `Draft` / `Published`

### 🔹 SEO Power Features (Optional)
*   **Meta Settings:** Custom Title, Description, Keywords.
*   **Indexing:** Toggle `No-Index` for thin content.
*   **Media:** Featured Image (OG Image).
*   **Excerpt:** Custom summary for listing cards.

---

## 3. Internal Linking Strategy (The Weapon)
**Goal:** Transfer authority from "Traffic Pages" (Blogs) to "Money Pages" (Betting Sites).

**Admin Controls:**
1.  **Related Betting Sites:** Admin manually picks specific sites (e.g., "Review of 1xBet" linked in "Best Odds" blog).
2.  **Related Offers:** Admin selects active promotions to display in the sidebar or bottom of the blog.
3.  **Related Blogs:** Cluster similar topics (Siloing).

**Result:** Users read information -> See relevant Offer -> Click -> Convert.

---

## 4. News System (The Signal)
Designed for speed and frequency.

*   **Workflow:** Simple title, summary, short content.
*   **SEO Role:** Signals to Google that the site is "Alive".
*   **Visibility:** Recent news appears on Home Page to show activity.

---

## 5. Category & Silo Structure
Content is not flat; it is clustered to build Topical Authority.

*   **Betting:** General guides, laws, how-to.
*   **Casino:** Strategies, game reviews.
*   **Cricket:** Match specific content, tournament guides.
*   **Guides:** Tutorials for beginners.

**URL Structure:**
*   `/blogs` (Archive)
*   `/blogs/[slug]` (Post)
*   *Note: Categories function as filters, not URL prefixes, to keep URLs short.*

---

## 6. Home Page Distribution
The Admin determines which content gets the prime real estate.
*   **Featured Blogs:** Manually selected for the Hero or "Popular" section.
*   **Latest News:** Auto-populated or pinned.
*   **Ordering:** Custom display order to prioritize high-converting topics.

---

## 7. Content Lifecycle
*   **Refresh System:** Admin updates content -> System updates `updatedAt` -> Schema reflects new date -> Google re-crawls.
*   **Archiving:** Outdated news can be hidden without breaking the site structure.

---

## 🔒 Phase 7 Output Checklist
*   [x] Blog vs News Distinction Locked.
*   [x] Creation Flow (Required vs Optional) Mapped.
*   [x] Internal Linking Logic (Blogs -> Sites) Defined.
*   [x] Category Silos Established.
*   [x] Home Page Distribution Rules Set.
