import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Users, Building2, AlertTriangle, Award } from "lucide-react";

const Profile = () => {
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

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-20 px-4 pb-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-6">
              <Avatar className="h-24 w-24 mx-auto md:mx-0">
                <AvatarImage src={profileData.avatar} />
                <AvatarFallback className="text-2xl">{profileData.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                  <h1 className="text-2xl font-bold">{profileData.name}</h1>
                  {profileData.isCreator && (
                    <Badge className="bg-gradient-earth text-white w-fit mx-auto md:mx-0">
                      Creator
                    </Badge>
                  )}
                </div>
                <p className="text-muted-foreground mb-4">@{profileData.username}</p>
                <p className="text-foreground mb-4">{profileData.bio}</p>
                
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
                
                <Button variant="earth" className="gap-2">
                  <Edit className="h-4 w-4" />
                  Edit Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-earth-blue" />
                Company Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{profileData.reviewsCount}</div>
              <p className="text-xs text-muted-foreground">Detailed evaluations</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-earth-orange" />
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
                <Users className="h-4 w-4 text-earth-green" />
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
        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="posts">Recent Posts</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
            <TabsTrigger value="boycotts">Boycotts</TabsTrigger>
          </TabsList>
          
          <TabsContent value="posts" className="space-y-4 mt-6">
            {recentPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
          </TabsContent>
          
          <TabsContent value="reviews" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Detailed company reviews will appear here
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="boycotts" className="mt-6">
            <Card>
              <CardContent className="p-6 text-center text-muted-foreground">
                Created and joined boycotts will appear here
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;