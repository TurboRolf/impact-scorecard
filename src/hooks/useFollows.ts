import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Returns list of user IDs the current user is following (accepted only)
export const useFollows = (userId?: string) => {
  return useQuery({
    queryKey: ["follows", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("follows")
        .select("following_id")
        .eq("follower_id", userId)
        .eq("status", "accepted");
      
      if (error) throw error;
      return data.map(follow => follow.following_id);
    },
    enabled: !!userId
  });
};

// Returns the follow status for a specific user: null | 'pending' | 'accepted'
export const useFollowStatus = (currentUserId?: string, targetUserId?: string) => {
  return useQuery({
    queryKey: ["followStatus", currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId) return null;
      
      const { data, error } = await supabase
        .from("follows")
        .select("status")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .maybeSingle();
      
      if (error) throw error;
      return data?.status as string | null;
    },
    enabled: !!currentUserId && !!targetUserId
  });
};

// Returns pending follow requests for the current user (people requesting to follow them)
export const usePendingFollowRequests = (userId?: string) => {
  return useQuery({
    queryKey: ["pendingFollowRequests", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("follows")
        .select("id, follower_id, created_at")
        .eq("following_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      
      if (data.length === 0) return [];
      
      const followerIds = data.map(r => r.follower_id);
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .in("user_id", followerIds);
      
      if (profilesError) throw profilesError;
      
      return data.map(request => ({
        ...request,
        profile: profiles?.find(p => p.user_id === request.follower_id) || null,
      }));
    },
    enabled: !!userId
  });
};

// Check if currentUserId is an accepted follower of targetUserId
export const useIsAcceptedFollower = (currentUserId?: string, targetUserId?: string) => {
  return useQuery({
    queryKey: ["isAcceptedFollower", currentUserId, targetUserId],
    queryFn: async () => {
      if (!currentUserId || !targetUserId) return false;
      if (currentUserId === targetUserId) return true; // own profile
      
      const { data, error } = await supabase
        .from("follows")
        .select("status")
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId)
        .eq("status", "accepted")
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: !!currentUserId && !!targetUserId
  });
};

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ followingId, isPrivate }: { followingId: string; isPrivate: boolean }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to follow users");

      const status = isPrivate ? "pending" : "accepted";

      const { error } = await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: followingId,
          status,
        });

      if (error) throw error;
      return status;
    },
    onSuccess: (status) => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["followStatus"] });
      queryClient.invalidateQueries({ queryKey: ["followerCount"] });
      queryClient.invalidateQueries({ queryKey: ["isAcceptedFollower"] });
      if (status === "pending") {
        toast({
          title: "Följförfrågan skickad",
          description: "Väntar på godkännande från användaren.",
        });
      } else {
        toast({
          title: "Följer användare",
          description: "Du följer nu denna användare.",
        });
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to follow user",
        variant: "destructive",
      });
    },
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (followingId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to unfollow users");

      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", followingId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["follows"] });
      queryClient.invalidateQueries({ queryKey: ["followStatus"] });
      queryClient.invalidateQueries({ queryKey: ["followerCount"] });
      queryClient.invalidateQueries({ queryKey: ["isAcceptedFollower"] });
      toast({
        title: "Avföljd",
        description: "Du följer inte längre denna användare.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to unfollow user",
        variant: "destructive",
      });
    },
  });
};

// Accept a follow request
export const useAcceptFollowRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (followId: string) => {
      const { error } = await supabase
        .from("follows")
        .update({ status: "accepted" })
        .eq("id", followId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingFollowRequests"] });
      queryClient.invalidateQueries({ queryKey: ["followerCount"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["isAcceptedFollower"] });
      toast({ title: "Godkänd", description: "Följförfrågan godkänd." });
    },
  });
};

// Reject a follow request (delete the row)
export const useRejectFollowRequest = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (followerId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in");

      // We need to delete from the perspective of the target user
      // But RLS only allows follower to delete. So we update status to 'rejected' instead.
      // Actually, let's use a different approach: the target user can't delete, only update.
      // So we'll update status to 'rejected' which effectively hides it.
      const { error } = await supabase
        .from("follows")
        .update({ status: "rejected" })
        .eq("id", followerId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pendingFollowRequests"] });
      toast({ title: "Nekad", description: "Följförfrågan nekad." });
    },
  });
};
