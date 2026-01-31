# System Architecture & Data Flow (Locked)

> **Status:** PHASE 2 - LOCKED
> **Purpose:** To define the immutable laws of data flow, architecture, and control.

---

## 1. High-Level Architecture
**Single Project Approach:** The entire platform resides in one Next.js repository.

```
Next.js Project
├── Public Website (Frontend)   <- Consumers (SEO Optimized, Read-Only)
├── Admin Panel (CMS)           <- Controllers (Protected, Write Access)
└── Backend APIs                <- Logic Layer (Data, Auth, Validation)
```

---

## 2. Core Principle: Admin as Source of Truth
**The Iron Rule:**
*   **The Frontend NEVER decides.** It does not contain hard-coded titles, meta descriptions, or page ordering.
*   **The Admin Panel decides EVERYTHING.** If an Admin changes a slug, title, or visibility flag, the Frontend reflects it immediately (or on next revalidation).
*   **The Database is the Memory.** All decisions are stored in MongoDB.

---

## 3. Data Flow Diagram

### Writing Data (Admin)
`Admin UI` -> `Next.js API Route (Auth Check)` -> `Validate Role` -> `Write to MongoDB`

### Reading Data (Frontend)
`User Request` -> `Next.js Page (Server Component)` -> `Fetch from MongoDB` -> `Render HTML`

**Key SEO Flow:**
1.  Admin sets "Meta Title" = "Best Cricket Apps".
2.  Database stores `{ seoTitle: "Best Cricket Apps" }`.
3.  Frontend Page fetches data.
4.  Frontend renders `<title>Best Cricket Apps</title>`.

---

## 4. Tech Stack & Database Strategy

### Technology
*   **Framework:** Next.js 14+ (App Router).
*   **Rendering:** SSR (Server-Side Rendering) for dynamic dynamic checks, ISR (Incremental Static Regeneration) for high-performance content.
*   **Database:** MongoDB.

### MongoDB Schema Philosophy
Every content collection (Blogs, Sites, News) MUST include these schema blocks:

**1. SEO Block:**
```json
{
  "seoTitle": "String",
  "seoDescription": "String",
  "slug": "String (Unique, Indexed)",
  "canonicalUrl": "String",
  "noIndex": "Boolean"
}
```

**2. Visibility Block:**
```json
{
  "status": "Published | Draft | Archived",
  "showOnHome": "Boolean",
  "showOnTv": "Boolean",
  "priorityOrder": "Number"
}
```

---

## 5. API & Route Architecture

### Public Routes (SEO)
Purely determined by DB data.
*   `/blogs/[slug]` -> Fetches blog by slug.
*   `/betting-sites/[slug]` -> Fetches site review by slug.

### Private Routes (Admin)
Protected by Middleware.
*   `/admin/dashboard`
*   `/admin/blogs/edit/[id]`
*   `/admin/seo-settings`

### API Routes
*   `GET /api/public/posts` -> Public data, filtered by `status: Published`.
*   `POST /api/admin/posts` -> Protected, allows writing any data.

---

## 6. Security & Roles
*   **Authentication:** NextAuth.js (or similar) via API.
*   **Roles:**
    *   **Super Admin:** Can manage other admins + all content.
    *   **Admin:** Can manage content only.
*   **Protection:** API routes verify session AND role before performing write operations.

---

## 7. Implementation Rules
1.  **No Environmental SEO:** Do not put SEO strings in `.env` files. Put them in the DB.
2.  **Graceful Failures:** If DB is down, show a custom 500 error, do not serve broken SEO pages.
3.  **URL Consistency:** If the Admin changes a slug, the old URL should ideally 404 (to drop from index) or 301 (if redirect logic is built). For Phase 1/2, a 404 is acceptable.

---

## 🔒 Phase 2 Output Checklist
*   [x] Architecture Defined (Single App).
*   [x] Data Flow Locked (Admin -> DB -> Frontend).
*   [x] Hierarchy Established (Admin = Brain).
