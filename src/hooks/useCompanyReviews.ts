import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type ReviewCategory = 'ethics' | 'environment' | 'politics' | 'overall';

export interface CompanyReviewData {
  id: string;
  user_id: string;
  company_id: string;
  company_name: string;
  category: ReviewCategory;
  rating: number;
  review_text: string | null;
  created_at: string;
  updated_at: string;
}

export const useUserReviews = (userId?: string) => {
  return useQuery({
    queryKey: ["user-reviews", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("company_reviews")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });
      
      if (error) throw error;
      return data as CompanyReviewData[];
    },
    enabled: !!userId
  });
};

export const useCompanyReviews = (companyName: string) => {
  return useQuery({
    queryKey: ["company-reviews", companyName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("company_reviews")
        .select("*")
        .eq("company_name", companyName)
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      return data as CompanyReviewData[];
    },
    enabled: !!companyName
  });
};

export const useCreateOrUpdateReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewData: {
      company_name: string;
      category: ReviewCategory;
      rating: number;
      review_text?: string;
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Must be logged in to create reviews");

      // First, find the company by name to get its ID
      const { data: company, error: companyError } = await supabase
        .from("companies")
        .select("id")
        .eq("name", reviewData.company_name)
        .single();

      if (companyError) throw new Error(`Company not found: ${reviewData.company_name}`);

      const { data, error } = await supabase
        .from("company_reviews")
        .upsert({
          user_id: user.id,
          company_id: company.id,
          company_name: reviewData.company_name,
          category: reviewData.category,
          rating: reviewData.rating,
          review_text: reviewData.review_text,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["company-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Review saved",
        description: "Your company review has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save review",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (reviewId: string) => {
      const { error } = await supabase
        .from("company_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["company-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      toast({
        title: "Review deleted",
        description: "Your review has been removed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    },
  });
};