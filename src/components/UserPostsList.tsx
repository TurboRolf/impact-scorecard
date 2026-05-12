import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface UserPostsListProps {
  userId?: string;
}

const UserPostsList = ({ userId }: UserPostsListProps) => {
  const navigate = useNavigate();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["userPostsList", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .is("removed_at", null)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 md:p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No posts yet. Share your thoughts to get started!
          </p>
          <Button onClick={() => navigate("/")} variant="earth" size="sm">
            Create Your First Post
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="p-3 md:p-4">
            <p className="text-sm whitespace-pre-wrap">{post.content}</p>
            {post.company_name && (
              <p className="text-xs text-muted-foreground mt-2">
                About: {post.company_name}
              </p>
            )}
            <p className="text-xs text-muted-foreground mt-1">
              {formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserPostsList;