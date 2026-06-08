
ALTER TABLE public.posts DROP CONSTRAINT posts_user_id_fkey,
  ADD CONSTRAINT posts_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.post_comments DROP CONSTRAINT post_comments_user_id_fkey,
  ADD CONSTRAINT post_comments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;

ALTER TABLE public.boycotts DROP CONSTRAINT boycotts_organizer_id_fkey,
  ADD CONSTRAINT boycotts_organizer_id_fkey FOREIGN KEY (organizer_id) REFERENCES auth.users(id) ON DELETE CASCADE;
