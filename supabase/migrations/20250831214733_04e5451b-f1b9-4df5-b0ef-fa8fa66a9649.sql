-- First, drop the view that depends on the rating columns
DROP VIEW IF EXISTS public.company_ratings_view;

-- Create table for company reviews (separate from stances)
CREATE TABLE public.company_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  company_id UUID NOT NULL,
  company_name TEXT NOT NULL,
  category TEXT NOT NULL, -- 'ethics', 'environment', 'politics', 'overall', etc.
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id, category) -- One review per user per company per category
);

-- Enable RLS
ALTER TABLE public.company_reviews ENABLE ROW LEVEL SECURITY;

-- Create policies for company reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.company_reviews 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own reviews" 
ON public.company_reviews 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
ON public.company_reviews 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
ON public.company_reviews 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_company_reviews_updated_at
BEFORE UPDATE ON public.company_reviews
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add company_name column to user_company_stances (for easier querying)
ALTER TABLE public.user_company_stances 
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Remove ratings from user_company_stances to keep only stance information
ALTER TABLE public.user_company_stances 
DROP COLUMN IF EXISTS ethics_rating,
DROP COLUMN IF EXISTS environment_rating,
DROP COLUMN IF EXISTS politics_rating,
DROP COLUMN IF EXISTS overall_rating;

-- Recreate the company_ratings_view with new structure
CREATE VIEW public.company_ratings_view AS
SELECT 
  c.id,
  c.name,
  c.category,
  c.description,
  c.logo_url,
  c.website_url,
  
  -- Stance counts from user_company_stances
  COUNT(CASE WHEN ucs.stance = 'recommend' THEN 1 END)::bigint as recommend_count,
  COUNT(CASE WHEN ucs.stance = 'neutral' THEN 1 END)::bigint as neutral_count,
  COUNT(CASE WHEN ucs.stance = 'discourage' THEN 1 END)::bigint as discourage_count,
  
  -- Average ratings from company_reviews
  ROUND(AVG(CASE WHEN cr.category = 'overall' THEN cr.rating END), 2) as avg_overall_rating,
  ROUND(AVG(CASE WHEN cr.category = 'ethics' THEN cr.rating END), 2) as avg_ethics_rating,
  ROUND(AVG(CASE WHEN cr.category = 'environment' THEN cr.rating END), 2) as avg_environment_rating,
  ROUND(AVG(CASE WHEN cr.category = 'politics' THEN cr.rating END), 2) as avg_politics_rating,
  
  -- Total counts
  COUNT(DISTINCT cr.user_id)::bigint as total_ratings,
  
  -- Active boycotts count (if needed)
  COALESCE((
    SELECT COUNT(*)::bigint 
    FROM public.boycotts b 
    WHERE LOWER(b.company) = LOWER(c.name) 
    AND b.status = 'active'
  ), 0) as active_boycotts_count

FROM public.companies c
LEFT JOIN public.user_company_stances ucs ON ucs.company_name = c.name
LEFT JOIN public.company_reviews cr ON cr.company_name = c.name
GROUP BY c.id, c.name, c.category, c.description, c.logo_url, c.website_url;