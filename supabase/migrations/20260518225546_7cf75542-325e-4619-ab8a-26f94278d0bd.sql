
-- Notify on new follow (request or accepted follow)
CREATE OR REPLACE FUNCTION public.notify_follow_inserted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  follower_name TEXT;
BEGIN
  SELECT COALESCE(display_name, username, 'Someone') INTO follower_name
  FROM public.profiles WHERE user_id = NEW.follower_id;

  IF NEW.status = 'pending' THEN
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      NEW.following_id,
      'follow_request',
      'New follow request',
      follower_name || ' wants to follow you.',
      jsonb_build_object('follower_id', NEW.follower_id, 'follow_id', NEW.id)
    );
  ELSIF NEW.status = 'accepted' THEN
    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      NEW.following_id,
      'new_follower',
      'New follower',
      follower_name || ' started following you.',
      jsonb_build_object('follower_id', NEW.follower_id)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_follow_inserted ON public.follows;
CREATE TRIGGER trg_notify_follow_inserted
AFTER INSERT ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.notify_follow_inserted();

-- Notify follower when their request is accepted
CREATE OR REPLACE FUNCTION public.notify_follow_accepted()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_name TEXT;
BEGIN
  IF OLD.status = 'pending' AND NEW.status = 'accepted' THEN
    SELECT COALESCE(display_name, username, 'A user') INTO target_name
    FROM public.profiles WHERE user_id = NEW.following_id;

    INSERT INTO public.notifications (user_id, type, title, body, data)
    VALUES (
      NEW.follower_id,
      'follow_accepted',
      'Follow request accepted',
      target_name || ' accepted your follow request.',
      jsonb_build_object('following_id', NEW.following_id)
    );
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_follow_accepted ON public.follows;
CREATE TRIGGER trg_notify_follow_accepted
AFTER UPDATE ON public.follows
FOR EACH ROW EXECUTE FUNCTION public.notify_follow_accepted();

-- Notify post author on like
CREATE OR REPLACE FUNCTION public.notify_post_liked()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_id UUID;
  liker_name TEXT;
BEGIN
  SELECT user_id INTO author_id FROM public.posts WHERE id = NEW.post_id;
  IF author_id IS NULL OR author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(display_name, username, 'Someone') INTO liker_name
  FROM public.profiles WHERE user_id = NEW.user_id;

  INSERT INTO public.notifications (user_id, type, title, body, data)
  VALUES (
    author_id,
    'post_liked',
    'New like',
    liker_name || ' liked your post.',
    jsonb_build_object('post_id', NEW.post_id, 'liker_id', NEW.user_id)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_post_liked ON public.post_likes;
CREATE TRIGGER trg_notify_post_liked
AFTER INSERT ON public.post_likes
FOR EACH ROW EXECUTE FUNCTION public.notify_post_liked();

-- Notify post author on comment
CREATE OR REPLACE FUNCTION public.notify_post_commented()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  author_id UUID;
  commenter_name TEXT;
BEGIN
  SELECT user_id INTO author_id FROM public.posts WHERE id = NEW.post_id;
  IF author_id IS NULL OR author_id = NEW.user_id THEN
    RETURN NEW;
  END IF;

  SELECT COALESCE(display_name, username, 'Someone') INTO commenter_name
  FROM public.profiles WHERE user_id = NEW.user_id;

  INSERT INTO public.notifications (user_id, type, title, body, data)
  VALUES (
    author_id,
    'post_commented',
    'New comment',
    commenter_name || ' commented on your post.',
    jsonb_build_object('post_id', NEW.post_id, 'commenter_id', NEW.user_id)
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_notify_post_commented ON public.post_comments;
CREATE TRIGGER trg_notify_post_commented
AFTER INSERT ON public.post_comments
FOR EACH ROW EXECUTE FUNCTION public.notify_post_commented();

-- Enable realtime for follows so pending follow request lists update live
ALTER PUBLICATION supabase_realtime ADD TABLE public.follows;
ALTER TABLE public.follows REPLICA IDENTITY FULL;
ALTER TABLE public.notifications REPLICA IDENTITY FULL;
