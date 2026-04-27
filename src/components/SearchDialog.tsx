import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Building2, Users, AlertTriangle, User } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanyStances";
import { useAllProfiles } from "@/hooks/useProfile";
import { useBoycotts } from "@/hooks/useBoycotts";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: companies } = useCompanies();
  const { data: profiles } = useAllProfiles();
  const { data: boycotts } = useBoycotts();

  const filteredCompanies = companies?.filter(company =>
    company.name.toLowerCase().includes(query.toLowerCase()) ||
    company.category.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 5) || [];

  const filteredUsers = profiles?.filter(profile =>
    profile.display_name?.toLowerCase().includes(query.toLowerCase()) ||
    profile.username?.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8) || [];

  const filteredBoycotts = boycotts?.filter(boycott =>
    boycott.title.toLowerCase().includes(query.toLowerCase()) ||
    boycott.company.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 3) || [];

  const handleCompanyClick = (companyId: string) => {
    navigate(`/company/${companyId}`);
    onOpenChange(false);
    setQuery("");
  };

  const handleUserClick = (profileUserId: string) => {
    if (user?.id === profileUserId) {
      navigate("/profile");
    } else {
      navigate(`/user/${profileUserId}`);
    }
    onOpenChange(false);
    setQuery("");
  };

  const handleBoycottClick = () => {
    navigate("/boycotts");
    onOpenChange(false);
    setQuery("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Search EthiCheck
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Search companies, users, or boycotts..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex-1"
              autoFocus
            />
            <div className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
              <span>⌘K</span>
            </div>
          </div>
          
          {query && (
            <div className="space-y-4">
              {/* Companies */}
              {filteredCompanies.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Companies
                  </h3>
                  <div className="space-y-2">
                    {filteredCompanies.map((company) => (
                      <Card 
                        key={company.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleCompanyClick(company.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-subtle rounded-lg flex items-center justify-center">
                              {company.logo_url ? (
                                <img src={company.logo_url} alt={company.name} className="w-6 h-6 object-contain" />
                              ) : (
                                <span className="text-sm font-bold">{company.name.charAt(0)}</span>
                              )}
                            </div>
                            <div>
                              <div className="font-medium">{company.name}</div>
                              <div className="text-sm text-muted-foreground">{company.category}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {filteredUsers.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Users
                  </h3>
                  <div className="space-y-2">
                    {filteredUsers.map((profile) => (
                      <Card 
                        key={profile.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleUserClick(profile.user_id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-subtle rounded-full flex items-center justify-center overflow-hidden">
                              {profile.avatar_url ? (
                                <img src={profile.avatar_url} alt={profile.username || ""} className="w-full h-full object-cover" />
                              ) : (
                                <User className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-medium flex items-center gap-2">
                                {profile.display_name || profile.username}
                                {profile.profile_type === "creator" && (
                                  <span className="text-[10px] uppercase tracking-wide bg-primary/10 text-primary px-1.5 py-0.5 rounded">Creator</span>
                                )}
                              </div>
                              <div className="text-sm text-muted-foreground">@{profile.username}</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Boycotts */}
              {filteredBoycotts.length > 0 && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" />
                    Boycotts
                  </h3>
                  <div className="space-y-2">
                    {filteredBoycotts.map((boycott) => (
                      <Card 
                        key={boycott.id}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={handleBoycottClick}
                      >
                        <CardContent className="p-3">
                          <div className="font-medium">{boycott.title}</div>
                          <div className="text-sm text-muted-foreground">Against {boycott.company}</div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {filteredCompanies.length === 0 && filteredUsers.length === 0 && filteredBoycotts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}
            </div>
          )}
          
          {!query && (
            <div className="text-center py-8 text-muted-foreground">
              Start typing to search for companies, users, or boycotts
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;