import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Image, Building2 } from "lucide-react";
import { usePosts, useCreatePost, PostData } from "@/hooks/usePosts";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [feedType, setFeedType] = useState<"trending" | "following">("trending");
  const navigate = useNavigate();
  
  const { data: posts = [], isLoading } = usePosts(feedType);
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
  const transformedPosts = posts.map((post: PostData) => {
    // Remove duplicate company info from content if it exists
    let cleanContent = post.content;
    if (post.company_name && post.company_rating) {
      // Remove patterns like "★★★★★ 5/5 - CompanyName (category)" from the beginning
      const starPattern = /^[★☆]+\s+\d+\/5\s+-\s+[^()+]+(\([^)]+\))?\s*[\n\r]*/;
      cleanContent = cleanContent.replace(starPattern, '').trim();
    }
    
    // Extract boycott info from content if it's a boycott post
    let boycottData = undefined;
    if (post.is_boycott) {
      // Try to extract boycott details from content
      const lines = post.content.split('\n').filter(line => line.trim());
      const titleMatch = lines[0]?.trim(); // Title is the first line
      const companyMatch = lines.find(line => line.startsWith('Target:'))?.replace('Target:', '').trim();
      const subjectMatch = lines.find(line => line.startsWith('Subject:'))?.replace('Subject:', '').trim();
      
      boycottData = {
        title: titleMatch || "Boycott Campaign",
        company: companyMatch || post.company_name || "Unknown Company",
        subject: subjectMatch || "Corporate accountability",
        impact: 'medium' as const,
        participants_count: Math.floor(Math.random() * 1000) + 100, // Mock data
        category: post.company_category || 'General'
      };
      
      // Clean the content to remove structured data - keep only the description part
      const targetIndex = lines.findIndex(line => line.startsWith('Target:'));
      const subjectIndex = lines.findIndex(line => line.startsWith('Subject:'));
      const hashtagIndex = lines.findIndex(line => line.includes('#Boycott'));
      
      // Extract description (lines after Subject line but before hashtags)
      if (subjectIndex >= 0) {
        const startIndex = subjectIndex + 1;
        const endIndex = hashtagIndex >= 0 ? hashtagIndex : lines.length;
        cleanContent = lines.slice(startIndex, endIndex)
          .filter(line => line.trim())
          .join('\n')
          .trim();
      } else {
        cleanContent = lines.slice(1).join('\n').trim();
      }
    }
    
    return {
      user: {
        id: post.user_id, // Add user ID for following functionality
        name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
        username: post.profiles?.username || "unknown",
        avatar: post.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles.username}` : undefined,
        isCreator: post.profiles?.profile_type === 'creator'
      },
      content: cleanContent,
      company: post.company_name && post.company_rating ? {
        name: post.company_name,
        rating: post.company_rating,
        category: post.company_category || ""
      } : undefined,
      boycott: boycottData,
      isBoycott: post.is_boycott,
      timestamp: formatTimestamp(post.created_at),
      likes: post.likes_count,
      comments: post.comments_count
    };
  });

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

        {/* Feed Tabs */}
        <Tabs value={feedType} onValueChange={(value) => setFeedType(value as "trending" | "following")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="trending">Trending</TabsTrigger>
            <TabsTrigger value="following">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-6">
            <div className="space-y-4">
              {transformedPosts.length > 0 ? (
                transformedPosts.map((post, index) => (
                  <PostCard key={index} {...post} currentUserId={user?.id} />
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
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <div className="space-y-4">
              {transformedPosts.length > 0 ? (
                transformedPosts.map((post, index) => (
                  <PostCard key={index} {...post} currentUserId={user?.id} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      {user ? "No posts from people you follow yet. Start following users to see their posts here!" : "Sign in to see posts from people you follow."}
                    </p>
                    {user && (
                      <Button onClick={() => setFeedType("trending")} variant="outline">
                        Browse Trending Posts
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Feed;