UPDATE public.companies
SET logo_url = 'https://logo.clearbit.com/' || regexp_replace(logo_url, '^.*domain=([^&]+).*$', '\1')
WHERE logo_url LIKE '%google.com/s2/favicons%';