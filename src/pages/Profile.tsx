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
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useUserStances } from "@/hooks/useCompanyStances";
import { useProfile } from "@/hooks/useProfile";
import { useFollowerCount, useFollowingCount, usePostsCount } from "@/hooks/useFollowCounts";
import { useAuth } from "@/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

const Profile = () => {
  const { user } = useAuth();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [followersOpen, setFollowersOpen] = useState(false);
  const [followingOpen, setFollowingOpen] = useState(false);
  const [postsOpen, setPostsOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const navigate = useNavigate();
  useDocumentTitle("Profile");

  const { data: userStances = [] } = useUserStances(user?.id);
  const { data: profile } = useProfile(user?.id);
  const { data: followerCount = 0 } = useFollowerCount(user?.id);
  const { data: followingCount = 0 } = useFollowingCount(user?.id);
  const { data: postsCount = 0 } = usePostsCount(user?.id);

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

        {/* Stats */}
        <div className="mb-3 md:mb-6">
          <ProfileStats
            stanceStats={stanceStats}
            boycottsCreated={0}
            boycottsJoined={0}
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
    </div>
  );
};

export default Profile;
