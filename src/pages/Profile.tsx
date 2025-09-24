import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import UserStancesList from "@/components/UserStancesList";
import UserReviewsList from "@/components/UserReviewsList";
import UserBoycottsList from "@/components/UserBoycottsList";
import ProfileSettingsDialog from "@/components/ProfileSettingsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Users, Building2, AlertTriangle, Award, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStances } from "@/hooks/useCompanyStances";
import { useProfile } from "@/hooks/useProfile";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Profile = () => {
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);
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

  // Calculate stance stats
  const stanceStats = {
    recommend: userStances.filter(s => s.stance === 'recommend').length,
    neutral: userStances.filter(s => s.stance === 'neutral').length,
    discourage: userStances.filter(s => s.stance === 'discourage').length,
  };
  const profileData = {
    followers: 0,
    following: 0,
    postsCount: 0,
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
            <CardContent className="p-8">
              <h1 className="text-2xl font-bold mb-4">Profile Access Required</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your profile and manage your account settings.
              </p>
              <Button onClick={() => navigate('/auth')} variant="earth" className="mr-4">
                Sign In
              </Button>
              <Button onClick={() => navigate(-1)} variant="outline">
                Go Back
              </Button>
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
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 mx-auto md:mx-0">
                <AvatarImage src={profile?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}` : undefined} />
                <AvatarFallback className="text-2xl">
                  {profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                 <h1 className="text-2xl font-bold">
                   {profile?.display_name || profile?.username || user?.email || 'Loading...'}
                 </h1>
                  {profile?.profile_type === 'creator' && (
                    <Badge className="bg-gradient-earth text-white w-fit mx-auto md:mx-0">
                      Creator
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">
                  @{profile?.username || 'username'}
                </p>
                <p className="text-foreground mb-4">
                  {profile?.bio || 'No bio provided yet.'}
                </p>
                
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center">
                    <div className="font-bold">{profileData.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{profileData.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold">{profileData.postsCount}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                </div>
                
                <Button 
                  variant="earth" 
                  className="gap-2"
                  onClick={() => setSettingsOpen(true)}
                >
                  <Edit className="h-4 w-4" />
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

        {/* Content Tabs */}
        <Tabs defaultValue="stances" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stances">Company Stances</TabsTrigger>
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="boycotts">Boycotts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="stances" className="mt-6">
            <UserStancesList userId={user?.id} />
          </TabsContent>

          <TabsContent value="posts" className="space-y-4 mt-6">
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground mb-4">No posts yet. Share your thoughts to get started!</p>
                <Button onClick={() => navigate('/feed')} variant="earth">
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <UserReviewsList userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="boycotts" className="mt-6">
            <UserBoycottsList userId={user?.id} />
          </TabsContent>
        </Tabs>
      </div>
      
      <ProfileSettingsDialog
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        userId={user?.id}
      />
    </div>
  );
};

export default Profile;