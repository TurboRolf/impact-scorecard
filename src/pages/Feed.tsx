import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Image, Building2 } from "lucide-react";
import { usePosts, useCreatePost, PostData } from "@/hooks/usePosts";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const navigate = useNavigate();
  
  const { data: posts = [], isLoading } = usePosts();
  const createPost = useCreatePost();

  // Authentication state management
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    await createPost.mutateAsync({
      content: newPost.trim(),
    });

    setNewPost("");
  };

  // Transform posts data for PostCard component
  const transformedPosts = posts.map((post: PostData) => ({
    user: {
      name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
      username: post.profiles?.username || "unknown",
      avatar: post.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles.username}` : undefined,
      isCreator: post.profiles?.profile_type === 'creator'
    },
    content: post.content,
    company: post.company_name ? {
      name: post.company_name,
      rating: post.company_rating || 0, // Use the specific review rating
      category: post.company_category || ""
    } : undefined,
    isBoycott: post.is_boycott,
    timestamp: formatTimestamp(post.created_at),
    likes: post.likes_count,
    comments: post.comments_count
  }));

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
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
        <Navigation />
        <div className="max-w-2xl mx-auto pt-20 px-4 pb-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-2xl mx-auto pt-20 px-4 pb-8">
        {/* Create Post */}
        {user ? (
          <Card className="mb-6">
            <CardContent className="p-4">
              <Textarea
                placeholder="Share your thoughts on a company's ethics, environmental impact, or political stance..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-24 resize-none border-0 focus-visible:ring-0 bg-transparent"
              />
              <div className="flex items-center justify-between mt-3 pt-3 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Image className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Building2 className="h-4 w-4" />
                  </Button>
                </div>
                <Button 
                  variant="earth" 
                  size="sm" 
                  disabled={!newPost.trim() || createPost.isPending}
                  onClick={handleCreatePost}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  {createPost.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardContent className="p-4 text-center">
              <p className="text-muted-foreground mb-3">Join EthiCheck to share your thoughts</p>
              <Button onClick={() => navigate("/auth")} variant="earth">
                Join EthiCheck
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Feed */}
        <div className="space-y-4">
          {transformedPosts.length > 0 ? (
            transformedPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No posts yet. Be the first to share!</p>
                {user && (
                  <Button onClick={() => document.querySelector('textarea')?.focus()} variant="outline">
                    Create First Post
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;