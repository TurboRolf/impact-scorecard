
DROP POLICY IF EXISTS "Posts are viewable by everyone" ON public.posts;
CREATE POLICY "Posts are viewable by everyone"
ON public.posts
FOR SELECT
USING (
  removed_at IS NULL
  OR auth.uid() = user_id
  OR has_role(auth.uid(), 'admin'::app_role)
);

REVOKE EXECUTE ON FUNCTION public.notify_post_removed() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.enforce_username_cooldown() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_boycott_participants_count() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_comments_count() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_post_likes_count() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated;
