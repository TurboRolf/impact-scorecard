-- Add missing company_category column to user_company_stances table
ALTER TABLE public.user_company_stances 
ADD COLUMN company_category text;