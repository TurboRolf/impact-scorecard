import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Building2, AlertTriangle, Users, Search, LogOut } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser, Session } from "@supabase/supabase-js";

const Navigation = () => {
  const location = useLocation();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };
  
  const navItems = [
    { path: "/", icon: Home, label: "Feed" },
    { path: "/profile", icon: User, label: "Profile" },
    { path: "/companies", icon: Building2, label: "Companies" },
    { path: "/boycotts", icon: AlertTriangle, label: "Boycotts" },
    { path: "/creators", icon: Users, label: "Creators" },
  ];

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-xl md:text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
              EthiCheck
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button 
                      variant={isActive ? "default" : "ghost"} 
                      size="sm"
                      className="gap-2"
                    >
                      <item.icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <Search className="h-4 w-4" />
              </Button>
              {user ? (
                <Button variant="outline" size="sm" onClick={handleSignOut} className="gap-1">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    <span className="hidden sm:inline">Join EthiCheck</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="grid grid-cols-5 gap-1 px-2 py-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex flex-col items-center justify-center">
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm"
                  className="h-12 w-full flex-col gap-1 px-1"
                >
                  <item.icon className="h-4 w-4" />
                  <span className="text-xs leading-none">{item.label}</span>
                </Button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
};

export default Navigation;