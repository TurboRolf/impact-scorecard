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

-- Remove ratings from user_company_stances to keep only stance information
ALTER TABLE public.user_company_stances 
DROP COLUMN IF EXISTS ethics_rating,
DROP COLUMN IF EXISTS environment_rating,
DROP COLUMN IF EXISTS politics_rating,
DROP COLUMN IF EXISTS overall_rating;