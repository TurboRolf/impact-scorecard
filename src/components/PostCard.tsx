import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Star, AlertTriangle, UserPlus, UserCheck, Users } from "lucide-react";
import { useJoinBoycott } from "@/hooks/useBoycotts";
import { useFollows, useFollowUser, useUnfollowUser } from "@/hooks/useFollows";

interface PostCardProps {
  user: {
    name: string;
    username: string;
    avatar?: string;
    isCreator?: boolean;
    id?: string; // Add user ID for following functionality
  };
  content: string;
  company?: {
    name: string;
    rating: number;
    category: string;
  };
  boycott?: {
    title: string;
    company: string;
    subject: string;
    impact: 'low' | 'medium' | 'high' | 'very-high';
    participants_count: number;
    category?: string;
  };
  isBoycott?: boolean;
  timestamp: string;
  likes: number;
  comments: number;
  currentUserId?: string;
}

const PostCard = ({ user, content, company, boycott, isBoycott, timestamp, likes, comments, currentUserId }: PostCardProps) => {
  const joinBoycott = useJoinBoycott();
  const { data: following = [] } = useFollows(currentUserId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  
  const isFollowing = user.id ? following.includes(user.id) : false;
  const isOwnPost = user.id === currentUserId;
  
  const handleJoinBoycott = () => {
    if (boycott) {
      // Generate a consistent boycott ID based on the boycott title and company
      const boycottId = `${boycott.title.toLowerCase().replace(/\s+/g, '-')}-${boycott.company.toLowerCase().replace(/\s+/g, '-')}`;
      joinBoycott.mutate(boycottId);
    }
  };

  const handleFollowToggle = () => {
    if (!user.id || !currentUserId) return;
    
    if (isFollowing) {
      unfollowUser.mutate(user.id);
    } else {
      followUser.mutate(user.id);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'very-high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'very-high':
        return 'Very High';
      default:
        return impact.charAt(0).toUpperCase() + impact.slice(1);
    }
  };
  return (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0">
            <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="font-semibold text-sm md:text-base truncate">{user.name}</span>
                {user.isCreator && (
                  <Badge variant="secondary" className="text-[10px] md:text-xs px-1.5 md:px-2">
                    Creator
                  </Badge>
                )}
                {isBoycott && (
                  <Badge variant="destructive" className="text-[10px] md:text-xs gap-0.5 md:gap-1 px-1.5 md:px-2">
                    <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    Boycott
                  </Badge>
                )}
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">@{user.username} · {timestamp}</span>
            </div>
          </div>
          
          {/* Follow button */}
          {currentUserId && user.id && !isOwnPost && (
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              size="sm"
              onClick={handleFollowToggle}
              disabled={followUser.isPending || unfollowUser.isPending}
              className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm flex-shrink-0"
            >
              {isFollowing ? (
                <>
                  <UserCheck className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Following</span>
                </>
              ) : (
                <>
                  <UserPlus className="h-3 w-3 md:h-4 md:w-4" />
                  <span className="hidden sm:inline">Follow</span>
                </>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      
      <CardContent className="pt-0">
        {/* Regular post content */}
        {!company && !boycott && <p className="text-foreground mb-3 md:mb-4 text-sm md:text-base">{content}</p>}
        
        {/* Company review card */}
        {company && (
          <Card className="bg-muted/50 border-0 mb-3 md:mb-4">
            <CardContent className="p-2.5 md:p-4">
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <h4 className="font-semibold text-sm md:text-base truncate">{company.name}</h4>
                  <p className="text-xs md:text-sm text-muted-foreground truncate">{company.category}</p>
                </div>
                <div className="flex items-center gap-0.5 md:gap-1 flex-shrink-0">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-3 w-3 md:h-4 md:w-4 ${
                        i < company.rating ? "text-earth-orange fill-current" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-0.5 md:ml-1 text-xs md:text-sm font-medium">{company.rating}/5</span>
                </div>
              </div>
              {content && (
                <p className="text-foreground mt-2 pt-2 md:mt-3 md:pt-3 border-t text-sm md:text-base">{content}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Boycott card */}
        {boycott && (
          <Card className="bg-muted/50 border-0 mb-3 md:mb-4">
            <CardContent className="p-2.5 md:p-4">
              <div className="flex items-start justify-between gap-2 mb-2 md:mb-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
                    <AlertTriangle className="h-3.5 w-3.5 md:h-4 md:w-4 text-destructive flex-shrink-0" />
                    <h4 className="font-semibold text-sm md:text-base line-clamp-2">{boycott.title}</h4>
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground mb-0.5 md:mb-1 truncate">Target: {boycott.company}</p>
                  {boycott.category && (
                    <p className="text-xs md:text-sm text-muted-foreground truncate">{boycott.category}</p>
                  )}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`inline-flex items-center px-1.5 py-0.5 md:px-2 md:py-1 rounded-full text-[10px] md:text-xs font-medium text-white ${getImpactColor(boycott.impact)}`}>
                    <span className="hidden sm:inline">{getImpactText(boycott.impact)} Impact</span>
                    <span className="sm:hidden">{getImpactText(boycott.impact)}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{boycott.participants_count} participants</span>
                </div>
              </div>
              
              {content && (
                <p className="text-foreground mt-2 pt-2 md:mt-3 md:pt-3 border-t text-sm md:text-base">{content}</p>
              )}
              
              <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
                <Button 
                  variant="boycott" 
                  size="sm" 
                  onClick={handleJoinBoycott}
                  disabled={joinBoycott.isPending}
                  className="px-3 md:px-4 h-7 md:h-8 text-xs md:text-sm"
                >
                  {joinBoycott.isPending ? "Joining..." : "Join Boycott"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex items-center gap-2 md:gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2 hover:text-red-500 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm">
            <Heart className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2 hover:text-blue-500 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm">
            <MessageCircle className="h-3.5 w-3.5 md:h-4 md:w-4" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="gap-1 md:gap-2 hover:text-green-500 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm">
            <Share className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;