-- Create categories table for organizing boycotts
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT 'hsl(var(--primary))',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create boycotts table
CREATE TABLE public.boycotts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  company TEXT NOT NULL,
  subject TEXT NOT NULL, -- The main subject/topic to prevent duplicates
  category_id UUID REFERENCES public.categories(id) NOT NULL,
  organizer_id UUID REFERENCES auth.users(id) NOT NULL,
  participants_count INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'successful', 'ended')),
  impact TEXT DEFAULT 'medium' CHECK (impact IN ('low', 'medium', 'high', 'very-high')),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create unique constraint to prevent duplicate subjects
CREATE UNIQUE INDEX unique_active_boycott_subject ON public.boycotts (lower(subject)) 
WHERE status = 'active';

-- Create table for tracking user participation in boycotts
CREATE TABLE public.boycott_participants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  boycott_id UUID REFERENCES public.boycotts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(boycott_id, user_id)
);

-- Enable RLS
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boycotts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boycott_participants ENABLE ROW LEVEL SECURITY;

-- Categories policies (public read, authenticated write)
CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create categories" 
ON public.categories 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Boycotts policies
CREATE POLICY "Boycotts are viewable by everyone" 
ON public.boycotts 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create boycotts" 
ON public.boycotts 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = organizer_id);

CREATE POLICY "Organizers can update their boycotts" 
ON public.boycotts 
FOR UPDATE 
USING (auth.uid() = organizer_id);

-- Boycott participants policies
CREATE POLICY "Participants are viewable by everyone" 
ON public.boycott_participants 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can join boycotts" 
ON public.boycott_participants 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave boycotts they joined" 
ON public.boycott_participants 
FOR DELETE 
USING (auth.uid() = user_id);

-- Insert default categories
INSERT INTO public.categories (name, description, color) VALUES
('Environment', 'Environmental protection and climate action', 'hsl(142, 71%, 45%)'),
('Labor Rights', 'Workers rights and fair labor practices', 'hsl(210, 100%, 56%)'),
('Human Rights', 'Civil liberties and human dignity', 'hsl(295, 84%, 69%)'),
('Privacy Rights', 'Data protection and digital privacy', 'hsl(250, 84%, 54%)'),
('Healthcare Access', 'Medical care and pharmaceutical ethics', 'hsl(0, 84%, 60%)'),
('Animal Rights', 'Animal welfare and ethical treatment', 'hsl(142, 71%, 45%)'),
('Consumer Rights', 'Fair pricing and product safety', 'hsl(250, 84%, 54%)'),
('Corporate Ethics', 'Business accountability and transparency', 'hsl(210, 100%, 56%)');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_categories_updated_at
BEFORE UPDATE ON public.categories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_boycotts_updated_at
BEFORE UPDATE ON public.boycotts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to update participant count
CREATE OR REPLACE FUNCTION public.update_boycott_participants_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.boycotts 
    SET participants_count = participants_count + 1 
    WHERE id = NEW.boycott_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.boycotts 
    SET participants_count = participants_count - 1 
    WHERE id = OLD.boycott_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update participant counts
CREATE TRIGGER update_boycott_participants_count_trigger
AFTER INSERT OR DELETE ON public.boycott_participants
FOR EACH ROW
EXECUTE FUNCTION public.update_boycott_participants_count();