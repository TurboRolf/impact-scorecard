import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useFollowerCount = (userId?: string) => {
  return useQuery({
    queryKey: ["followerCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });
};

export const useFollowingCount = (userId?: string) => {
  return useQuery({
    queryKey: ["followingCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });
};

export const usePostsCount = (userId?: string) => {
  return useQuery({
    queryKey: ["postsCount", userId],
    queryFn: async () => {
      if (!userId) return 0;
      
      const { count, error } = await supabase
        .from("posts")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId);
      
      if (error) throw error;
      return count || 0;
    },
    enabled: !!userId
  });
};

export const useFollowers = (userId?: string) => {
  return useQuery({
    queryKey: ["followers", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("follows")
        .select(`
          follower_id,
          created_at
        `)
        .eq("following_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get profile info for each follower
      const followerIds = data.map(f => f.follower_id);
      if (followerIds.length === 0) return [];
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", followerIds);
      
      if (profilesError) throw profilesError;
      
      return profiles || [];
    },
    enabled: !!userId
  });
};

export const useFollowing = (userId?: string) => {
  return useQuery({
    queryKey: ["following", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("follows")
        .select(`
          following_id,
          created_at
        `)
        .eq("follower_id", userId)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      // Get profile info for each following
      const followingIds = data.map(f => f.following_id);
      if (followingIds.length === 0) return [];
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", followingIds);
      
      if (profilesError) throw profilesError;
      
      return profiles || [];
    },
    enabled: !!userId
  });
};
