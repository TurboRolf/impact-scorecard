import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import LoadingScreen from "@/components/LoadingScreen";
import LeftSidebar from "@/components/feed/LeftSidebar";
import RightSidebar from "@/components/feed/RightSidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Image, Building2, Star, X } from "lucide-react";
import { usePosts, useCreatePost, PostData } from "@/hooks/usePosts";
import { useBoycottByCompany, useBoycotts } from "@/hooks/useBoycotts";
import { useCompanies } from "@/hooks/useCompanyStances";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useToast } from "@/hooks/use-toast";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  const [feedType, setFeedType] = useState<"trending" | "following">("trending");
  const [taggedCompany, setTaggedCompany] = useState<{ name: string; category: string } | null>(null);
  const [companyRating, setCompanyRating] = useState<number>(0);
  const [showCompanyTag, setShowCompanyTag] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { user } = useAuth();
  const { data: posts = [], isLoading, isError, refetch } = usePosts(feedType);
  const { data: companies = [] } = useCompanies();
  const { data: allBoycotts = [] } = useBoycotts();
  useDocumentTitle("Feed");
  const createPost = useCreatePost();

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) return;

    await createPost.mutateAsync({
      content: newPost.trim(),
      ...(taggedCompany && companyRating > 0 ? {
        company_name: taggedCompany.name,
        company_category: taggedCompany.category,
        company_rating: companyRating,
      } : {}),
    });

    setNewPost("");
    setTaggedCompany(null);
    setCompanyRating(0);
    setShowCompanyTag(false);
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
        // Note: We don't have the real boycott ID linked to posts yet
        // This would require a database schema change to link posts to boycotts
        title: titleMatch || "Boycott Campaign",
        company: companyMatch || post.company_name || "Unknown Company",
        subject: subjectMatch || "Corporate accountability",
        participants_count: 0,
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
      postId: post.id,
      user: {
        id: post.user_id,
        name: post.profiles?.display_name || post.profiles?.username || "Anonymous User",
        username: post.profiles?.username || "unknown",
        avatar: post.profiles?.avatar_url || (post.profiles?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${post.profiles.username}` : undefined),
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
    return <LoadingScreen message="Loading posts..." />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        <div className="max-w-2xl mx-auto pt-20 px-4 text-center">
          <h1 className="text-xl font-bold mb-2">Failed to load posts</h1>
          <p className="text-muted-foreground mb-4 text-sm">Something went wrong.</p>
          <Button onClick={() => refetch()} variant="outline" size="sm">Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-7xl mx-auto pt-20 px-3 md:px-4 pb-8">
        <div className="flex gap-6">
          {/* Left Sidebar - hidden on mobile */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <LeftSidebar />
          </aside>

          {/* Main Feed */}
          <div className="flex-1 max-w-2xl mx-auto lg:mx-0">
        {/* Create Post */}
        {user ? (
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-3 md:p-4">
              <Textarea
                placeholder="Share your thoughts on a company's ethics, environmental impact, or political stance..."
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                className="min-h-20 md:min-h-24 resize-none border-0 focus-visible:ring-0 bg-transparent text-sm md:text-base"
              />
              {/* Tagged company preview */}
              {taggedCompany && (
                <div className="flex items-center gap-2 mt-1 mb-1">
                  <div className="flex items-center gap-1.5 bg-muted rounded-full px-3 py-1 text-xs">
                    <Building2 className="h-3 w-3 text-muted-foreground" />
                    <span className="font-medium">{taggedCompany.name}</span>
                    {companyRating > 0 && (
                      <span className="flex items-center gap-0.5 text-yellow-500">
                        {Array.from({ length: companyRating }).map((_, i) => (
                          <Star key={i} className="h-2.5 w-2.5 fill-current" />
                        ))}
                      </span>
                    )}
                    <button onClick={() => { setTaggedCompany(null); setCompanyRating(0); setShowCompanyTag(false); }} className="ml-1 text-muted-foreground hover:text-foreground">
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}

              {/* Company tagging UI */}
              {showCompanyTag && !taggedCompany && (
                <div className="flex flex-col gap-2 mt-2 p-2 rounded-md bg-muted/50">
                  <Select onValueChange={(val) => {
                    const company = companies.find(c => c.id === val);
                    if (company) setTaggedCompany({ name: company.name, category: company.category });
                  }}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Välj företag..." />
                    </SelectTrigger>
                    <SelectContent>
                      {companies.map(c => (
                        <SelectItem key={c.id} value={c.id} className="text-xs">{c.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-muted-foreground mr-1">Betyg:</span>
                    {[1, 2, 3, 4, 5].map(n => (
                      <button key={n} onClick={() => setCompanyRating(n)} className="p-0.5">
                        <Star className={`h-4 w-4 ${n <= companyRating ? 'text-yellow-500 fill-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mt-2 pt-2 md:mt-3 md:pt-3 border-t">
                <div className="flex gap-1 md:gap-2">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 md:h-9 md:w-auto md:px-3"
                    onClick={() => toast({ title: "Kommer snart", description: "Bilduppladdning är inte tillgänglig ännu." })}>
                    <Image className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className={`h-8 w-8 p-0 md:h-9 md:w-auto md:px-3 ${showCompanyTag || taggedCompany ? 'text-primary' : ''}`}
                    onClick={() => setShowCompanyTag(!showCompanyTag)}>
                    <Building2 className="h-3.5 w-3.5 md:h-4 md:w-4" />
                  </Button>
                </div>
                <Button 
                  variant="earth" 
                  size="sm" 
                  disabled={!newPost.trim() || createPost.isPending}
                  onClick={handleCreatePost}
                  className="h-8 text-xs md:h-9 md:text-sm"
                >
                  <PlusCircle className="h-3.5 w-3.5 md:h-4 md:w-4 mr-1 md:mr-2" />
                  {createPost.isPending ? "Posting..." : "Post"}
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-4 md:mb-6">
            <CardContent className="p-3 md:p-4 text-center">
              <p className="text-muted-foreground mb-2 md:mb-3 text-sm md:text-base">Join EthiCheck to share your thoughts</p>
              <Button onClick={() => navigate("/auth")} variant="earth" size="sm" className="text-xs md:text-sm">
                Join EthiCheck
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Feed Tabs */}
        <Tabs value={feedType} onValueChange={(value) => setFeedType(value as "trending" | "following")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 h-9 md:h-10">
            <TabsTrigger value="trending" className="text-xs md:text-sm">Trending</TabsTrigger>
            <TabsTrigger value="following" className="text-xs md:text-sm">Following</TabsTrigger>
          </TabsList>
          
          <TabsContent value="trending" className="mt-3 md:mt-6">
            <div className="space-y-3 md:space-y-4">
              {transformedPosts.length > 0 ? (
                transformedPosts.map((post, index) => (
                  <PostCard key={index} {...post} currentUserId={user?.id} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-4 md:p-8 text-center">
                    <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">No posts yet. Be the first to share!</p>
                    {user && (
                      <Button onClick={() => document.querySelector('textarea')?.focus()} variant="outline" size="sm" className="text-xs md:text-sm">
                        Create First Post
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="following" className="mt-3 md:mt-6">
            <div className="space-y-3 md:space-y-4">
              {transformedPosts.length > 0 ? (
                transformedPosts.map((post, index) => (
                  <PostCard key={index} {...post} currentUserId={user?.id} />
                ))
              ) : (
                <Card>
                  <CardContent className="p-4 md:p-8 text-center">
                    <p className="text-muted-foreground mb-3 md:mb-4 text-sm md:text-base">
                      {user ? "No posts from people you follow yet. Start following users to see their posts here!" : "Sign in to see posts from people you follow."}
                    </p>
                    {user && (
                      <Button onClick={() => setFeedType("trending")} variant="outline" size="sm" className="text-xs md:text-sm">
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

          {/* Right Sidebar - hidden on mobile/tablet */}
          <aside className="hidden xl:block w-72 flex-shrink-0">
            <RightSidebar />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Feed;