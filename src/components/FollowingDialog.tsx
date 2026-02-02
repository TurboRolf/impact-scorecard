import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useFollowing } from "@/hooks/useFollowCounts";
import { Loader2, UserCheck } from "lucide-react";

interface FollowingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

const FollowingDialog = ({ open, onOpenChange, userId }: FollowingDialogProps) => {
  const { data: following = [], isLoading } = useFollowing(userId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Following ({following.length})
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px]">
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : following.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Not following anyone yet
            </div>
          ) : (
            <div className="space-y-3">
              {following.map((profile) => (
                <div key={profile.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={profile.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}` : undefined} />
                    <AvatarFallback>
                      {profile.display_name?.charAt(0) || profile.username?.charAt(0) || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium truncate">
                        {profile.display_name || profile.username || 'User'}
                      </span>
                      {profile.profile_type === 'creator' && (
                        <Badge variant="secondary" className="text-xs">Creator</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      @{profile.username || 'username'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default FollowingDialog;
