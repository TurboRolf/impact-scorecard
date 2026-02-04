import React, { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Camera, Upload, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface AvatarUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
  currentAvatarUrl?: string | null;
  username?: string | null;
  displayName?: string | null;
}

const AvatarUploadDialog = ({
  open,
  onOpenChange,
  userId,
  currentAvatarUrl,
  username,
  displayName
}: AvatarUploadDialogProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      toast({
        title: "Ogiltigt filformat",
        description: "Endast JPG, PNG och WEBP är tillåtna.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Filen är för stor",
        description: "Max filstorlek är 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile || !userId) return;

    setIsUploading(true);
    setUploadProgress(10);

    try {
      // Generate unique filename
      const fileExt = selectedFile.name.split('.').pop();
      const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;

      setUploadProgress(30);

      // Delete old avatar if exists
      if (currentAvatarUrl) {
        const oldPath = currentAvatarUrl.split('/avatars/')[1];
        if (oldPath) {
          await supabase.storage.from('avatars').remove([oldPath]);
        }
      }

      setUploadProgress(50);

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: true
        });

      if (uploadError) throw uploadError;

      setUploadProgress(70);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      setUploadProgress(85);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      setUploadProgress(100);

      // Invalidate profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });

      toast({
        title: "Profilbild uppdaterad",
        description: "Din nya profilbild har sparats.",
      });

      // Reset and close
      handleClose();
    } catch (error: any) {
      console.error('Upload error:', error);
      toast({
        title: "Uppladdning misslyckades",
        description: error.message || "Kunde inte ladda upp bilden.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUploadProgress(0);
    onOpenChange(false);
  };

  const getFallbackUrl = () => {
    if (username) {
      return `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`;
    }
    return undefined;
  };

  const displayUrl = previewUrl || currentAvatarUrl || getFallbackUrl();

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            Ändra profilbild
          </DialogTitle>
          <DialogDescription>
            Ladda upp en ny profilbild. Max 5MB, JPG/PNG/WEBP.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Preview */}
          <div className="relative">
            <Avatar className="h-32 w-32 border-4 border-muted">
              <AvatarImage src={displayUrl} />
              <AvatarFallback className="text-3xl">
                {displayName?.charAt(0) || username?.charAt(0) || 'U'}
              </AvatarFallback>
            </Avatar>
            {previewUrl && (
              <button
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                }}
                className="absolute -top-2 -right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />

          {/* Upload progress */}
          {isUploading && (
            <div className="w-full space-y-2">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">
                Laddar upp... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Select file button */}
          {!isUploading && (
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2"
            >
              <Upload className="h-4 w-4" />
              Välj bild
            </Button>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleClose} disabled={isUploading}>
            Avbryt
          </Button>
          <Button
            variant="earth"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Sparar..." : "Spara"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AvatarUploadDialog;
