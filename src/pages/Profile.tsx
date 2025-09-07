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
    name: "Sarah Green",
    username: "sarahgreen",
    bio: "Environmental advocate & ethical business researcher. Helping consumers make informed choices for a better world. 🌍✊",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150",
    isCreator: true,
    followers: 1247,
    following: 89,
    postsCount: 156,
    reviewsCount: 43,
    boycottsCreated: 7,
    boycottsJoined: 23
  };

  const recentPosts = [
    {
      user: {
        name: profileData.name,
        username: profileData.username,
        avatar: profileData.avatar,
        isCreator: true
      },
      content: "Just finished a deep dive into Tesla's latest sustainability report. While their EV mission is commendable, their labor practices still need significant improvement. Mixed feelings on this one.",
      company: {
        name: "Tesla",
        rating: 3,
        category: "Electric Vehicles"
      },
      timestamp: "2h",
      likes: 24,
      comments: 7
    },
    {
      user: {
        name: profileData.name,
        username: profileData.username,
        avatar: profileData.avatar,
        isCreator: true
      },
      content: "Patagonia continues to set the gold standard for corporate responsibility. Their latest move to give away the company to fight climate change is unprecedented. More companies should follow this lead.",
      company: {
        name: "Patagonia",
        rating: 5,
        category: "Outdoor Apparel"
      },
      timestamp: "1d",
      likes: 89,
      comments: 23
    }
  ];

  const achievements = [
    { icon: Award, label: "Top Reviewer", description: "50+ detailed reviews" },
    { icon: Users, label: "Community Builder", description: "1000+ followers" },
    { icon: AlertTriangle, label: "Boycott Leader", description: "5+ successful boycotts" },
  ];

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
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
    <div className="min-h-screen bg-gradient-subtle">
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-recommend" />
                Recommended
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-recommend">{stanceStats.recommend}</div>
              <p className="text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Minus className="h-4 w-4 text-neutral" />
                Neutral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-neutral">{stanceStats.neutral}</div>
              <p className="text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <ThumbsDown className="h-4 w-4 text-discourage" />
                Discouraged
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-discourage">{stanceStats.discourage}</div>
              <p className="text-xs text-muted-foreground">Companies</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-brand-accent" />
                Boycotts Created
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData.boycottsCreated}</div>
              <p className="text-xs text-muted-foreground">Active campaigns</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Users className="h-4 w-4 text-brand-success" />
                Boycotts Joined
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData.boycottsJoined}</div>
              <p className="text-xs text-muted-foreground">Supporting causes</p>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <achievement.icon className="h-8 w-8 text-earth-blue" />
                  <div>
                    <div className="font-medium">{achievement.label}</div>
                    <div className="text-sm text-muted-foreground">{achievement.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
            {recentPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
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