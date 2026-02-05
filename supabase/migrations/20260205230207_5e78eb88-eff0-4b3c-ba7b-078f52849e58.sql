-- Remove the overly permissive INSERT policy on categories
-- Categories should be managed through migrations, not user creation
DROP POLICY IF EXISTS "Authenticated users can create categories" ON public.categories;