# Report posts + admin moderation

Add a reporting flow for users and an admin-only moderation page where you (the developer) can review reports and take posts down.

## What users see

- A "Report" item in the post menu (`PostCard`) — opens a small dialog with:
  - Reason dropdown: Spam, Harassment, Hate speech, Misinformation, Illegal content, Other
  - Optional details textarea (max 500 chars)
- After submit: toast "Report submitted, thank you". Same user cannot report the same post twice.
- Only signed-in users can report.

## What admin (you) sees

- New route `/admin/reports`, protected — only visible to users with the `admin` role.
- A new "Admin" link appears in `LeftSidebar` and footer only when current user is admin.
- Page lists all reports grouped by post, newest first:
  - Post preview (author, content, created date)
  - Reports list (reporter username, reason, details, date)
  - Status badge: pending / reviewed / dismissed / removed
  - Actions per post: **Remove post** (deletes from `posts`), **Dismiss reports**, **Mark reviewed**
- Clicking the post opens it in context.

## Database changes (migration)

1. `app_role` enum: `admin`, `moderator`, `user`.
2. `user_roles` table (`id`, `user_id`, `role`, unique on pair) with RLS — users can read their own roles; only admins can insert/delete.
3. `has_role(_user_id, _role)` security-definer function (standard pattern).
4. `post_reports` table:
   - `id`, `post_id`, `reporter_id`, `reason` (text), `details` (text, nullable), `status` (text default `pending`), `created_at`, `reviewed_at`, `reviewed_by`
   - Unique `(post_id, reporter_id)` to prevent duplicate reports
   - RLS:
     - INSERT: authenticated, `auth.uid() = reporter_id`
     - SELECT: reporter sees own reports OR `has_role(auth.uid(),'admin')`
     - UPDATE/DELETE: admin only
5. Extend posts DELETE policy: allow `has_role(auth.uid(),'admin')` to delete any post (in addition to owner).
6. Manual step after migration: I'll tell you to run one INSERT in SQL editor to grant yourself the `admin` role using your user id.

## Code changes

- `src/hooks/useUserRole.ts` — fetches current user's roles, exposes `isAdmin`.
- `src/components/ReportPostDialog.tsx` — reason + details form, zod-validated, inserts into `post_reports`.
- `src/components/PostCard.tsx` — add "Report" entry in dropdown menu (hidden for own posts and unauth users).
- `src/pages/AdminReports.tsx` — moderation UI (list, group, actions). Uses `useUserRole` to gate access; redirects non-admins.
- `src/App.tsx` — add `/admin/reports` route wrapped in `ProtectedRoute`.
- `src/components/feed/LeftSidebar.tsx` + `MobileFooterLinks.tsx` — conditionally show "Admin" link when `isAdmin`.

## Out of scope

- Email notifications, appeal flow, soft-delete/restore of posts (hard delete only), reporting comments or boycotts (can add later with same pattern).