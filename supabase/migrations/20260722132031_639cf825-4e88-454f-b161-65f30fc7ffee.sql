
DELETE FROM public.company_reviews r
WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = r.user_id);

ALTER TABLE public.company_reviews
  ADD CONSTRAINT company_reviews_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;
