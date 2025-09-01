-- Fix the company_ratings_view to not be a security definer view
DROP VIEW IF EXISTS company_ratings_view;

CREATE VIEW company_ratings_view AS
SELECT 
  c.id,
  c.name,
  c.category,
  c.description,
  c.website_url,
  c.logo_url,
  COALESCE(stance_counts.recommend_count, 0) as recommend_count,
  COALESCE(stance_counts.neutral_count, 0) as neutral_count,
  COALESCE(stance_counts.discourage_count, 0) as discourage_count,
  COALESCE(review_stats.avg_overall_rating, 0) as avg_overall_rating,
  COALESCE(review_stats.avg_ethics_rating, 0) as avg_ethics_rating,
  COALESCE(review_stats.avg_environment_rating, 0) as avg_environment_rating,
  COALESCE(review_stats.avg_politics_rating, 0) as avg_politics_rating,
  COALESCE(review_stats.total_ratings, 0) as total_ratings,
  COALESCE(boycott_counts.active_boycotts_count, 0) as active_boycotts_count
FROM companies c
LEFT JOIN (
  SELECT 
    company_id,
    COUNT(CASE WHEN stance = 'recommend' THEN 1 END) as recommend_count,
    COUNT(CASE WHEN stance = 'neutral' THEN 1 END) as neutral_count,
    COUNT(CASE WHEN stance = 'discourage' THEN 1 END) as discourage_count
  FROM user_company_stances 
  GROUP BY company_id
) stance_counts ON c.id = stance_counts.company_id
LEFT JOIN (
  SELECT 
    company_id,
    AVG(CASE WHEN category = 'overall' THEN rating END) as avg_overall_rating,
    AVG(CASE WHEN category = 'ethics' THEN rating END) as avg_ethics_rating,
    AVG(CASE WHEN category = 'environment' THEN rating END) as avg_environment_rating,
    AVG(CASE WHEN category = 'politics' THEN rating END) as avg_politics_rating,
    COUNT(*) as total_ratings
  FROM company_reviews 
  GROUP BY company_id
) review_stats ON c.id = review_stats.company_id
LEFT JOIN (
  SELECT 
    company,
    COUNT(*) as active_boycotts_count
  FROM boycotts 
  WHERE status = 'active'
  GROUP BY company
) boycott_counts ON c.name = boycott_counts.company;