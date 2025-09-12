-- Enable invoker's permissions on both views (fixes SECURITY DEFINER issue)
ALTER VIEW IF EXISTS public.company_ratings_view SET (security_invoker = true);
ALTER VIEW IF EXISTS public.following_feed SET (security_invoker = true);