
DROP POLICY IF EXISTS "Users can create their own reviews" ON public.company_reviews;
DROP POLICY IF EXISTS "Users can create their own stances" ON public.user_company_stances;
DROP POLICY IF EXISTS "Users can create follow requests" ON public.follows;
DROP POLICY IF EXISTS "Users can delete own follows" ON public.follows;
DROP POLICY IF EXISTS "Users can update follow requests to them" ON public.follows;

DROP POLICY IF EXISTS "Users view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users delete own notifications" ON public.notifications;

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view follows" ON public.follows;
CREATE POLICY "Users can view follows"
  ON public.follows FOR SELECT TO authenticated
  USING (true);

ALTER PUBLICATION supabase_realtime DROP TABLE public.follows;

ALTER TABLE public.posts
  ADD CONSTRAINT posts_content_length CHECK (content IS NULL OR char_length(content) <= 5000);
ALTER TABLE public.boycotts
  ADD CONSTRAINT boycotts_title_length CHECK (char_length(title) <= 200),
  ADD CONSTRAINT boycotts_description_length CHECK (description IS NULL OR char_length(description) <= 5000),
  ADD CONSTRAINT boycotts_condition_length CHECK (condition IS NULL OR char_length(condition) <= 1000);
ALTER TABLE public.post_comments
  ADD CONSTRAINT post_comments_content_length CHECK (char_length(content) <= 1000);
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_username_length CHECK (char_length(username) <= 30),
  ADD CONSTRAINT profiles_display_name_length CHECK (display_name IS NULL OR char_length(display_name) <= 60),
  ADD CONSTRAINT profiles_bio_length CHECK (bio IS NULL OR char_length(bio) <= 500);

DROP POLICY IF EXISTS "Authenticated users can upload their own post images" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own post images" ON storage.objects;

CREATE POLICY "Authenticated users can upload their own post images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp','gif'])
  );

CREATE POLICY "Users can update their own post images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  )
  WITH CHECK (
    bucket_id = 'post-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
    AND lower(storage.extension(name)) = ANY (ARRAY['jpg','jpeg','png','webp','gif'])
  );
