DROP POLICY IF EXISTS "Authenticated users can view profiles" ON public.profiles;
CREATE POLICY "Profiles are viewable by everyone"
ON public.profiles
FOR SELECT
TO anon, authenticated
USING (true);

GRANT SELECT ON public.profiles TO anon;