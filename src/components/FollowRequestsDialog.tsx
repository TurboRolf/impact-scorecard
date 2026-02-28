import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import { usePendingFollowRequests, useAcceptFollowRequest, useRejectFollowRequest } from "@/hooks/useFollows";
import { useNavigate } from "react-router-dom";

interface FollowRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

const FollowRequestsDialog = ({ open, onOpenChange, userId }: FollowRequestsDialogProps) => {
  const { data: requests = [], isLoading } = usePendingFollowRequests(userId);
  const acceptRequest = useAcceptFollowRequest();
  const rejectRequest = useRejectFollowRequest();
  const navigate = useNavigate();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Följförfrågningar</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <p className="text-sm text-muted-foreground text-center py-4">Laddar...</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">Inga väntande förfrågningar</p>
          ) : (
            requests.map((request) => (
              <div key={request.id} className="flex items-center gap-3">
                <button
                  onClick={() => { onOpenChange(false); navigate(`/user/${request.follower_id}`); }}
                  className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-70 transition-opacity"
                >
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarImage src={request.profile?.avatar_url || (request.profile?.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${request.profile.username}` : undefined)} />
                    <AvatarFallback className="text-xs">
                      {request.profile?.display_name?.charAt(0) || request.profile?.username?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{request.profile?.display_name || request.profile?.username || 'User'}</p>
                    <p className="text-xs text-muted-foreground truncate">@{request.profile?.username || 'unknown'}</p>
                  </div>
                </button>
                <div className="flex gap-1.5 flex-shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    className="h-7 w-7 p-0"
                    onClick={() => acceptRequest.mutate(request.id)}
                    disabled={acceptRequest.isPending}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 w-7 p-0"
                    onClick={() => rejectRequest.mutate(request.id)}
                    disabled={rejectRequest.isPending}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FollowRequestsDialog;
