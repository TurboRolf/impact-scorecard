CREATE OR REPLACE VIEW public.company_reviews_with_author
WITH (security_invoker = true)
AS
SELECT
  cr.id,
  cr.user_id,
  cr.company_id,
  cr.company_name,
  cr.category,
  cr.rating,
  cr.review_text,
  cr.created_at,
  cr.updated_at,
  p.display_name AS author_display_name,
  p.username AS author_username,
  p.avatar_url AS author_avatar_url,
  p.profile_type AS author_profile_type
FROM public.company_reviews cr
LEFT JOIN public.profiles p ON p.user_id = cr.user_id;

GRANT SELECT ON public.company_reviews_with_author TO anon;
GRANT SELECT ON public.company_reviews_with_author TO authenticated;
GRANT ALL ON public.company_reviews_with_author TO service_role;
