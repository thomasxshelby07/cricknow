# Page Manager & Scaling Strategy (Locked)

> **Status:** PHASE 10 - LOCKED
> **Purpose:** To transform the Admin Panel into a "No-Code" Page Builder and Layout Manager.

---

## 1. Core Philosophy (The "Admin is King" Rule)
*   **100% Admin Control:** The Admin doesn't just edit *content*; they edit *structure*.
*   **Dynamic Layouts:** Which section appears first? Is the "Hero" visible? Admin decides.
*   **Unlimited Pages:** Admin can create new "Extra Pages" (e.g., `/best-ipl-apps`) by assembling existing components.

---

## 2. The "Page Manager" Module
A dedicated area in the Admin Panel to control layouts.

### 🔹 Page Registry (The Master List)
Admin sees a list of ALL pages:
*   **System Pages:** `Home`, `Cricket`, `Casino`, `Offers` (Fixed Slugs, Editable Layouts).
*   **Extra Pages:** `Best Apps`, `New Sites` (Dynamic Slugs, Editable Layouts).

### 🔹 Layout Editor (The Builder)
For any page, the Admin controls a list of **Sections**.
*   **Actions:** `Enable/Disable`, `Reorder` (Drag & Drop), `Configure`.

---

## 3. Section Component Library
The Frontend will contain "Dumb" components that the Admin can invoke.

| Section Name | Configuration Options |
| :--- | :--- |
| **Hero Section** | Title, Subtitle, Background Image |
| **Betting Sites List** | Filter (All/Casino/Cricket), Count (Top 5/10), Show Filter Bar? |
| **Promotions Grid** | Filter (Type), Limit (3/6/9) |
| **Blog Grid** | Filter (Category), Layout (Grid/List) |
| **Content Block** | Rich Text (for SEO descriptions) |
| **Internal Links** | Auto-generated standard links |
| **FAQ Block** | Manual Q&A List |

---

## 4. "Extra Pages" Creation Flow
Admin wants to create a new page: **"Best IPL Betting Apps"**.

1.  **Create Page:**
    *   **Slug:** `/best-ipl-betting-apps`
    *   **SEO:** Set Title, Meta, Keywords.
2.  **Assemble Layout:**
    *   *Add Section:* **Hero** (Title: "Top IPL Apps").
    *   *Add Section:* **Content Block** (Intro text).
    *   *Add Section:* **Betting Sites List** (Filter: `Cricket`, Start: 1, End: 10).
    *   *Add Section:* **FAQ Block** (IPL specific questions).
3.  **Publish:** Page goes live instantly.

---

## 5. Global Control Logic
*   **Home Page:** Treated as just another "Page" in the DB with the slug `/`. Admin can reorder sections (e.g., move "Latest News" above "Blogs").
*   **Category Pages:** treated as System Pages. Admin can toggle "Show Guides" or "Show Sites".

---

## 6. Implementation Data Model
**Page Collection in MongoDB:**
```typescript
{
  slug: String, // Unique Index (e.g., "/", "/best-apps")
  title: String,
  type: "system" | "extra",
  seo: SEOSchema,
  sections: [
    {
      component: "Hero",
      order: 1,
      isVisible: true,
      props: { title: "...", image: "..." }
    },
    {
      component: "BettingSiteList",
      order: 2,
      isVisible: true,
      props: { filter: "cricket", limit: 10 }
    }
  ],
  status: "published"
}
```

---

## 🔒 Phase 10 Output Checklist
*   [x] "Page Manager" Module Defined.
*   [x] Dynamic Section/Component Architecture Mapped.
*   [x] "Extra Page" Creation Logic Locked.
*   [x] JSON-based Layout Storage Strategy Defined.
*   [x] Zero-Code Scaling Promise Confirmed.
