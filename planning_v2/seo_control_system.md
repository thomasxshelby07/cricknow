# SEO Control System Strategy (Locked)

> **Status:** PHASE 6 - LOCKED
> **Purpose:** To define the Admin Panel as the "SEO Brain" and the Frontend as the "SEO Body".

---

## 1. Core Philosophy
*   **Data over Code:** SEO is treated as dynamic data, never hardcoded strings.
*   **Granular Control:** Every single page (from a massive betting review to a tiny news update) has the same robust SEO controls.
*   **Safety First:** The system actively prevents SEO damage (accidental de-indexing, broken links).

---

## 2. Page-Level SEO Controls (The Standard)
Every content model (`Site`, `Blog`, `News`, `Promotion`) implements this control set:

### 🔹 Core Data
*   **Meta Title:** Custom database field.
*   **Meta Description:** Custom database field.
*   **Focus Keywords:** Stored for internal reference/checking.

### 🔹 Indexing Robots
*   **Index Toggle:** `Index` (Default) vs `No-Index` (For thin content).
*   **Follow Toggle:** `Follow` (Default) vs `No-Follow`.

### 🔹 Canonical & URL
*   **Slug:** Fully editable.
*   **Canonical Overrides:** Optional field to point manual canonicals (e.g., maximizing link equity to a master page).

---

## 3. Global SEO Defaults (Super Admin)
To ensure safety when Admins forget to fill fields.
*   **Fallback Title Logic:** `[Page Title] | [Site Name]`
*   **Fallback Description:** `[First 160 chars of content]...`
*   **Default Robot:** `index, follow` unless specified otherwise.

---

## 4. Internal Linking System (Manual Silos)
**Automated Random Links = Spam.**
**Manual Curated Links = SEO Gold.**

The system enables Manual Silos via the Admin Panel:
*   **Blog Post** -> Selects 3 specific **Related Betting Sites**.
*   **Betting Site Review** -> Selects 3 specific **Active Promotions**.
*   **Home Page** -> Admin specifically picks which "Featured Blogs" appear.

**Result:** Controlled Link Juice flow.

---

## 5. Visibility = SEO Signal
The database `visibility` object is the primary signal for internal link depth.
*   `showOnHome: true` -> Highest internal link value (Tier 1).
*   `showOnCategory: true` -> Medium internal link value (Tier 2).
*   `showOnListing: true` -> Standard link value (Tier 3).
*   `archived: true` -> 0 internal links (Orphaned/Removed).

---

## 6. Freshness Engine
Google loves "Last Updated".
*   **Mechanism:** Any save action in Admin (Content edit, SEO tweak, Promotion update) updates the `updatedAt` timestamp.
*   **Frontend Effect:** Schema markup (`dateModified`) updates automatically.
*   **Result:** Freshness signal sent to Google without rewriting the whole article.

---

## 7. SEO Safety System (Fail-safes)
1.  **Duplicate Slug Prevention:** Backend API rejects usage of an existing slug.
2.  **Soft Deletes:** "Delete" action sets `status: archived`. URL returns 404 (or custom message) but data persists for recovery.
3.  **Preview:** Admin can see the Google Search Snippet preview before publishing.

---

## 🔒 Phase 6 Output Checklist
*   [x] Page-Level Control Set Defined.
*   [x] Global Default Logic Defined.
*   [x] Visibility > Link Equity Logic Mapped.
*   [x] Freshness Engine Logic Defined.
*   [x] Safety Fail-safes (Slugs/Soft Delete) confirmed.
