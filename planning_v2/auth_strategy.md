# Authentication, Roles & Access Control Strategy (Locked)

> **Status:** PHASE 3 - LOCKED
> **Purpose:** To define WHO can do WHAT, WHERE, and HOW safely. Security + Control = Survival.

---

## 1. Core Security Philosophy
*   **Zero Trust:** No role = No access.
*   **Protection of SEO:** The system is designed to prevent accidental or malicious destruction of SEO rankings.
*   **Auditability:** Every significant action is traceable.

---

## 2. User Roles & Permissions

### 🔑 SUPER ADMIN
**The Owner / System Controller.**
*   **Capabilities:**
    *   Create & Delete Admin users.
    *   Full Read/Write access to ALL modules (News, Blogs, Sites, Offers).
    *   Override system defaults.
    *   View Audit Logs.
    *   **Exclusive Right:** Only Super Admin can "Hard Delete" (permanently remove) content. Admins can only "Archive" or "Soft Delete".

### 🔑 ADMIN
**The Content Manager / Editor.**
*   **Capabilities:**
    *   Create, Edit, Publish: Blogs, News, Betting Sites, Promotions.
    *   Manage content-specific SEO (Titles, Meta, Slugs).
    *   Change Page Visibility (Show on Home, etc.).
*   **Restrictions:**
    *   ❌ CANNOT create new users.
    *   ❌ CANNOT delete other Admins.
    *   ❌ CANNOT access system-level settings (env vars, DB configs).
    *   ❌ CANNOT perform "Hard Deletes" (only Soft Delete/Unpublish).

---

## 3. Authentication Flow

### Login Process
1.  **Input:** Email + Password.
2.  **Verification:** Backend verifies password hash (Argon2/Bcrypt) against MongoDB.
3.  **Token Issue:** Secure, HTTP-Only Session Cookie (JWT or Session ID) is issued.
4.  **Role Attachment:** Session data includes `{ role: "SUPER_ADMIN" | "ADMIN" }`.
5.  **Access:** Middleware checks cookie on every request to `/admin/*` or `/api/admin/*`.

---

## 4. Role-Based Access Control (RBAC) Architecture

### Backend Enforcement (The Real Guard)
The checks happen at the API level, not just the UI.

*   `POST /api/admin/users/create` -> **Requires `SUPER_ADMIN`**.
*   `POST /api/admin/blogs/create` -> **Requires `ADMIN` or `SUPER_ADMIN`**.
*   `DELETE /api/admin/blogs/:id` -> **Requires `SUPER_ADMIN`** (for Hard Delete).
*   `PATCH /api/admin/blogs/:id/status` -> **Requires `ADMIN` or `SUPER_ADMIN`** (for Archive/Soft Delete).

---

## 5. SEO Asset Protection Mechanisms

### 1. The "Soft Delete" Safety Net
*   **Problem:** Accidental deletion of a ranking page (e.g., `/best-betting-apps`) creates a 404 and kills traffic.
*   **Solution:** "Delete" button for Admins actually performs a **Soft Delete** (flags as `status: 'archived'`). The page may 404 or show a "No longer available" message, but the data is **never lost** from the DB. Only Super Admin can purge it.

### 2. Slug Change Warnings
*   **Problem:** Changing `/betting-sites/1xbet` to `/betting-sites/1xbet-review` breaks the old link.
*   **Solution:** Admin panel shows a **WARNING** when editing a slug of a published page: *"Changing this will break existing external links. Are you sure?"*

### 3. Preview Mode
*   **Rule:** Admins must be able to see a page as it would look (with SEO tags) *before* hitting Publish.

---

## 6. Audit & Safety Logging
The database will maintain a `ChangeLog` collection:
*   **Who:** User ID (e.g., `admin@cricknow.com`)
*   **Action:** `UPDATE_SEO`, `PUBLISH_POST`, `CHANGE_SLUG`
*   **Target:** `Blog: "How to Bet"`
*   **Timestamp:** `2026-01-30T10:00:00Z`

**Why?** If rankings drop, we check the log: *"Ah, User X changed the Title Tag yesterday."*

---

## 7. Admin UI/UX Guidelines
*   **Dangerous Actions:** Red buttons, confirmation modals ("Type DELETE to confirm").
*   **Restricted UI:** If logged in as `ADMIN`, the "Manage Users" sidebar item is hidden entirely.
*   **Status Indicators:** Clear badges for `Published` (Green), `Draft` (Yellow), `Archived` (Red).

---

## 🔒 Phase 3 Output Checklist
*   [x] Roles Defined (Super Admin vs Admin).
*   [x] Auth Flow Locked (Token-based, Server-verified).
*   [x] RBAC Rules Established (API-level enforcement).
*   [x] SEO Protection Strategy (Soft Deletes, Slug Warnings).
