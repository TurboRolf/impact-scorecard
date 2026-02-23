-- Replace the overly permissive SELECT policy with one that only allows users to see their own participation
DROP POLICY IF EXISTS "Participants are viewable by everyone" ON public.boycott_participants;

CREATE POLICY "Users can view their own participation"
  ON public.boycott_participants
  FOR SELECT
  USING (auth.uid() = user_id);