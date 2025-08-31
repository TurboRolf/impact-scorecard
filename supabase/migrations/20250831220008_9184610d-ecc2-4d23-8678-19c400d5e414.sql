-- Add profile_type to profiles table
ALTER TABLE public.profiles 
ADD COLUMN profile_type TEXT DEFAULT 'user' CHECK (profile_type IN ('user', 'creator'));

-- Update existing profiles to have default type
UPDATE public.profiles 
SET profile_type = 'user' 
WHERE profile_type IS NULL;