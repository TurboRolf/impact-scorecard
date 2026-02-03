import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search, Award, UserPlus, UserCheck, User } from "lucide-react";
import { useCreators } from "@/hooks/useProfile";
import { useFollows, useFollowUser, useUnfollowUser } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";

const Creators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  
  const { user } = useAuth();
  const { data: creators = [], isLoading } = useCreators();
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const { data: followedUsers = [] } = useFollows(user?.id);
  
  const filteredCreators = creators.filter(creator =>
    searchTerm === "" || 
    creator.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFollowToggle = async (creatorUserId: string) => {
    if (!user) {
      navigate("/auth");
      return;
    }

    const isCurrentlyFollowing = followedUsers.includes(creatorUserId);
    if (isCurrentlyFollowing) {
      await unfollowUser.mutateAsync(creatorUserId);
    } else {
      await followUser.mutateAsync(creatorUserId);
    }
  };

  if (isLoading) {
    return <LoadingScreen message="Loading creators..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Featured Creators</h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Follow expert researchers and advocates for ethical insights.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-12 sm:py-20">
            <p className="text-sm sm:text-base text-muted-foreground mb-2 sm:mb-4">No creators found.</p>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Be the first creator! Switch to creator mode in your profile settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="hover:shadow-card transition-all duration-300">
                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                  <div className="flex items-start gap-2.5 sm:gap-3">
                    <Avatar className="h-10 w-10 sm:h-16 sm:w-16">
                      <AvatarImage src={creator.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}` : undefined} />
                      <AvatarFallback className="text-sm sm:text-lg">
                        {creator.display_name?.charAt(0) || creator.username?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-0.5 sm:mb-1">
                        <CardTitle className="text-sm sm:text-lg truncate">
                          {creator.display_name || creator.username || 'Anonymous Creator'}
                        </CardTitle>
                        <Award className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-earth-blue flex-shrink-0" />
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        @{creator.username || 'username'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-3">
                    {creator.bio || 'No bio provided yet.'}
                  </p>
                  
                  <div className="flex gap-2">
                    {user && user.id !== creator.user_id ? (
                      <Button 
                        variant={followedUsers.includes(creator.user_id) ? "secondary" : "default"}
                        size="sm" 
                        className="flex-1 gap-1 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => handleFollowToggle(creator.user_id)}
                        disabled={followUser.isPending || unfollowUser.isPending}
                      >
                        {followedUsers.includes(creator.user_id) ? (
                          <>
                            <UserCheck className="h-3 w-3" />
                            <span className="hidden sm:inline">Following</span>
                            <span className="sm:hidden">✓</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="h-3 w-3" />
                            Follow
                          </>
                        )}
                      </Button>
                    ) : !user ? (
                      <Button 
                        variant="default"
                        size="sm" 
                        className="flex-1 gap-1 text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => navigate("/auth")}
                      >
                        <UserPlus className="h-3 w-3" />
                        Follow
                      </Button>
                    ) : (
                      <Button variant="secondary" size="sm" className="flex-1 text-xs sm:text-sm h-8 sm:h-9" disabled>
                        Your Profile
                      </Button>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1 gap-1 text-xs sm:text-sm h-8 sm:h-9"
                      onClick={() => navigate(`/user/${creator.user_id}`)}
                    >
                      <User className="h-3 w-3" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Creators;