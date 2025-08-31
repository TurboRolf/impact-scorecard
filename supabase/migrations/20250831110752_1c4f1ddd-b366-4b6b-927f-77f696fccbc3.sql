-- Create companies table for storing company information
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user company stances table
CREATE TABLE public.user_company_stances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  stance TEXT NOT NULL CHECK (stance IN ('recommend', 'neutral', 'discourage')),
  ethics_rating INTEGER CHECK (ethics_rating >= 1 AND ethics_rating <= 5),
  environment_rating INTEGER CHECK (environment_rating >= 1 AND environment_rating <= 5),
  politics_rating INTEGER CHECK (politics_rating >= 1 AND politics_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_id)
);

-- Create company ratings view for aggregated data
CREATE VIEW public.company_ratings_view AS
SELECT 
  c.id,
  c.name,
  c.category,
  c.description,
  c.logo_url,
  c.website_url,
  COUNT(ucs.id) as total_ratings,
  ROUND(AVG(ucs.overall_rating::numeric), 1) as avg_overall_rating,
  ROUND(AVG(ucs.ethics_rating::numeric), 1) as avg_ethics_rating,
  ROUND(AVG(ucs.environment_rating::numeric), 1) as avg_environment_rating,
  ROUND(AVG(ucs.politics_rating::numeric), 1) as avg_politics_rating,
  COUNT(CASE WHEN ucs.stance = 'recommend' THEN 1 END) as recommend_count,
  COUNT(CASE WHEN ucs.stance = 'neutral' THEN 1 END) as neutral_count,
  COUNT(CASE WHEN ucs.stance = 'discourage' THEN 1 END) as discourage_count,
  COUNT(bp.boycott_id) as active_boycotts_count
FROM public.companies c
LEFT JOIN public.user_company_stances ucs ON c.id = ucs.company_id
LEFT JOIN public.boycotts b ON LOWER(c.name) = LOWER(b.company) AND b.status = 'active'
LEFT JOIN public.boycott_participants bp ON b.id = bp.boycott_id
GROUP BY c.id, c.name, c.category, c.description, c.logo_url, c.website_url;

-- Enable RLS on companies table
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

-- Enable RLS on user_company_stances table
ALTER TABLE public.user_company_stances ENABLE ROW LEVEL SECURITY;

-- RLS policies for companies table
CREATE POLICY "Companies are viewable by everyone" 
ON public.companies 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create companies" 
ON public.companies 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can update companies" 
ON public.companies 
FOR UPDATE 
USING (auth.uid() IS NOT NULL);

-- RLS policies for user_company_stances table
CREATE POLICY "Stances are viewable by everyone" 
ON public.user_company_stances 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own stances" 
ON public.user_company_stances 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stances" 
ON public.user_company_stances 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own stances" 
ON public.user_company_stances 
FOR DELETE 
USING (auth.uid() = user_id);

-- Add update triggers
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_company_stances_updated_at
BEFORE UPDATE ON public.user_company_stances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert some sample companies
INSERT INTO public.companies (name, category, description, website_url) VALUES
('Apple', 'Technology', 'Tech giant known for premium devices and privacy focus, working on carbon neutrality by 2030.', 'https://apple.com'),
('Amazon', 'Technology', 'E-commerce and cloud computing leader facing criticism for labor practices and tax avoidance.', 'https://amazon.com'),
('Patagonia', 'Fashion', 'Outdoor clothing company committed to environmental activism and sustainable practices.', 'https://patagonia.com'),
('Tesla', 'Automotive', 'Electric vehicle manufacturer leading the transition to sustainable transportation.', 'https://tesla.com'),
('Nestlé', 'Food & Beverage', 'Global food conglomerate facing ongoing criticism for water rights and labor practices.', 'https://nestle.com'),
('Ben & Jerry''s', 'Food & Beverage', 'Ice cream company known for social activism and progressive values.', 'https://benjerry.com');