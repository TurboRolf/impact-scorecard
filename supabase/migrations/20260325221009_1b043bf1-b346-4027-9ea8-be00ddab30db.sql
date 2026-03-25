-- Fix 1: Restrict user_company_stances to own data only
DROP POLICY IF EXISTS "Authenticated users can view stances" ON public.user_company_stances;

CREATE POLICY "Users can view own stances"
ON public.user_company_stances
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Fix 2: Add security_invoker to following_feed view
ALTER VIEW public.following_feed SET (security_invoker = true);