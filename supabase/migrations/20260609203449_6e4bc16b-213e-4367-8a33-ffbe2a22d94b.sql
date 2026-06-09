ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS image_urls text[] NOT NULL DEFAULT '{}'::text[];

-- Backfill from legacy image_url for existing posts
UPDATE public.posts
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL
  AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

-- Enforce max 4 images per post
ALTER TABLE public.posts DROP CONSTRAINT IF EXISTS posts_image_urls_max_4;
ALTER TABLE public.posts
  ADD CONSTRAINT posts_image_urls_max_4
  CHECK (array_length(image_urls, 1) IS NULL OR array_length(image_urls, 1) <= 4);