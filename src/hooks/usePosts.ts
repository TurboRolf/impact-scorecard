import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface PostData {
  id: string;
  user_id: string;
  content: string;
  company_name?: string;
  company_category?: string;
  is_boycott: boolean;
  likes_count: number;
  comments_count: number;
  created_at: string;
  updated_at: string;
  profiles?: {
    display_name: string | null;
    username: string | null;
    profile_type: string | null;
  };
}

export interface CreatePostData {
  content: string;
  company_name?: string;
  company_category?: string;
  company_rating?: number;
  is_boycott?: boolean;
}

export const usePosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select(`
          *,
          profiles (
            display_name,
            username,
            profile_type
          )
        `)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as PostData[];
    }
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postData: CreatePostData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to create posts");

      const { data, error } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          content: postData.content,
          company_name: postData.company_name,
          company_category: postData.company_category,
          company_rating: postData.company_rating,
          is_boycott: postData.is_boycott || false,
        })
        .select(`
          *,
          profiles (
            display_name,
            username,
            profile_type
          )
        `)
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post created",
        description: "Your post has been shared successfully!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create post",
        variant: "destructive",
      });
    },
  });
};

export const useDeletePost = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (postId: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast({
        title: "Post deleted",
        description: "Your post has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete post",
        variant: "destructive",
      });
    },
  });
};