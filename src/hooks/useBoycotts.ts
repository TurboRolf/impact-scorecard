import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Boycott {
  id: string;
  title: string;
  description: string;
  company: string;
  subject: string;
  participants_count: number;
  status: 'active' | 'successful' | 'ended' | 'deactivated';
  impact: 'low' | 'medium' | 'high' | 'very-high';
  start_date: string;
  created_at: string;
  organizer_id: string;
  categories: {
    name: string;
    color: string;
  };
}

export const useBoycotts = (searchTerm = '') => {
  return useQuery({
    queryKey: ['boycotts', searchTerm],
    queryFn: async () => {
      let query = supabase
        .from('boycotts')
        .select(`
          *,
          categories (name, color)
        `)
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,company.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data as Boycott[];
    },
  });
};

export const useJoinBoycott = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boycottId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to join a boycott');
      }

      // Check if already joined
      const { data: existing } = await supabase
        .from('boycott_participants')
        .select('id')
        .eq('boycott_id', boycottId)
        .eq('user_id', user.id)
        .single();

      if (existing) {
        throw new Error('You have already joined this boycott');
      }

      const { error } = await supabase
        .from('boycott_participants')
        .insert({
          boycott_id: boycottId,
          user_id: user.id
        });

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boycotts'] });
      queryClient.invalidateQueries({ queryKey: ['boycott-participation'] });
    },
  });
};

export const useBoycottStats = () => {
  return useQuery({
    queryKey: ['boycott-stats'],
    queryFn: async () => {
      const [
        { count: activeCount },
        { data: participantsData },
        { count: successfulCount },
        { data: companiesData }
      ] = await Promise.all([
        supabase.from('boycotts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
        supabase.from('boycotts').select('participants_count'),
        supabase.from('boycotts').select('*', { count: 'exact', head: true }).eq('status', 'successful'),
        supabase.from('boycotts').select('company').eq('status', 'successful')
      ]);

      const totalParticipants = participantsData?.reduce((sum, boycott) => sum + (boycott.participants_count || 0), 0) || 0;
      const uniqueCompanies = new Set(companiesData?.map(b => b.company)).size;

      return {
        activeBoycotts: activeCount || 0,
        totalParticipants,
        successfulCampaigns: successfulCount || 0,
        companiesChanged: uniqueCompanies
      };
    },
  });
};

export const useUserBoycottParticipation = (userId?: string) => {
  return useQuery({
    queryKey: ['boycott-participation', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('boycott_participants')
        .select('boycott_id')
        .eq('user_id', userId);
      
      if (error) throw new Error(error.message);
      return data?.map(p => p.boycott_id) || [];
    },
    enabled: !!userId,
  });
};

export const useLeaveBoycott = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boycottId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to leave a boycott');
      }

      const { error } = await supabase
        .from('boycott_participants')
        .delete()
        .eq('boycott_id', boycottId)
        .eq('user_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boycotts'] });
      queryClient.invalidateQueries({ queryKey: ['boycott-participation'] });
    },
  });
};

export const useDeleteBoycott = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boycottId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to delete a boycott');
      }

      const { error } = await supabase
        .from('boycotts')
        .delete()
        .eq('id', boycottId)
        .eq('organizer_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boycotts'] });
      queryClient.invalidateQueries({ queryKey: ['boycott-stats'] });
    },
  });
};

export const useDeactivateBoycott = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (boycottId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to deactivate a boycott');
      }

      const { error } = await supabase
        .from('boycotts')
        .update({ status: 'deactivated' })
        .eq('id', boycottId)
        .eq('organizer_id', user.id);

      if (error) {
        throw new Error(error.message);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boycotts'] });
      queryClient.invalidateQueries({ queryKey: ['boycott-stats'] });
    },
  });
};

export const useBoycottByCompany = (companyName: string) => {
  return useQuery({
    queryKey: ['boycott-by-company', companyName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('boycotts')
        .select(`*, categories (name, color)`)
        .eq('company', companyName)
        .eq('status', 'active')
        .order('created_at', { ascending: false });
      
      if (error) throw new Error(error.message);
      return data as Boycott[];
    },
    enabled: !!companyName,
  });
};