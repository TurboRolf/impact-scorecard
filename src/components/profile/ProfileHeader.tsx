import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Camera, Edit } from "lucide-react";

interface ProfileHeaderProps {
  profile: {
    avatar_url?: string | null;
    username?: string | null;
    display_name?: string | null;
    bio?: string | null;
    profile_type?: string | null;
  } | null;
  email?: string;
  followerCount: number;
  followingCount: number;
  postsCount: number;
  onAvatarClick: () => void;
  onEditClick: () => void;
  onFollowersClick: () => void;
  onFollowingClick: () => void;
  onPostsClick: () => void;
}

const ProfileHeader = ({
  profile,
  email,
  followerCount,
  followingCount,
  postsCount,
  onAvatarClick,
  onEditClick,
  onFollowersClick,
  onFollowingClick,
  onPostsClick,
}: ProfileHeaderProps) => {
  const avatarUrl = profile?.avatar_url || 
    (profile?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}` : undefined);
  
  const displayName = profile?.display_name || profile?.username || email || 'Loading...';
  const initials = profile?.display_name?.charAt(0) || profile?.username?.charAt(0) || 'U';

  return (
    <div className="flex gap-3 md:gap-6">
      {/* Avatar - smaller on mobile */}
      <button
        onClick={onAvatarClick}
        className="relative group cursor-pointer flex-shrink-0"
        aria-label="Ändra profilbild"
      >
        <Avatar className="h-14 w-14 md:h-24 md:w-24 transition-opacity group-hover:opacity-80">
          <AvatarImage src={avatarUrl} />
          <AvatarFallback className="text-base md:text-2xl">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          <Camera className="h-4 w-4 md:h-6 md:w-6 text-white" />
        </div>
      </button>
      
      {/* Info section */}
      <div className="flex-1 min-w-0">
        {/* Name and badge - inline on mobile */}
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-base md:text-2xl font-bold truncate">
            {displayName}
          </h1>
          {profile?.profile_type === 'creator' && (
            <Badge className="bg-gradient-earth text-white text-[10px] md:text-xs px-1.5 py-0">
              Creator
            </Badge>
          )}
        </div>
        
        {/* Username */}
        <p className="text-xs md:text-base text-muted-foreground mb-1 md:mb-3">
          @{profile?.username || 'username'}
        </p>
        
        {/* Bio - hidden on mobile, shown below on desktop */}
        <p className="hidden md:block text-base text-foreground mb-4 line-clamp-2">
          {profile?.bio || 'No bio provided yet.'}
        </p>
        
        {/* Stats - compact inline on mobile */}
        <div className="flex gap-4 md:gap-6 mb-2 md:mb-4">
          <button 
            onClick={onFollowersClick}
            className="hover:opacity-70 transition-opacity"
          >
            <span className="text-sm md:text-base font-bold">{followerCount}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground ml-1">followers</span>
          </button>
          <button 
            onClick={onFollowingClick}
            className="hover:opacity-70 transition-opacity"
          >
            <span className="text-sm md:text-base font-bold">{followingCount}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground ml-1">following</span>
          </button>
          <button 
            onClick={onPostsClick}
            className="hover:opacity-70 transition-opacity"
          >
            <span className="text-sm md:text-base font-bold">{postsCount}</span>
            <span className="text-[10px] md:text-sm text-muted-foreground ml-1">posts</span>
          </button>
        </div>
        
        {/* Edit button - smaller on mobile */}
        <Button 
          variant="earth" 
          size="sm"
          className="gap-1.5 text-xs md:text-sm h-7 md:h-9 px-2.5 md:px-4"
          onClick={onEditClick}
        >
          <Edit className="h-3 w-3 md:h-4 md:w-4" />
          Edit Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileHeader;
