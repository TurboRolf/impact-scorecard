import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// ── Likes ──

export const usePostLikes = (userId?: string) => {
  return useQuery({
    queryKey: ["post-likes", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId);
      if (error) throw error;
      return data.map((l) => l.post_id);
    },
    enabled: !!userId,
  });
};

export const useToggleLike = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      if (liked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: user.id });
        if (error) throw error;
      }
    },
    onMutate: async ({ postId, liked }) => {
      await queryClient.cancelQueries({ queryKey: ["post-likes"] });
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousLikes = queryClient.getQueryData<string[]>(["post-likes"]);
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update likes list
      queryClient.setQueryData<string[]>(["post-likes"], (old) => {
        if (!old) return liked ? [] : [postId];
        return liked ? old.filter((id) => id !== postId) : [...old, postId];
      });

      return { previousLikes, previousPosts };
    },
    onError: (error: Error, _variables, context) => {
      // Rollback on error
      if (context?.previousLikes) {
        queryClient.setQueryData(["post-likes"], context.previousLikes);
      }
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["post-likes"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
};

// ── Comments ──

export interface PostComment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
  };
}

export const usePostComments = (postId?: string) => {
  return useQuery({
    queryKey: ["post-comments", postId],
    queryFn: async () => {
      if (!postId) return [];
      const { data, error } = await supabase
        .from("post_comments")
        .select("*, profiles(display_name, username)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data as unknown as PostComment[];
    },
    enabled: !!postId,
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      const { error } = await supabase
        .from("post_comments")
        .insert({ post_id: postId, user_id: user.id, content });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["post-comments"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });
};
