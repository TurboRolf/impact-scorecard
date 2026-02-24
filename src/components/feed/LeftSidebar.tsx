import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, User, Building2, AlertTriangle, Users, TrendingUp, Bookmark } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { useLocation } from "react-router-dom";

const LeftSidebar = () => {
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const location = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Feed" },
    { path: "/companies", icon: Building2, label: "Companies" },
    { path: "/boycotts", icon: AlertTriangle, label: "Boycotts" },
    { path: "/creators", icon: Users, label: "Creators" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <div className="sticky top-20 space-y-4">
      {/* Profile card */}
      {user && profile && (
        <Card className="overflow-hidden">
          <div className="h-16 bg-gradient-brand" />
          <CardContent className="p-4 -mt-8">
            <Link to="/profile" className="block">
              <Avatar className="h-14 w-14 border-4 border-card mb-2">
                <AvatarImage src={profile.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.username}`} />
                <AvatarFallback>{(profile.display_name || profile.username || "U").charAt(0)}</AvatarFallback>
              </Avatar>
              <h3 className="font-semibold text-sm truncate">{profile.display_name || profile.username}</h3>
              <p className="text-xs text-muted-foreground truncate">@{profile.username}</p>
            </Link>
            {profile.bio && (
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{profile.bio}</p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <Card>
        <CardContent className="p-2">
          <nav className="space-y-0.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start gap-3 h-10 text-sm font-medium"
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Quick stats */}
      {!user && (
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-sm text-muted-foreground mb-3">Gå med i EthiCheck och gör din röst hörd</p>
            <Link to="/auth">
              <Button className="w-full bg-gradient-brand text-primary-foreground" size="sm">
                Skapa konto
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeftSidebar;
