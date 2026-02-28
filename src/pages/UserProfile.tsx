import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileStats from "@/components/profile/ProfileStats";
import FollowersDialog from "@/components/FollowersDialog";
import FollowingDialog from "@/components/FollowingDialog";
import UserPostsDialog from "@/components/UserPostsDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserPlus, UserCheck, Lock, Clock } from "lucide-react";
import { useUserStances } from "@/hooks/useCompanyStances";
import { useProfile } from "@/hooks/useProfile";
import { useFollowerCount, useFollowingCount, usePostsCount } from "@/hooks/useFollowCounts";
import { useFollowStatus, useFollowUser, useUnfollowUser, useIsAcceptedFollower } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");

  const { data: userStances = [] } = useUserStances(userId);
  const { data: profile, isLoading } = useProfile(userId);
  useDocumentTitle(profile?.display_name || profile?.username || "User Profile");
  const { data: followerCount = 0 } = useFollowerCount(userId);
  const { data: followingCount = 0 } = useFollowingCount(userId);
  const { data: postsCount = 0 } = usePostsCount(userId);
  
  const { data: followStatus } = useFollowStatus(currentUser?.id, userId);
  const { data: isAcceptedFollower = false } = useIsAcceptedFollower(currentUser?.id, userId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();

  const isOwnProfile = currentUser?.id === userId;
  const isCreator = profile?.profile_type === 'creator';
  const isPrivateProfile = !isCreator; // Regular users are private
  const canViewContent = isOwnProfile || isCreator || isAcceptedFollower;

  const handleFollowToggle = async () => {
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    if (!userId) return;

    if (followStatus === 'accepted' || followStatus === 'pending') {
      await unfollowUser.mutateAsync(userId);
    } else {
      await followUser.mutateAsync({ followingId: userId, isPrivate: isPrivateProfile });
    }
  };

  const stanceStats = {
    recommend: userStances.filter(s => s.stance === 'recommend').length,
    neutral: userStances.filter(s => s.stance === 'neutral').length,
    discourage: userStances.filter(s => s.stance === 'discourage').length,
  };

  const avatarUrl = profile?.avatar_url || 
    (profile?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}` : undefined);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-20 px-4 pb-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading profile...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        <div className="max-w-4xl mx-auto pt-20 px-4 pb-8">
          <Card className="text-center">
            <CardContent className="p-4 md:p-8">
              <h1 className="text-lg md:text-2xl font-bold mb-2 md:mb-4">Profile Not Found</h1>
              <p className="text-sm md:text-base text-muted-foreground mb-4 md:mb-6">
                This user profile does not exist.
              </p>
              <Button onClick={() => navigate(-1)} variant="outline" size="sm">
                Go Back
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const renderFollowButton = () => {
    if (isOwnProfile) {
      return (
        <Button 
          variant="earth" 
          size="sm"
          className="gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-4"
          onClick={() => navigate('/profile')}
        >
          Go to My Profile
        </Button>
      );
    }

    if (followStatus === 'pending') {
      return (
        <Button 
          variant="secondary" 
          size="sm"
          className="gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-4"
          onClick={handleFollowToggle}
          disabled={unfollowUser.isPending}
        >
          <Clock className="h-3 w-3 md:h-4 md:w-4" />
          Begärd
        </Button>
      );
    }

    if (followStatus === 'accepted') {
      return (
        <Button 
          variant="secondary" 
          size="sm"
          className="gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-4"
          onClick={handleFollowToggle}
          disabled={unfollowUser.isPending}
        >
          <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
          Following
        </Button>
      );
    }

    return (
      <Button 
        variant="follow" 
        size="sm"
        className="gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-4"
        onClick={handleFollowToggle}
        disabled={followUser.isPending}
      >
        <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
        Follow
      </Button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-16 md:pt-20 px-3 md:px-4 pb-4 md:pb-8">
        {/* Mobile bio */}
        {profile.bio && (
          <p className="md:hidden text-xs text-muted-foreground mb-3 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Profile Header Card */}
        <Card className="mb-3 md:mb-6">
          <CardContent className="p-3 md:p-6">
            <div className="flex gap-3 md:gap-6">
              <Avatar className="h-14 w-14 md:h-24 md:w-24 flex-shrink-0">
                <AvatarImage src={avatarUrl} />
                <AvatarFallback className="text-base md:text-2xl">
                  {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 md:mb-3">
                  <h1 className="text-base md:text-2xl font-bold truncate">
                    @{profile.username || 'username'}
                  </h1>
                  {isCreator && (
                    <Badge className="bg-gradient-earth text-white text-[10px] md:text-xs px-1.5 py-0">
                      Creator
                    </Badge>
                  )}
                  {isPrivateProfile && (
                    <Lock className="h-3.5 w-3.5 md:h-4 md:w-4 text-muted-foreground" />
                  )}
                </div>
                
                {/* Bio - desktop only */}
                <p className="hidden md:block text-base text-foreground mb-4 line-clamp-2">
                  {profile.bio || 'No bio provided yet.'}
                </p>
                
                {/* Stats - only show if content is viewable */}
                {canViewContent ? (
                  <div className="flex gap-4 md:gap-6 mb-2 md:mb-4">
                    <button onClick={() => setFollowersOpen(true)} className="hover:opacity-70 transition-opacity">
                      <span className="text-sm md:text-base font-bold">{followerCount}</span>
                      <span className="text-[10px] md:text-sm text-muted-foreground ml-1">followers</span>
                    </button>
                    <button onClick={() => setFollowingOpen(true)} className="hover:opacity-70 transition-opacity">
                      <span className="text-sm md:text-base font-bold">{followingCount}</span>
                      <span className="text-[10px] md:text-sm text-muted-foreground ml-1">following</span>
                    </button>
                    <button onClick={() => setPostsOpen(true)} className="hover:opacity-70 transition-opacity">
                      <span className="text-sm md:text-base font-bold">{postsCount}</span>
                      <span className="text-[10px] md:text-sm text-muted-foreground ml-1">posts</span>
                    </button>
                  </div>
                ) : (
                  <p className="text-xs md:text-sm text-muted-foreground mb-2 md:mb-4">
                    Privat konto · Följ för att se inlägg och statistik
                  </p>
                )}
                
                {renderFollowButton()}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content - only visible for accepted followers / own profile / creators */}
        {canViewContent ? (
          <>
            <div className="mb-3 md:mb-6">
              <ProfileStats
                stanceStats={stanceStats}
                boycottsCreated={0}
                boycottsJoined={0}
              />
            </div>

            <ProfileContent
              userId={userId}
              activeTab={activeTab}
              onTabChange={setActiveTab}
              showPosts={false}
            />
          </>
        ) : (
          <Card>
            <CardContent className="p-8 md:p-12 text-center">
              <Lock className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground/40 mx-auto mb-4" />
              <h2 className="text-base md:text-lg font-semibold mb-2">Det här kontot är privat</h2>
              <p className="text-xs md:text-sm text-muted-foreground">
                Följ det här kontot för att se inlägg, recensioner och ställningstaganden.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
      
      {canViewContent && (
        <>
          <FollowersDialog open={followersOpen} onOpenChange={setFollowersOpen} userId={userId} />
          <FollowingDialog open={followingOpen} onOpenChange={setFollowingOpen} userId={userId} />
          <UserPostsDialog open={postsOpen} onOpenChange={setPostsOpen} userId={userId} />
        </>
      )}
    </div>
  );
};

export default UserProfile;
