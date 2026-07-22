
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS display_name_changed_at TIMESTAMP WITH TIME ZONE;

CREATE OR REPLACE FUNCTION public.enforce_display_name_cooldown()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cooldown_days CONSTANT INTEGER := 7;
  next_allowed TIMESTAMP WITH TIME ZONE;
BEGIN
  IF NEW.display_name IS DISTINCT FROM OLD.display_name THEN
    IF OLD.display_name_changed_at IS NOT NULL
       AND OLD.display_name_changed_at > now() - (cooldown_days || ' days')::interval THEN
      next_allowed := OLD.display_name_changed_at + (cooldown_days || ' days')::interval;
      RAISE EXCEPTION 'You can change your display name again on %', to_char(next_allowed, 'YYYY-MM-DD')
        USING ERRCODE = 'check_violation';
    END IF;
    NEW.display_name_changed_at := now();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS enforce_display_name_cooldown_trigger ON public.profiles;
CREATE TRIGGER enforce_display_name_cooldown_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_display_name_cooldown();

-- Ensure username cooldown trigger is attached (function already exists)
DROP TRIGGER IF EXISTS enforce_username_cooldown_trigger ON public.profiles;
CREATE TRIGGER enforce_username_cooldown_trigger
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.enforce_username_cooldown();
