-- Drop the existing view and recreate without SECURITY DEFINER
DROP VIEW IF EXISTS public.following_feed;

-- Create view for getting following feed posts (without SECURITY DEFINER)
CREATE OR REPLACE VIEW public.following_feed AS
SELECT p.*
FROM public.posts p
INNER JOIN public.follows f ON p.user_id = f.following_id
ORDER BY p.created_at DESC;