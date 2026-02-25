import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { MoreVertical, Trash2, XCircle } from "lucide-react";
import { useDeleteBoycott, useDeactivateBoycott } from "@/hooks/useBoycotts";
import { useToast } from "@/hooks/use-toast";

interface BoycottManageMenuProps {
  boycottId: string;
  boycottTitle: string;
  isOrganizer: boolean;
  status: string;
}

export const BoycottManageMenu = ({ 
  boycottId, 
  boycottTitle, 
  isOrganizer,
  status 
}: BoycottManageMenuProps) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deactivateDialogOpen, setDeactivateDialogOpen] = useState(false);
  const [deactivateReason, setDeactivateReason] = useState("");
  const deleteBoycott = useDeleteBoycott();
  const deactivateBoycott = useDeactivateBoycott();
  const { toast } = useToast();

  if (!isOrganizer) return null;

  const handleDelete = async () => {
    try {
      await deleteBoycott.mutateAsync(boycottId);
      toast({
        title: "Boycott deleted",
        description: "The boycott has been permanently deleted.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeleteDialogOpen(false);
  };

  const handleDeactivate = async () => {
    try {
      await deactivateBoycott.mutateAsync({ boycottId, reason: deactivateReason.trim() || undefined });
      toast({
        title: "Boycott deactivated",
        description: "The boycott has been deactivated and marked as inactive.",
      });
      setDeactivateReason("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
    setDeactivateDialogOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {status === 'active' && (
            <DropdownMenuItem 
              onClick={() => setDeactivateDialogOpen(true)}
              className="gap-2"
            >
              <XCircle className="h-4 w-4" />
              Deactivate
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => setDeleteDialogOpen(true)}
            className="gap-2 text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete boycott?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete "{boycottTitle}"? 
              This action cannot be undone and will remove all participant data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteBoycott.isPending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={deactivateDialogOpen} onOpenChange={(open) => {
        setDeactivateDialogOpen(open);
        if (!open) setDeactivateReason("");
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Deactivate boycott?</DialogTitle>
            <DialogDescription>
              Are you sure you want to deactivate "{boycottTitle}"? 
              The boycott will remain visible but marked as inactive. Users will no longer be able to join.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="deactivate-reason">Reason for deactivation (optional)</Label>
            <Textarea
              id="deactivate-reason"
              placeholder="e.g. The company has addressed our concerns..."
              value={deactivateReason}
              onChange={(e) => setDeactivateReason(e.target.value)}
              maxLength={500}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeactivateDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDeactivate} disabled={deactivateBoycott.isPending}>
              {deactivateBoycott.isPending ? "Deactivating..." : "Deactivate"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
