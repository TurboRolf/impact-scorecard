-- Create user company stances table
CREATE TABLE public.user_company_stances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL,
  stance TEXT NOT NULL CHECK (stance IN ('recommend', 'neutral', 'discourage')),
  ethics_rating INTEGER CHECK (ethics_rating >= 1 AND ethics_rating <= 5),
  environment_rating INTEGER CHECK (environment_rating >= 1 AND environment_rating <= 5),
  politics_rating INTEGER CHECK (politics_rating >= 1 AND politics_rating <= 5),
  overall_rating INTEGER CHECK (overall_rating >= 1 AND overall_rating <= 5),
  notes TEXT,
  company_name TEXT NOT NULL,
  company_category TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, company_name)
);

-- Enable RLS on user_company_stances table
ALTER TABLE public.user_company_stances ENABLE ROW LEVEL SECURITY;

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

-- Add update trigger
CREATE TRIGGER update_user_company_stances_updated_at
BEFORE UPDATE ON public.user_company_stances
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();