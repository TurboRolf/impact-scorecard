
-- 1. Prevent organizers from tampering with participants_count
REVOKE UPDATE (participants_count) ON public.boycotts FROM authenticated;
REVOKE UPDATE (participants_count) ON public.boycotts FROM anon;

-- 2. Restrict posts INSERT policy to authenticated role
DROP POLICY IF EXISTS "Authenticated users can create posts" ON public.posts;
CREATE POLICY "Authenticated users can create posts"
ON public.posts FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

-- 3. Restrict posts UPDATE/DELETE policies to authenticated
DROP POLICY IF EXISTS "Admins can update posts" ON public.posts;
CREATE POLICY "Admins can update posts"
ON public.posts FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can update their own posts" ON public.posts;
CREATE POLICY "Users can update their own posts"
ON public.posts FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users or admins can delete posts" ON public.posts;
CREATE POLICY "Users or admins can delete posts"
ON public.posts FOR DELETE TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

-- 4. Restrict user_roles admin policies to authenticated role
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Admins can delete roles" ON public.user_roles;
CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT TO authenticated
USING ((auth.uid() = user_id) OR has_role(auth.uid(), 'admin'::app_role));

-- 5. Tighten other auth-only policies that were on public role
DROP POLICY IF EXISTS "Users can leave boycotts they joined" ON public.boycott_participants;
CREATE POLICY "Users can leave boycotts they joined"
ON public.boycott_participants FOR DELETE TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can view their own participation" ON public.boycott_participants;
CREATE POLICY "Users can view their own participation"
ON public.boycott_participants FOR SELECT TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Organizers can update their boycotts" ON public.boycotts;
CREATE POLICY "Organizers can update their boycotts"
ON public.boycotts FOR UPDATE TO authenticated
USING (auth.uid() = organizer_id);
