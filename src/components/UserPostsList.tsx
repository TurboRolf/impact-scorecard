import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import PostCard from "@/components/PostCard";
import { useAuth } from "@/hooks/useAuth";
import { useBoycotts } from "@/hooks/useBoycotts";
import type { PostData } from "@/hooks/usePosts";

interface UserPostsListProps {
  userId?: string;
}

function formatTimestamp(timestamp: string): string {
  const now = new Date();
  const postDate = new Date(timestamp);
  const diffInHours = Math.floor((now.getTime() - postDate.getTime()) / (1000 * 60 * 60));
  if (diffInHours < 1) return "Just now";
  if (diffInHours < 24) return `${diffInHours}h`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays}d`;
  return postDate.toLocaleDateString();
}

const UserPostsList = ({ userId }: UserPostsListProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: allBoycotts = [] } = useBoycotts();

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["userPostsList", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("posts")
        .select("*, profiles(display_name, username, profile_type, avatar_url)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as PostData[];
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

  const visiblePosts = posts.filter((p) => !p.removed_at || p.user_id === user?.id);

  if (visiblePosts.length === 0) {
    return (
      <Card>
        <CardContent className="p-4 md:p-8 text-center">
          <p className="text-sm text-muted-foreground mb-3">
            No posts yet.
          </p>
          {user?.id === userId && (
            <Button onClick={() => navigate("/")} variant="earth" size="sm">
              Create Your First Post
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {visiblePosts.map((post) => {
        let cleanContent = post.content;
        if (post.company_name && post.company_rating) {
          const starPattern = /^[★☆]+\s+\d+\/5\s+-\s+[^()+]+(\([^)]+\))?\s*[\n\r]*/;
          cleanContent = cleanContent.replace(starPattern, "").trim();
        }

        let boycottData: any = undefined;
        if (post.is_boycott) {
          const lines = post.content.split("\n").filter((l) => l.trim());
          const titleMatch = lines[0]?.trim();
          const companyMatch = lines.find((l) => l.startsWith("Target:"))?.replace("Target:", "").trim();
          const matched =
            allBoycotts.find((b: any) => b.company === (companyMatch || post.company_name) && b.title === titleMatch) ||
            allBoycotts.find((b: any) => b.company === (companyMatch || post.company_name));

          boycottData = {
            id: matched?.id,
            title: matched?.title || titleMatch || "Boycott Campaign",
            company: matched?.company || companyMatch || post.company_name || "Unknown Company",
            subject: matched?.subject || "Corporate accountability",
            participants_count: matched?.participants_count || 0,
            category: matched?.categories?.name || post.company_category || "General",
            condition: matched?.condition || null,
            status: matched?.status || "active",
            deactivation_reason: matched?.deactivation_reason || null,
          };

          const targetIndex = lines.findIndex((l) => l.startsWith("Target:"));
          const subjectIndex = lines.findIndex((l) => l.startsWith("Subject:"));
          const hashtagIndex = lines.findIndex((l) => l.includes("#Boycott"));
          if (subjectIndex >= 0) {
            const end = hashtagIndex >= 0 ? hashtagIndex : lines.length;
            cleanContent = lines.slice(subjectIndex + 1, end).filter((l) => l.trim()).join("\n").trim();
          } else if (targetIndex >= 0) {
            const end = hashtagIndex >= 0 ? hashtagIndex : lines.length;
            cleanContent = lines.slice(targetIndex + 1, end).filter((l) => l.trim()).join("\n").trim();
          } else {
            cleanContent = lines.slice(1).join("\n").trim();
          }
        }

        return (
          <PostCard
            key={post.id}
            postId={post.id}
            user={{
              id: post.user_id,
              name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
              username: post.profiles?.username || "unknown",
              avatar:
                post.profiles?.avatar_url ||
                (post.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles.username}` : undefined),
              isCreator: post.profiles?.profile_type === "creator",
            }}
            content={cleanContent}
            company={
              post.company_name && post.company_rating
                ? { name: post.company_name, rating: post.company_rating, category: post.company_category || "" }
                : undefined
            }
            boycott={boycottData}
            isBoycott={post.is_boycott}
            timestamp={formatTimestamp(post.created_at)}
            likes={post.likes_count}
            comments={post.comments_count}
            currentUserId={user?.id}
            removed={post.removed_at ? { reason: post.removed_reason ?? null } : undefined}
          />
        );
      })}
    </div>
  );
};

export default UserPostsList;
