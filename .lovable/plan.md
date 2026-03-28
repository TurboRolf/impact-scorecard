

## Problem
Stars rating row sits below the company name, which feels disconnected and wastes vertical space.

## Proposed Alternatives

Here are 3 layout options:

```text
Option A: Rating to the right (recommended)
┌──────────────────────────────────┐
│ [Logo]  Company Name    ★★★★☆ 4/5
│         Category           ↑
│                                  │

Option B: Compact inline after name
┌──────────────────────────────────┐
│ [Logo]  Company Name  ★★★★☆ 4/5 │
│         Category                 │

Option C: Rating as badge in top-right corner
┌──────────────────────────────────┐
│ [Logo]  Company Name     [4.0 ★] │
│         Category                 │
```

**Option A** — Place the stars + score on the same row as the company name, pushed to the right using `flex justify-between`. The name/category stays left, rating aligns right. This keeps everything compact and visually balanced.

## Plan (Option A)

**File: `src/components/CompanyCard.tsx`**
- Change the header from `flex-col gap-2` back to a single row
- Use `flex items-start justify-between` for the outer wrapper
- Left side: logo + name/category
- Right side: stars + score + trend icon, aligned to the right
- Stars use smaller size (`h-3 w-3`) to fit comfortably

This keeps the card header to one row and puts the rating where it's naturally expected — next to the company identity.

