UPDATE public.companies
SET logo_url = 'https://www.google.com/s2/favicons?domain=' || replace(logo_url, 'https://logo.clearbit.com/', '') || '&sz=128'
WHERE logo_url LIKE 'https://logo.clearbit.com/%';