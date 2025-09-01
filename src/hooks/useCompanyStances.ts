import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CompanyStance = 'recommend' | 'neutral' | 'discourage';

export interface CompanyStanceData {
  id: string;
  user_id: string;
  company_id: string;
  company_name: string;
  company_category: string | null;
  stance: CompanyStance;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompanyData {
  id: string;
  name: string;
  category: string;
  description: string | null;
  logo_url: string | null;
  website_url: string | null;
  avg_overall_rating: number | null;
  avg_ethics_rating: number | null;
  avg_environment_rating: number | null;
  avg_politics_rating: number | null;
  recommend_count: number;
  neutral_count: number;
  discourage_count: number;
  active_boycotts_count: number;
  total_ratings: number;
}

export const useCompanies = () => {
  return useQuery({
    queryKey: ["companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_ratings_view")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as CompanyData[];
    }
  });
};

export const useUserStances = (userId?: string) => {
  return useQuery({
    queryKey: ["user-stances", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("user_company_stances")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data as CompanyStanceData[];
    },
    enabled: !!userId
  });
};

export const useCreateOrUpdateStance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (stanceData: {
      company_name: string;
      company_category?: string;
      stance: CompanyStance;
      notes?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to rate companies");

      // First, find the company by name to get its ID
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("name", stanceData.company_name)
        .single();

      if (companyError) throw new Error(`Company not found: ${stanceData.company_name}`);

      const { data, error } = await supabase
        .from("user_company_stances")
        .upsert({
          user_id: user.id,
          company_id: company.id,
          company_name: stanceData.company_name,
          company_category: stanceData.company_category,
          stance: stanceData.stance,
          notes: stanceData.notes,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stances"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Stance updated",
        description: "Your company stance has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update stance",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteStance = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (stanceId: string) => {
      const { error } = await supabase
        .from("user_company_stances")
        .delete()
        .eq("id", stanceId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-stances"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Stance removed",
        description: "Your company stance has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to remove stance",
        variant: "destructive",
      });
    },
  });
};