import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, Lock, Eye, EyeOff } from "lucide-react";

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
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    display_name: profile?.display_name || "",
    username: profile?.username || "",
    bio: profile?.bio || "",
    profile_type: profile?.profile_type || 'user' as 'user' | 'creator'
  });

  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Update form data when profile loads
  useEffect(() => {
    if (profile) {
      setFormData({
        display_name: profile.display_name || "",
        username: profile.username || "",
        bio: profile.bio || "",
        profile_type: profile.profile_type || 'user'
      });
    }
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile.mutateAsync(formData);
    toast({
      title: "Profil uppdaterad",
      description: "Dina ändringar har sparats."
    });
    onOpenChange(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Lösenorden matchar inte",
        description: "Kontrollera att båda lösenorden är identiska.",
        variant: "destructive"
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Lösenordet är för kort",
        description: "Lösenordet måste vara minst 6 tecken.",
        variant: "destructive"
      });
      return;
    }

    setIsChangingPassword(true);
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Lösenord uppdaterat",
        description: "Ditt lösenord har ändrats."
      });
      
      setPasswordData({ newPassword: "", confirmPassword: "" });
    } catch (error: any) {
      toast({
        title: "Kunde inte ändra lösenord",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profilinställningar</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile" className="gap-2">
              <User className="h-4 w-4" />
              Profil
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Säkerhet
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="display_name">Visningsnamn</Label>
                  <Input
                    id="display_name"
                    value={formData.display_name}
                    onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                    placeholder="Ditt visningsnamn"
                  />
                </div>
                <div>
                  <Label htmlFor="username">Användarnamn</Label>
                  <Input
                    id="username"
                    value={formData.username}
                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="@användarnamn"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Berätta lite om dig själv..."
                  rows={3}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-base font-medium">Profiltyp</Label>
                <RadioGroup
                  value={formData.profile_type}
                  onValueChange={(value: 'user' | 'creator') => 
                    setFormData({ ...formData, profile_type: value })
                  }
                  className="space-y-3"
                >
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="user" id="user" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="user" className="font-medium text-sm">Vanlig användare</Label>
                      <p className="text-xs text-muted-foreground">
                        Följ kreatörer, betygsätt företag och gå med i bojkotter.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 p-3 border rounded-lg">
                    <RadioGroupItem value="creator" id="creator" className="mt-1" />
                    <div className="space-y-1">
                      <Label htmlFor="creator" className="font-medium text-sm">Kreatör</Label>
                      <p className="text-xs text-muted-foreground">
                        Skapa innehåll, bygg en följarskara och påverka konsumentval.
                      </p>
                    </div>
                  </div>
                </RadioGroup>
                
                {formData.profile_type === 'creator' && (
                  <div className="p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-brand-accent" />
                      <span className="text-sm font-medium">Kreatörsfördelar</span>
                    </div>
                    <ul className="text-xs text-muted-foreground mt-2 space-y-1">
                      <li>• Kreatörsmärke på din profil</li>
                      <li>• Syns i kreatörskatalogen</li>
                      <li>• Tillgång till kreatörsanalys</li>
                    </ul>
                  </div>
                )}
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Avbryt
                </Button>
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? "Sparar..." : "Spara ändringar"}
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="security" className="mt-4">
            <form onSubmit={handlePasswordChange} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Nytt lösenord</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                      placeholder="Ange nytt lösenord"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="confirmPassword">Bekräfta lösenord</Label>
                  <Input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    placeholder="Bekräfta nytt lösenord"
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  Lösenordet måste vara minst 6 tecken långt.
                </p>
              </div>

              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Avbryt
                </Button>
                <Button 
                  type="submit" 
                  disabled={isChangingPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {isChangingPassword ? "Ändrar..." : "Ändra lösenord"}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileSettingsDialog;
