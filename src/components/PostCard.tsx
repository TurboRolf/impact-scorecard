import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share, Star, AlertTriangle, UserPlus, UserCheck, Users, Check, Send } from "lucide-react";
import { useJoinBoycott, useLeaveBoycott, useUserBoycottParticipation } from "@/hooks/useBoycotts";
import { useFollows, useFollowUser, useUnfollowUser } from "@/hooks/useFollows";
import { usePostLikes, useToggleLike, usePostComments, useCreateComment } from "@/hooks/usePostInteractions";
import { useToast } from "@/hooks/use-toast";

interface PostCardProps {
  postId?: string;
  user: {
    name: string;
    username: string;
    avatar?: string;
    isCreator?: boolean;
    id?: string;
  };
  content: string;
  company?: {
    name: string;
    rating: number;
    category: string;
  };
  boycott?: {
    id?: string;
    title: string;
    company: string;
    subject: string;
    participants_count: number;
    category?: string;
    condition?: string | null;
    status?: string | null;
    deactivation_reason?: string | null;
  };
  isBoycott?: boolean;
  timestamp: string;
  likes: number;
  comments: number;
  currentUserId?: string;
}

const PostCard = ({ postId, user, content, company, boycott, isBoycott, timestamp, likes, comments, currentUserId }: PostCardProps) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const navigate = useNavigate();

  const joinBoycott = useJoinBoycott();
  const leaveBoycott = useLeaveBoycott();
  const { data: joinedBoycotts = [] } = useUserBoycottParticipation(currentUserId);
  const { data: following = [] } = useFollows(currentUserId);
  const followUser = useFollowUser();
  const unfollowUser = useUnfollowUser();
  const { toast } = useToast();

  // Like & comment hooks
  const { data: likedPosts = [] } = usePostLikes(currentUserId);
  const toggleLike = useToggleLike();
  const { data: postComments = [] } = usePostComments(showComments ? postId : undefined);
  const createComment = useCreateComment();

  const isLiked = postId ? likedPosts.includes(postId) : false;
  const isFollowing = user.id ? following.includes(user.id) : false;
  const isOwnPost = user.id === currentUserId;
  const isJoined = boycott?.id ? joinedBoycotts.includes(boycott.id) : false;
  
  const handleLike = () => {
    if (!currentUserId) {
      toast({ title: "Login required", description: "You need to be logged in to like posts", variant: "destructive" });
      return;
    }
    if (!postId) return;
    toggleLike.mutate({ postId, liked: isLiked });
  };

  const handleComment = () => {
    setShowComments(!showComments);
  };

  const handleSubmitComment = () => {
    if (!commentText.trim() || !postId || !currentUserId) return;
    createComment.mutate({ postId, content: commentText.trim() }, {
      onSuccess: () => setCommentText(""),
    });
  };

  const handleShare = async () => {
    const url = window.location.origin;
    const text = `Check out this post by @${user.username}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "EthiCheck Post", text, url });
      } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${text} - ${url}`);
      toast({ title: "Link copied", description: "Post link copied to clipboard" });
    }
  };

  const handleJoinBoycott = () => {
    if (!currentUserId) {
      toast({ title: "Login required", description: "You need to be logged in to join a boycott", variant: "destructive" });
      return;
    }
    if (boycott?.id) {
      joinBoycott.mutate(boycott.id, {
        onSuccess: () => { toast({ title: "Joined boycott", description: "You have successfully joined this boycott!" }); },
        onError: (error: any) => { toast({ title: "Error", description: error.message, variant: "destructive" }); }
      });
    }
  };

  const handleLeaveBoycott = () => {
    if (boycott?.id) {
      leaveBoycott.mutate(boycott.id, {
        onSuccess: () => { toast({ title: "Left boycott", description: "You have left this boycott" }); }
      });
    }
  };

  const handleFollowToggle = () => {
    if (!user.id || !currentUserId) return;
    if (isFollowing) { unfollowUser.mutate(user.id); } else { followUser.mutate({ followingId: user.id, isPrivate: false }); }
  };

  return (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader className="pb-2 md:pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 md:gap-3 flex-1 min-w-0 cursor-pointer" onClick={() => user.id && navigate(isOwnPost ? '/profile' : `/user/${user.id}`)}>
            <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 md:gap-2 flex-wrap">
                <span className="font-semibold text-sm md:text-base truncate hover:underline">{user.name}</span>
                {user.isCreator && (
                  <Badge variant="secondary" className="text-xs px-1.5 md:px-2">Creator</Badge>
                )}
                {isBoycott && (
                  <Badge variant="destructive" className="text-xs gap-0.5 md:gap-1 px-1.5 md:px-2">
                    <AlertTriangle className="h-2.5 w-2.5 md:h-3 md:w-3" />
                    Boycott
                  </Badge>
                )}
              </div>
              <span className="text-xs md:text-sm text-muted-foreground">@{user.username} · {timestamp}</span>
            </div>
          </div>
          
          {currentUserId && user.id && !isOwnPost && (
            <Button
              variant={isFollowing ? "secondary" : "outline"}
              size="sm"
              onClick={handleFollowToggle}
              disabled={followUser.isPending || unfollowUser.isPending}
              className="gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm flex-shrink-0"
            >
              {isFollowing ? (
                <><UserCheck className="h-3 w-3 md:h-4 md:w-4" /><span className="hidden sm:inline">Following</span></>
              ) : (
                <><UserPlus className="h-3 w-3 md:h-4 md:w-4" /><span className="hidden sm:inline">Follow</span></>
              )}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
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
                    <Star key={i} className={`h-3 w-3 md:h-4 md:w-4 ${i < company.rating ? "text-earth-orange fill-current" : "text-muted-foreground"}`} />
                  ))}
                  <span className="ml-0.5 md:ml-1 text-xs md:text-sm font-medium">{company.rating}/5</span>
                </div>
              </div>
              {content && <p className="text-foreground mt-2 pt-2 md:mt-3 md:pt-3 border-t text-sm md:text-base">{content}</p>}
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
                  {boycott.category && <p className="text-xs md:text-sm text-muted-foreground truncate">{boycott.category}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground mb-2 md:mb-3">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 md:h-4 md:w-4" />
                  <span>{boycott.participants_count} participants</span>
                </div>
              </div>
              {content && <p className="text-foreground mt-2 pt-2 md:mt-3 md:pt-3 border-t text-sm md:text-base">{content}</p>}
              {boycott.id && (
                <div className="mt-2 pt-2 md:mt-3 md:pt-3 border-t">
                  {isJoined ? (
                    <Button variant="secondary" size="sm" onClick={handleLeaveBoycott} disabled={leaveBoycott.isPending} className="gap-1 px-3 md:px-4 h-7 md:h-8 text-xs md:text-sm">
                      <Check className="h-3 w-3 md:h-4 md:w-4" />
                      {leaveBoycott.isPending ? "Leaving..." : "Joined"}
                    </Button>
                  ) : (
                    <Button variant="boycott" size="sm" onClick={handleJoinBoycott} disabled={joinBoycott.isPending} className="px-3 md:px-4 h-7 md:h-8 text-xs md:text-sm">
                      {joinBoycott.isPending ? "Joining..." : "Join Boycott"}
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        )}
        
        {/* Action buttons */}
        <div className="flex items-center gap-2 md:gap-4 text-muted-foreground">
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${isLiked ? "text-red-500" : "hover:text-red-500"}`}
            onClick={handleLike}
            disabled={toggleLike.isPending}
          >
            <Heart className={`h-3.5 w-3.5 md:h-4 md:w-4 ${isLiked ? "fill-current" : ""}`} />
            {likes}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={`gap-1 md:gap-2 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm ${showComments ? "text-blue-500" : "hover:text-blue-500"}`}
            onClick={handleComment}
          >
            <MessageCircle className={`h-3.5 w-3.5 md:h-4 md:w-4 ${showComments ? "fill-current" : ""}`} />
            {comments}
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="gap-1 md:gap-2 hover:text-green-500 h-7 md:h-8 px-2 md:px-3 text-xs md:text-sm"
            onClick={handleShare}
          >
            <Share className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </Button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-3 pt-3 border-t space-y-3">
            {postComments.map((comment) => (
              <div key={comment.id} className="flex gap-2">
                <Avatar className="h-6 w-6 flex-shrink-0">
                  <AvatarFallback className="text-[10px]">
                    {(comment.profiles?.display_name || comment.profiles?.username || "?").charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-medium">{comment.profiles?.display_name || comment.profiles?.username || "User"}</span>
                  <p className="text-xs text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))}
            
            {currentUserId && (
              <div className="flex gap-2">
                <Input
                  placeholder="Write a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSubmitComment()}
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim() || createComment.isPending}
                  className="h-8 w-8 p-0 flex-shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PostCard;
