
UPDATE public.companies SET category = 'Media & Entertainment' WHERE category IN ('Media', 'Entertainment');
UPDATE public.companies SET category = 'Food & Retail' WHERE category IN ('Food & Beverage', 'Retail');
UPDATE public.companies SET category = 'Finance' WHERE category = 'Financial';
UPDATE public.companies SET category = 'Industry' WHERE category IN ('Energy', 'Automotive');

UPDATE public.company_reviews SET category = 'Media & Entertainment' WHERE category IN ('Media', 'Entertainment');
UPDATE public.company_reviews SET category = 'Food & Retail' WHERE category IN ('Food & Beverage', 'Retail');
UPDATE public.company_reviews SET category = 'Finance' WHERE category = 'Financial';
UPDATE public.company_reviews SET category = 'Industry' WHERE category IN ('Energy', 'Automotive');

UPDATE public.user_company_stances SET company_category = 'Media & Entertainment' WHERE company_category IN ('Media', 'Entertainment');
UPDATE public.user_company_stances SET company_category = 'Food & Retail' WHERE company_category IN ('Food & Beverage', 'Retail');
UPDATE public.user_company_stances SET company_category = 'Finance' WHERE company_category = 'Financial';
UPDATE public.user_company_stances SET company_category = 'Industry' WHERE company_category IN ('Energy', 'Automotive');

UPDATE public.posts SET company_category = 'Media & Entertainment' WHERE company_category IN ('Media', 'Entertainment');
UPDATE public.posts SET company_category = 'Food & Retail' WHERE company_category IN ('Food & Beverage', 'Retail');
UPDATE public.posts SET company_category = 'Finance' WHERE company_category = 'Financial';
UPDATE public.posts SET company_category = 'Industry' WHERE company_category IN ('Energy', 'Automotive');
