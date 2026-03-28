

## Option C: Rating as Badge

Replace the stars row with a compact badge showing the rating number and a single star icon in the top-right corner of the card header.

```text
┌──────────────────────────────────┐
│ [Logo]  Company Name     [4.0 ★] │
│         Category                 │
```

### Changes

**File: `src/components/CompanyCard.tsx`**
- Remove the 5 individual `Star` icons and the `/5` text
- Replace with a `Badge` showing `{overallRating} ★` plus trend icon
- Badge styled with `variant="secondary"` and clickable (triggers `onReview`)
- Keep the existing `flex items-start justify-between` layout — badge sits on the right side
- Remove `TrendingUp`/`TrendingDown` as separate elements; optionally include a small trend indicator inside or next to the badge

