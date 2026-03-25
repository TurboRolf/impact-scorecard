import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import ProfileHeader from "@/components/profile/ProfileHeader";
import ProfileStats from "@/components/profile/ProfileStats";
import ProfileContent from "@/components/profile/ProfileContent";
import ProfileSettingsDialog from "@/components/ProfileSettingsDialog";
import FollowersDialog from "@/components/FollowersDialog";
import FollowingDialog from "@/components/FollowingDialog";
import UserPostsDialog from "@/components/UserPostsDialog";
import AvatarUploadDialog from "@/components/AvatarUploadDialog";
import FollowRequestsDialog from "@/components/FollowRequestsDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useUserStances } from "@/hooks/useCompanyStances";
import { useBoycotts, useUserBoycottParticipation } from "@/hooks/useBoycotts";
import { useProfile } from "@/hooks/useProfile";
import { useFollowerCount, useFollowingCount, usePostsCount } from "@/hooks/useFollowCounts";
import { usePendingFollowRequests } from "@/hooks/useFollows";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Profile = () => {
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [requestsOpen, setRequestsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const [boycottSubTab, setBoycottSubTab] = useState<string | undefined>();
  const navigate = useNavigate();
  useDocumentTitle("Profile");

  const { data: userStances = [] } = useUserStances(user?.id);
  const { data: boycotts = [] } = useBoycotts();
  const { data: joinedBoycottIds = [] } = useUserBoycottParticipation(user?.id);
  const { data: profile } = useProfile(user?.id);
  const { data: followerCount = 0 } = useFollowerCount(user?.id);
  const { data: followingCount = 0 } = useFollowingCount(user?.id);
  const { data: postsCount = 0 } = usePostsCount(user?.id);
  const { data: pendingRequests = [] } = usePendingFollowRequests(user?.id);
  const isPrivateProfile = profile?.profile_type !== 'creator';

  const stanceStats = {
    recommend: userStances.filter(s => s.stance === 'recommend').length,
    neutral: userStances.filter(s => s.stance === 'neutral').length,
    discourage: userStances.filter(s => s.stance === 'discourage').length,
  };

  // ProtectedRoute handles unauthenticated state
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-4xl mx-auto pt-16 md:pt-20 px-3 md:px-4 pb-4 md:pb-8">
        {/* Mobile bio - shown separately for better layout */}
        {profile?.bio && (
          <p className="md:hidden text-xs text-muted-foreground mb-3 line-clamp-2">
            {profile.bio}
          </p>
        )}

        {/* Profile Header Card */}
        <Card className="mb-3 md:mb-6">
          <CardContent className="p-3 md:p-6">
            <ProfileHeader
              profile={profile}
              email={user?.email}
              followerCount={followerCount}
              followingCount={followingCount}
              postsCount={postsCount}
              onAvatarClick={() => setAvatarOpen(true)}
              onEditClick={() => setSettingsOpen(true)}
              onFollowersClick={() => setFollowersOpen(true)}
              onFollowingClick={() => setFollowingOpen(true)}
              onPostsClick={() => setPostsOpen(true)}
            />
          </CardContent>
        </Card>

        {/* Follow Requests - only for private profiles */}
        {isPrivateProfile && pendingRequests.length > 0 && (
          <Button
            variant="outline"
            className="w-full mb-3 md:mb-6 gap-2 justify-center"
            onClick={() => setRequestsOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            {pendingRequests.length} väntande följförfrågan{pendingRequests.length > 1 ? 'or' : ''}
          </Button>
        )}
        {/* Stats */}
        <div className="mb-3 md:mb-6">
          <ProfileStats
            stanceStats={stanceStats}
            boycottsCreated={boycotts.filter(b => b.organizer_id === user?.id).length}
            boycottsJoined={boycotts.filter(b => joinedBoycottIds.includes(b.id) && b.organizer_id !== user?.id).length}
            onStatClick={(tab) => {
              if (tab.startsWith("boycotts:")) {
                setActiveTab("boycotts");
                setBoycottSubTab(tab.split(":")[1]);
              } else {
                setActiveTab(tab);
                setBoycottSubTab(undefined);
              }
            }}
          />
        </div>

        {/* Content Tabs */}
        <ProfileContent
          userId={user?.id}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          showPosts={true}
        />
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
      
      <FollowRequestsDialog
        open={requestsOpen}
        onOpenChange={setRequestsOpen}
        userId={user?.id}
      />
    </div>
  );
};

export default Profile;
