import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { User } from "lucide-react";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: string;
}

const ProfileSettingsDialog = ({
  open,
  onOpenChange,
  userId
}: ProfileSettingsDialogProps) => {
  const { data: profile } = useProfile(userId);
  const updateProfile = useUpdateProfile();

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    profile_type: profile?.profile_type || 'user' as 'user' | 'creator'
  });

  // Update form data when profile loads
  useState(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        profile_type: profile.profile_type || 'user'
      });
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profile Settings</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="display_name">Display Name</Label>
              <Input
                id="display_name"
                value={formData.display_name}
                onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                placeholder="Your display name"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="@username"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <Label className="text-base font-medium">Profile Type</Label>
            <RadioGroup
              value={formData.profile_type}
              onValueChange={(value: 'user' | 'creator') => 
                setFormData({ ...formData, profile_type: value })
              }
              className="space-y-4"
            >
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="user" id="user" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="user" className="font-medium">Regular User</Label>
                  <p className="text-sm text-muted-foreground">
                    Follow creators, rate companies, join boycotts, and share your consumer choices.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3 p-4 border rounded-lg">
                <RadioGroupItem value="creator" id="creator" className="mt-1" />
                <div className="space-y-1">
                  <Label htmlFor="creator" className="font-medium">Creator</Label>
                  <p className="text-sm text-muted-foreground">
                    Create in-depth content, build a following, and influence consumer choices through detailed research and reviews.
                  </p>
                </div>
              </div>
            </RadioGroup>
            
            {formData.profile_type === 'creator' && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-brand-accent" />
                  <span className="text-sm font-medium">Creator Benefits</span>
                </div>
                <ul className="text-sm text-muted-foreground mt-2 space-y-1">
                  <li>• Creator badge on your profile</li>
                  <li>• Appear in the Creators directory</li>
                  <li>• Access to creator analytics</li>
                  <li>• Enhanced content creation tools</li>
                </ul>
              </div>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProfile.isPending}>
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;