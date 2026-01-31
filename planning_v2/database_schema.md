# Database Schema Design (Locked)

> **Status:** PHASE 4 - LOCKED
> **Purpose:** To define WHAT data is stored, WHY, and HOW it enables Admin-led SEO.

---

## 1. Global Principles (The DNA)
*   **Minimal Requirements:** Only essential fields (Title, Slug, Status) are mandatory. Everything else is optional to allow rapid content creation.
*   **SEO as Data:** Titles, Descriptions, and visibility flags are stored, not hardcoded.
*   **Visibility Flags:** Frontend logic is dumb; it simply obeys `showOnHome: true` from the DB.
*   **Non-Destructive:** Status is `draft`, `published`, or `archived`. We rarely hard-delete.

---

## 2. Common Shared Schemas
To ensure consistency across All Content Types (Sites, Blogs, News, Offers).

### `SEOSchema` (Embedded)
```typescript
{
  metaTitle: String,       // <title>
  metaDescription: String, // <meta name="description">
  focusKeywords: [String], // Internal tracking
  canonicalUrl: String,    // <link rel="canonical">
  noIndex: Boolean,        // <meta name="robots" content="noindex">
  noFollow: Boolean        // <meta name="robots" content="nofollow">
}
```

### `VisibilitySchema` (Embedded)
```typescript
{
  showOnHome: Boolean,
  showOnMenu: Boolean,
  // Context specific flags added per collection
  displayOrder: Number,    // 1 = Top
  status: { 
    type: String, 
    enum: ['draft', 'published', 'archived'], 
    default: 'draft' 
  }
}
```

---

## 3. Users Collection (Admin & Auth)
*   **Purpose:** Authentication and Role Management.
*   **Fields:**
    *   `email`: String (Required, Unique, Index)
    *   `passwordHash`: String (Required)
    *   `role`: String (Enum: `SUPER_ADMIN`, `ADMIN`, Required)
    *   `name`: String
    *   `lastLogin`: Date

---

## 4. Betting Sites Collection (Money Pages)
*   **Purpose:** The core revenue drivers. Reviews and conversions.
*   **Required Fields:**
    *   `name`: String
    *   `slug`: String (Unique, Index)
    *   `type`: String (Enum: `betting`, `casino`, `cricket`)
    *   `status`: String

*   **Optional & SEO Fields:**
    *   `shortDescription`: String (Cards)
    *   `fullDescription`: String (Rich Text / Markdown)
    *   `seo`: `SEOSchema`
    *   `ranking`: Number (Global Rank)
    *   **Promotions Block:**
        *   `mainBonusText`: String ("100% up to ₹10,000")
        *   `joiningBonus`: String
        *   `redeemBonus`: String
        *   `affiliateLink`: String
        *   `ctaText`: String ("Claim Now")
    *   **Media:**
        *   `logoUrl`: String
        *   `coverImageUrl`: String
    *   **Visibility (`VisibilitySchema` + Extras):**
        *   `showOnHome`: Boolean
        *   `showOnOffers`: Boolean
        *   `showOnCasino`: Boolean
        *   `showOnCricket`: Boolean
        *   `isFeatured`: Boolean

---

## 5. Blogs Collection (Traffic Engine)
*   **Purpose:** Long-form informational content for organic search.
*   **Required Fields:**
    *   `title`: String
    *   `slug`: String (Unique, Index)
    *   `category`: String (e.g., "Guides", "Strategies")
    *   `content`: String (Rich Text)
    *   `status`: String

*   **Optional & SEO Fields:**
    *   `seo`: `SEOSchema`
    *   `excerpt`: String
    *   `coverImageUrl`: String
    *   **Internal Linking:**
        *   `relatedSites`: [ObjectId -> BettingSites]
        *   `relatedOffers`: [ObjectId -> Promotions]
        *   `relatedBlogs`: [ObjectId -> Blogs]
    *   **Visibility:**
        *   `showOnHome`: Boolean
        *   `isFeatured`: Boolean

---

## 6. News Collection (Freshness)
*   **Purpose:** Fast, frequent updates.
*   **Required Fields:**
    *   `title`: String
    *   `slug`: String
    *   `summary`: String
    *   `content`: String
    *   `status`: String

*   **Optional & SEO Fields:**
    *   `seo`: `SEOSchema`
    *   **Visibility:**
        *   `showOnHome`: Boolean
        *   `isFeatured`: Boolean
    *   **Internal Linking:**
        *   `relatedSites`: [ObjectId -> BettingSites]

---

## 7. Promotions Collection (Conversion)
*   **Purpose:** Specific bonuses linked to sites.
*   **Required Fields:**
    *   `title`: String ("IPL 2026 Special Bonus")
    *   `slug`: String
    *   `type`: String (Enum: `welcome`, `deposit`, `freebet`)
    *   `siteId`: ObjectId -> BettingSites (Required linkage)
    *   `status`: String

*   **Optional & SEO Fields:**
    *   `bonusCode`: String
    *   `bonusAmount`: String
    *   `ctaText`: String
    *   `redirectUrl`: String (Overrides Site link if present)
    *   `seo`: `SEOSchema`
    *   **Visibility:**
        *   `showOnHome`: Boolean
        *   `showOnCasino`: Boolean
        *   `showOnCricket`: Boolean

---

## 🔒 Phase 4 Output Checklist
*   [x] Standardized `SEOSchema` block defined.
*   [x] Standardized `VisibilitySchema` block defined.
*   [x] Collections Defined: Users, Betting Sites, Blogs, News, Promotions.
*   [x] Relationships Mapped (Promotions -> Sites, Blogs -> Sites).
*   [x] "Minimal Required" philosophy enforced.
