-- Drop the existing overly permissive public SELECT policy
DROP POLICY "Stances are viewable by everyone" ON public.user_company_stances;

-- Create a new policy restricted to authenticated users only
CREATE POLICY "Authenticated users can view stances"
ON public.user_company_stances
FOR SELECT
TO authenticated
USING (true);