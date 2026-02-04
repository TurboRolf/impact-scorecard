import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import UserStancesList from "@/components/UserStancesList";
import UserReviewsList from "@/components/UserReviewsList";
import UserBoycottsList from "@/components/UserBoycottsList";
import ProfileSettingsDialog from "@/components/ProfileSettingsDialog";
import FollowersDialog from "@/components/FollowersDialog";
import FollowingDialog from "@/components/FollowingDialog";
import UserPostsDialog from "@/components/UserPostsDialog";
import AvatarUploadDialog from "@/components/AvatarUploadDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Users, Building2, AlertTriangle, Award, ThumbsUp, Minus, ThumbsDown, Camera } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStances } from "@/hooks/useCompanyStances";
import { useProfile } from "@/hooks/useProfile";
import { useFollowerCount, useFollowingCount, usePostsCount } from "@/hooks/useFollowCounts";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Profile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("stances");
  const navigate = useNavigate();

  // Get current user and listen for auth changes
  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const { data: userStances = [] } = useUserStances(user?.id);
  const { data: profile } = useProfile(user?.id);
  const { data: followerCount = 0 } = useFollowerCount(user?.id);
  const { data: followingCount = 0 } = useFollowingCount(user?.id);
  const { data: postsCount = 0 } = usePostsCount(user?.id);

  // Calculate stance stats
  const stanceStats = {
    recommend: userStances.filter(s => s.stance === 'recommend').length,
    neutral: userStances.filter(s => s.stance === 'neutral').length,
    discourage: userStances.filter(s => s.stance === 'discourage').length,
  };
  const profileData = {
    boycottsCreated: 0,
    boycottsJoined: 0
  };

  // No demo posts - will show empty state

  // Achievements will be earned through real activity

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        
        <div className="max-w-4xl mx-auto pt-20 px-4 pb-8">
          <Card className="text-center">
            <CardContent className="p-4 sm:p-8">
              <h1 className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Profile Access Required</h1>
              <p className="text-xs sm:text-base text-muted-foreground mb-4 sm:mb-6">
                Please sign in to view your profile.
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => navigate('/auth')} variant="earth" size="sm" className="text-xs sm:text-sm">
                  Sign In
                </Button>
                <Button onClick={() => navigate(-1)} variant="outline" size="sm" className="text-xs sm:text-sm">
                  Go Back
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-20 px-4 pb-8">
        {/* Profile Header */}
        <Card className="mb-4 sm:mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4 sm:gap-6">
              <button
                onClick={() => setAvatarOpen(true)}
                className="relative group cursor-pointer"
                aria-label="Ändra profilbild"
              >
                <Avatar className="h-16 w-16 sm:h-24 sm:w-24 mx-auto md:mx-0 transition-opacity group-hover:opacity-80">
                  <AvatarImage src={profile?.avatar_url || (profile?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}` : undefined)} />
                  <AvatarFallback className="text-lg sm:text-2xl">
                    {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                </div>
              </button>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-1 sm:gap-2 mb-1 sm:mb-2">
                 <h1 className="text-lg sm:text-2xl font-bold truncate">
                   {profile?.display_name || profile?.username || user?.email || 'Loading...'}
                 </h1>
                  {profile?.profile_type === 'creator' && (
                    <Badge className="bg-gradient-earth text-white w-fit mx-auto md:mx-0 text-xs">
                      Creator
                    </Badge>
                  )}
                </div>
                <p className="text-xs sm:text-base text-muted-foreground mb-2 sm:mb-4">
                  @{profile?.username || 'username'}
                </p>
                <p className="text-xs sm:text-base text-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">
                  {profile?.bio || 'No bio provided yet.'}
                </p>
                
                <div className="flex justify-center md:justify-start gap-3 sm:gap-6 mb-3 sm:mb-4">
                  <button 
                    onClick={() => setFollowersOpen(true)}
                    className="text-center hover:bg-muted/50 rounded-lg p-1.5 sm:p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-sm sm:text-base font-bold">{followerCount}</div>
                    <div className="text-[10px] sm:text-sm text-muted-foreground">Followers</div>
                  </button>
                  <button 
                    onClick={() => setFollowingOpen(true)}
                    className="text-center hover:bg-muted/50 rounded-lg p-1.5 sm:p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-sm sm:text-base font-bold">{followingCount}</div>
                    <div className="text-[10px] sm:text-sm text-muted-foreground">Following</div>
                  </button>
                  <button 
                    onClick={() => setPostsOpen(true)}
                    className="text-center hover:bg-muted/50 rounded-lg p-1.5 sm:p-2 transition-colors cursor-pointer"
                  >
                    <div className="text-sm sm:text-base font-bold">{postsCount}</div>
                    <div className="text-[10px] sm:text-sm text-muted-foreground">Posts</div>
                  </button>
                </div>
                
                <Button 
                  variant="earth" 
                  size="sm"
                  className="gap-1.5 sm:gap-2 text-xs sm:text-sm"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Edit className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards - Compact on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3 md:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <ThumbsUp className="h-3 w-3 sm:h-4 sm:w-4 text-recommend" />
                <span className="hidden sm:inline">Recommended</span>
                <span className="sm:hidden">Rec.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-recommend">{stanceStats.recommend}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Minus className="h-3 w-3 sm:h-4 sm:w-4 text-neutral" />
                <span className="hidden sm:inline">Neutral</span>
                <span className="sm:hidden">Neu.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-neutral">{stanceStats.neutral}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <ThumbsDown className="h-3 w-3 sm:h-4 sm:w-4 text-discourage" />
                <span className="hidden sm:inline">Discouraged</span>
                <span className="sm:hidden">Disc.</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-discourage">{stanceStats.discourage}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-brand-accent" />
                <span className="hidden sm:inline">Boycotts Created</span>
                <span className="sm:hidden">Created</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{profileData.boycottsCreated}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Boycotts</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-1 sm:pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="text-xs sm:text-sm font-medium flex items-center gap-1 sm:gap-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-brand-success" />
                <span className="hidden sm:inline">Boycotts Joined</span>
                <span className="sm:hidden">Joined</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 md:p-6 md:pt-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold">{profileData.boycottsJoined}</div>
              <p className="text-[10px] sm:text-xs text-muted-foreground">Boycotts</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements - Hidden until user earns some */}

        {/* Content Tabs - Mobile Dropdown + Desktop Tabs */}
        <div className="w-full">
          {/* Mobile: Dropdown Selection */}
          <div className="md:hidden mb-4">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select content type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stances">Company Stances</SelectItem>
                <SelectItem value="posts">Recent Posts</SelectItem>
                <SelectItem value="reviews">Reviews</SelectItem>
                <SelectItem value="boycotts">Boycotts</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: Traditional Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="hidden md:grid w-full grid-cols-4">
              <TabsTrigger value="stances">Company Stances</TabsTrigger>
              <TabsTrigger value="posts">Recent Posts</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="boycotts">Boycotts</TabsTrigger>
            </TabsList>
            
            <TabsContent value="stances" className="mt-4 md:mt-6">
              <UserStancesList userId={user?.id} />
            </TabsContent>

            <TabsContent value="posts" className="space-y-4 mt-4 md:mt-6">
              <Card>
                <CardContent className="p-4 sm:p-6 md:p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-3 sm:mb-4">No posts yet. Share your thoughts to get started!</p>
                  <Button onClick={() => navigate('/feed')} variant="earth" size="sm">
                    Create Your First Post
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-4 md:mt-6">
              <UserReviewsList userId={user?.id} />
            </TabsContent>
            
            <TabsContent value="boycotts" className="mt-4 md:mt-6">
              <UserBoycottsList userId={user?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <ProfileSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userId={user?.id}
      />
      
      <FollowersDialog
        open={followersOpen}
        onOpenChange={setFollowersOpen}
        userId={user?.id}
      />
      
      <FollowingDialog
        open={followingOpen}
        onOpenChange={setFollowingOpen}
        userId={user?.id}
      />
      
      <UserPostsDialog
        open={postsOpen}
        onOpenChange={setPostsOpen}
        userId={user?.id}
      />
      
      <AvatarUploadDialog
        open={avatarOpen}
        onOpenChange={setAvatarOpen}
        userId={user?.id}
        currentAvatarUrl={profile?.avatar_url}
        username={profile?.username}
        displayName={profile?.display_name}
      />
    </div>
  );
};

export default Profile;