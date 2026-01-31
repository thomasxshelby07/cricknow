# Public Frontend & SEO Strategy (Locked)

> **Status:** PHASE 9 - LOCKED
> **Purpose:** To define how the Frontend renders Admin-controlled SEO and Content.

---

## 1. Core Philosophy
*   **The "Headless" SEO:** The Frontend is a dumb renderer. it does not know what a "best betting site" is; it only knows to render the list provided by the DB.
*   **Zero Hardcoding:** No H1s, no meta descriptions, and no links are hardcoded in the TSX files. They are injected from the `page` or `layout` data fetched from the API.
*   **Performance:** Mobile-first, fast loading, Google-friendly.

---

## 2. Dynamic Routing & SEO Injection
All core content pages use Next.js Dynamic Routes.

| Route | Logic |
| :--- | :--- |
| `/` | `app/page.tsx` -> Fetches Home Config |
| `/blogs/[slug]` | `app/blogs/[slug]/page.tsx` -> Fetches Blog by Slug |
| `/news/[slug]` | `app/news/[slug]/page.tsx` -> Fetches News by Slug |
| `/betting-sites/[slug]` | `app/betting-sites/[slug]/page.tsx` -> Fetches Site by Slug |
| `/offers/[slug]` | `app/offers/[slug]/page.tsx` -> Fetches Offer by Slug |

**SEO Head Injection:**
```tsx
export async function generateMetadata({ params }) {
  const data = await fetchContent(params.slug);
  return {
    title: data.seo.metaTitle,
    description: data.seo.metaDescription,
    robots: {
      index: !data.seo.noIndex,
      follow: !data.seo.noFollow
    },
    alternates: {
      canonical: data.seo.canonicalUrl || `https://domain.com/blogs/${params.slug}`
    }
  }
}
```

---

## 3. Page Layouts & Section Architecture
Every page is composed of specific Admin-Controlled sections.

### 🏠 Home Page
*   **Navbar:** Global.
*   **Hero Section:** H1 + Intro Text (Admin editable).
*   **Top Betting Sites:** Filtered list (Admin selected).
*   **Top Offers:** Featured vertical cards.
*   **Traffic Sections:** Latest Blogs, Latest News.
*   **Hubs:** Casino Section, Cricket Section.
*   **Trust:** "Why Trust Us", Footer.

### 📰 Blog & News Listings (`/blogs`, `/news`)
*   **Header:** H1 + SEO Text.
*   **Categories:** Pill filters.
*   **Grid:** The content listing (Pagination enabled).
*   **Sidebar/Bottom:** Internal Links to Money Pages.

### 📝 Blog Detail (`/blogs/[slug]`)
*   **Article Header:** Title, Author, Date, Breadcrumbs.
*   **Content:** Rich Text Renderer (Markdown/HTML).
*   **Injection Zones:**
    *   "Related Betting Sites" (Cards inserted in content or sidebar).
    *   "Related Offers" (CTA banners).

### 🎯 Betting Site Detail (`/betting-sites/[slug]`)
*   **Sticky Header:** Logo, Rating, "Claim Bonus" button.
*   **Review Content:** Deep dive text.
*   **Offers Block:** List of active promotions for this site.
*   **FAQ Schema:** JSON-LD injected automatically.
*   **Cross-Link:** "Read News about [Site Name]".

### 🎁 Offers, Casino, Cricket Pages
*   **Hub Layout:** Header -> Filtered List -> SEO Text Block -> FAQ.

---

## 4. Internal Link Rendering
The Frontend explicitly renders connections defined in the Admin Panel:
*   **Logic:** `if (post.relatedSites.length > 0) renderSidebarSites(post.relatedSites)`
*   **Result:** A spiderweb of internal links that Google can crawl, distributing equity from Blogs to Money Pages.

---

## 5. Technical Requirements
*   **Images:** `next/image` always. Alt text from DB.
*   **Schema:** JSON-LD for `Article`, `Review`, `BreadcrumbList`.
*   **Sitemap:** Dynamic `sitemap.xml` generated from active DB entries.

---

## 🔒 Phase 9 Output Checklist
*   [x] Frontend "Dumb Renderer" logic confirmed.
*   [x] Dynamic Routing mapped to Content Types.
*   [x] Metadata Injection Strategy defined.
*   [x] Section-by-Section Layouts locked.
*   [x] Internal Link Rendering logic defined.
