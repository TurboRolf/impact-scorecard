
DROP VIEW IF EXISTS public.company_ratings_view;

CREATE VIEW public.company_ratings_view
WITH (security_invoker = true) AS
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
    COALESCE(review_stats.avg_environment_rating, 0::numeric) AS avg_environment_rating,
    COALESCE(review_stats.avg_labor_rating, 0::numeric) AS avg_labor_rating,
    COALESCE(review_stats.avg_ethics_rating, 0::numeric) AS avg_ethics_rating,
    COALESCE(review_stats.avg_politics_rating, 0::numeric) AS avg_politics_rating,
    COALESCE(review_stats.avg_transparency_rating, 0::numeric) AS avg_transparency_rating,
    COALESCE(review_stats.avg_animal_welfare_rating, 0::numeric) AS avg_animal_welfare_rating,
    COALESCE(review_stats.avg_data_privacy_rating, 0::numeric) AS avg_data_privacy_rating,
    COALESCE(review_stats.avg_supply_chain_rating, 0::numeric) AS avg_supply_chain_rating,
    COALESCE(review_stats.avg_overall_rating, 0::numeric) AS avg_overall_rating,
    COALESCE(review_stats.total_ratings, 0::bigint) AS total_ratings,
    COALESCE(boycott_counts.active_boycotts_count, 0::bigint) AS active_boycotts_count
FROM companies c
LEFT JOIN (
    SELECT company_id,
        count(CASE WHEN stance = 'recommend' THEN 1 END) AS recommend_count,
        count(CASE WHEN stance = 'neutral' THEN 1 END) AS neutral_count,
        count(CASE WHEN stance = 'discourage' THEN 1 END) AS discourage_count
    FROM user_company_stances
    GROUP BY company_id
) stance_counts ON c.id = stance_counts.company_id
LEFT JOIN (
    SELECT company_id,
        avg(CASE WHEN category = 'environment' THEN rating END) AS avg_environment_rating,
        avg(CASE WHEN category = 'labor_human_rights' THEN rating END) AS avg_labor_rating,
        avg(CASE WHEN category = 'ethics_integrity' THEN rating END) AS avg_ethics_rating,
        avg(CASE WHEN category = 'politics_lobbying' THEN rating END) AS avg_politics_rating,
        avg(CASE WHEN category = 'transparency' THEN rating END) AS avg_transparency_rating,
        avg(CASE WHEN category = 'animal_welfare' THEN rating END) AS avg_animal_welfare_rating,
        avg(CASE WHEN category = 'data_privacy' THEN rating END) AS avg_data_privacy_rating,
        avg(CASE WHEN category = 'supply_chain' THEN rating END) AS avg_supply_chain_rating,
        avg(rating) AS avg_overall_rating,
        count(*) AS total_ratings
    FROM company_reviews
    GROUP BY company_id
) review_stats ON c.id = review_stats.company_id
LEFT JOIN (
    SELECT company, count(*) AS active_boycotts_count
    FROM boycotts
    WHERE status = 'active'
    GROUP BY company
) boycott_counts ON c.name = boycott_counts.company;
