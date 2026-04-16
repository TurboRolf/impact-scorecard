-- Remove Göteborgs-Posten (part of Stampen Media)
DELETE FROM public.user_company_stances WHERE company_id IN (SELECT id FROM public.companies WHERE name = 'Göteborgs-Posten');
DELETE FROM public.company_reviews WHERE company_id IN (SELECT id FROM public.companies WHERE name = 'Göteborgs-Posten');
DELETE FROM public.companies WHERE name = 'Göteborgs-Posten';

-- Upgrade all logos from small Google favicons (sz=128) to high-quality Logo.dev / Clearbit logos
-- Extract domain from current logo_url and rebuild as Logo.dev URL (no auth needed for basic logos via img.logo.dev fallback)
-- Use Logo.clearbit.com which returns proper square brand logos
UPDATE public.companies
SET logo_url = 'https://logo.clearbit.com/' || substring(logo_url FROM 'domain=([^&]+)')
WHERE logo_url LIKE 'https://www.google.com/s2/favicons%';