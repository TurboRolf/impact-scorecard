-- Step 1: Drop the existing view
DROP VIEW IF EXISTS public.company_ratings_view;

-- Step 2: Add country column
ALTER TABLE public.companies ADD COLUMN country text DEFAULT NULL;

-- Step 3: Recreate view with country
CREATE VIEW public.company_ratings_view WITH (security_invoker=on) AS
SELECT c.id,
    c.name,
    c.category,
    c.description,
    c.website_url,
    c.logo_url,
    c.country,
    COALESCE(stance_counts.recommend_count, 0::bigint) AS recommend_count,
    COALESCE(stance_counts.neutral_count, 0::bigint) AS neutral_count,
    COALESCE(stance_counts.discourage_count, 0::bigint) AS discourage_count,
    COALESCE(review_stats.avg_overall_rating, 0::numeric) AS avg_overall_rating,
    COALESCE(review_stats.avg_ethics_rating, 0::numeric) AS avg_ethics_rating,
    COALESCE(review_stats.avg_environment_rating, 0::numeric) AS avg_environment_rating,
    COALESCE(review_stats.avg_politics_rating, 0::numeric) AS avg_politics_rating,
    COALESCE(review_stats.total_ratings, 0::bigint) AS total_ratings,
    COALESCE(boycott_counts.active_boycotts_count, 0::bigint) AS active_boycotts_count
   FROM companies c
     LEFT JOIN ( SELECT user_company_stances.company_id,
            count(CASE WHEN user_company_stances.stance = 'recommend' THEN 1 ELSE NULL END) AS recommend_count,
            count(CASE WHEN user_company_stances.stance = 'neutral' THEN 1 ELSE NULL END) AS neutral_count,
            count(CASE WHEN user_company_stances.stance = 'discourage' THEN 1 ELSE NULL END) AS discourage_count
           FROM user_company_stances
          GROUP BY user_company_stances.company_id) stance_counts ON c.id = stance_counts.company_id
     LEFT JOIN ( SELECT company_reviews.company_id,
            avg(CASE WHEN company_reviews.category = 'overall' THEN company_reviews.rating ELSE NULL END) AS avg_overall_rating,
            avg(CASE WHEN company_reviews.category = 'ethics' THEN company_reviews.rating ELSE NULL END) AS avg_ethics_rating,
            avg(CASE WHEN company_reviews.category = 'environment' THEN company_reviews.rating ELSE NULL END) AS avg_environment_rating,
            avg(CASE WHEN company_reviews.category = 'politics' THEN company_reviews.rating ELSE NULL END) AS avg_politics_rating,
            count(*) AS total_ratings
           FROM company_reviews
          GROUP BY company_reviews.company_id) review_stats ON c.id = review_stats.company_id
     LEFT JOIN ( SELECT boycotts.company,
            count(*) AS active_boycotts_count
           FROM boycotts
          WHERE boycotts.status = 'active'
          GROUP BY boycotts.company) boycott_counts ON c.name = boycott_counts.company;