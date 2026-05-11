ALTER TABLE public.posts
  ADD COLUMN removed_at TIMESTAMP WITH TIME ZONE,
  ADD COLUMN removed_reason TEXT,
  ADD COLUMN removed_by UUID;