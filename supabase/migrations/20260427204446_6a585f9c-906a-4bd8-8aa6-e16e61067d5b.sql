-- Track when username was last changed
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS username_changed_at TIMESTAMP WITH TIME ZONE;

-- Enforce 30-day cooldown on username changes via trigger
CREATE OR REPLACE FUNCTION public.enforce_username_cooldown()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cooldown_days CONSTANT INTEGER := 30;
  next_allowed TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Only act when username actually changes
  IF NEW.username IS DISTINCT FROM OLD.username THEN
    IF OLD.username_changed_at IS NOT NULL
       AND OLD.username_changed_at > now() - (cooldown_days || ' days')::interval THEN
      next_allowed := OLD.username_changed_at + (cooldown_days || ' days')::interval;
      RAISE EXCEPTION 'You can change your username again on %', to_char(next_allowed, 'YYYY-MM-DD')
        USING ERRCODE = 'check_violation';
    END IF;
    NEW.username_changed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_username_cooldown_trigger ON public.profiles;
CREATE TRIGGER enforce_username_cooldown_trigger
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.enforce_username_cooldown();