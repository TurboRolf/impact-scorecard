import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
      await deactivateBoycott.mutateAsync(boycottId);
      toast({
        title: "Boycott deactivated",
        description: "The boycott has been deactivated and marked as inactive.",
      });
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

      <AlertDialog open={deactivateDialogOpen} onOpenChange={setDeactivateDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate boycott?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to deactivate "{boycottTitle}"? 
              The boycott will remain visible but marked as inactive. Users will no longer be able to join.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeactivate}>
              {deactivateBoycott.isPending ? "Deactivating..." : "Deactivate"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
