
-- 1. notifications: admin insert -> authenticated only
DROP POLICY IF EXISTS "Admins can insert notifications" ON public.notifications;
CREATE POLICY "Admins can insert notifications"
  ON public.notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. post_reports: admin-gated policies -> authenticated only
DROP POLICY IF EXISTS "Admins can delete reports" ON public.post_reports;
CREATE POLICY "Admins can delete reports"
  ON public.post_reports
  FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update reports" ON public.post_reports;
CREATE POLICY "Admins can update reports"
  ON public.post_reports
  FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Reporters and admins can view reports" ON public.post_reports;
CREATE POLICY "Reporters and admins can view reports"
  ON public.post_reports
  FOR SELECT
  TO authenticated
  USING (auth.uid() = reporter_id OR public.has_role(auth.uid(), 'admin'));

-- 3. company_reviews: write policies -> authenticated only
DROP POLICY IF EXISTS "Users can insert their own reviews" ON public.company_reviews;
CREATE POLICY "Users can insert their own reviews"
  ON public.company_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own reviews" ON public.company_reviews;
CREATE POLICY "Users can update their own reviews"
  ON public.company_reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own reviews" ON public.company_reviews;
CREATE POLICY "Users can delete their own reviews"
  ON public.company_reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 4. follows: write policies -> authenticated only
DROP POLICY IF EXISTS "Users can insert their own follows" ON public.follows;
CREATE POLICY "Users can insert their own follows"
  ON public.follows
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can delete their own follows" ON public.follows;
CREATE POLICY "Users can delete their own follows"
  ON public.follows
  FOR DELETE
  TO authenticated
  USING (auth.uid() = follower_id);

DROP POLICY IF EXISTS "Users can update follows targeting them" ON public.follows;
CREATE POLICY "Users can update follows targeting them"
  ON public.follows
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = following_id OR auth.uid() = follower_id)
  WITH CHECK (auth.uid() = following_id OR auth.uid() = follower_id);

-- 5. profiles: write policies -> authenticated only
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. user_company_stances: write policies -> authenticated only
DROP POLICY IF EXISTS "Users can insert their own stances" ON public.user_company_stances;
CREATE POLICY "Users can insert their own stances"
  ON public.user_company_stances
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own stances" ON public.user_company_stances;
CREATE POLICY "Users can update their own stances"
  ON public.user_company_stances
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own stances" ON public.user_company_stances;
CREATE POLICY "Users can delete their own stances"
  ON public.user_company_stances
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. post-images storage: add UPDATE policy scoped to owner folder
DROP POLICY IF EXISTS "Users can update their own post images" ON storage.objects;
CREATE POLICY "Users can update their own post images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'post-images'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- 8. realtime.messages: restrict notification channel subscriptions to the recipient
ALTER TABLE realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can subscribe to their own notification channel" ON realtime.messages;
CREATE POLICY "Users can subscribe to their own notification channel"
  ON realtime.messages
  FOR SELECT
  TO authenticated
  USING (
    realtime.topic() = 'notifications:' || auth.uid()::text
  );
