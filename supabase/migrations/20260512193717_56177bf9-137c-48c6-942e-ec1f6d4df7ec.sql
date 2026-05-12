-- Notifications table
CREATE TABLE public.notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_notifications_user_created ON public.notifications(user_id, created_at DESC);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE read_at IS NULL;

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own notifications"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users update own notifications"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users delete own notifications"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can insert notifications"
  ON public.notifications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

-- Trigger: notify post author when post is removed
CREATE OR REPLACE FUNCTION public.notify_post_removed()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.removed_at IS NOT NULL AND (OLD.removed_at IS NULL OR OLD.removed_at IS DISTINCT FROM NEW.removed_at) THEN
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      NEW.user_id,
      'post_removed',
      'Your post was removed',
      COALESCE('Reason: ' || NEW.removed_reason, 'Your post was removed for violating community guidelines.'),
      jsonb_build_object('post_id', NEW.id, 'reason', NEW.removed_reason)
    );
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_notify_post_removed
AFTER UPDATE OF removed_at ON public.posts
FOR EACH ROW
EXECUTE FUNCTION public.notify_post_removed();