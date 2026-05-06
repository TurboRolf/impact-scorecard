import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export const useUserRoles = () => {
  const { user } = useAuth();
  const query = useQuery({
    queryKey: ["user_roles", user?.id],
    enabled: !!user?.id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((r) => r.role as string);
    },
  });
  const roles = query.data ?? [];
  return {
    roles,
    isAdmin: roles.includes("admin"),
    isModerator: roles.includes("moderator"),
    isLoading: query.isLoading,
  };
};