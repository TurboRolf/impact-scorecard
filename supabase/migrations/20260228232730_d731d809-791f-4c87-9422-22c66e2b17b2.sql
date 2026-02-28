-- Add status column to follows table for follow request system
ALTER TABLE public.follows ADD COLUMN status text NOT NULL DEFAULT 'accepted';

-- Drop existing RLS policies on follows
DROP POLICY IF EXISTS "Users can follow others" ON public.follows;
DROP POLICY IF EXISTS "Users can unfollow others" ON public.follows;
DROP POLICY IF EXISTS "Users can view all follows" ON public.follows;

-- New policies: everyone can see accepted follows, users can see their own pending
CREATE POLICY "Users can view follows"
ON public.follows FOR SELECT
USING (status = 'accepted' OR follower_id = auth.uid() OR following_id = auth.uid());

-- Users can create follow requests
CREATE POLICY "Users can create follow requests"
ON public.follows FOR INSERT
WITH CHECK (auth.uid() = follower_id);

-- Users can delete their own follows (unfollow or cancel request)
CREATE POLICY "Users can delete own follows"
ON public.follows FOR DELETE
USING (auth.uid() = follower_id);

-- Target user can update follow status (accept/reject requests)
CREATE POLICY "Users can update follow requests to them"
ON public.follows FOR UPDATE
USING (auth.uid() = following_id);