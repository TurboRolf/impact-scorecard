import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, User, Building2, AlertTriangle, Users, Search, LogOut, Sun, Moon, HelpCircle } from "lucide-react";
import { useEffect, useState } from "react";
import SearchDialog from "./SearchDialog";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/hooks/useTheme";
import NotificationBell from "./NotificationBell";
import logo from "@/assets/ethisay-logo-v4.png";
import logoDark from "@/assets/ethisay-logo-v4-dark.png";

const Navigation = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const [highlightHelp, setHighlightHelp] = useState(false);

  // Highlight the Help button for a short window after a user creates an account,
  // until they click it or the timeout elapses.
  useEffect(() => {
    const HIGHLIGHT_KEY = "ethisay_highlight_help";
    const MAX_AGE_MS = 10 * 60 * 1000; // 10 minutes
    const raw = localStorage.getItem(HIGHLIGHT_KEY);
    if (!raw) return;
    const ts = Number(raw);
    if (!ts || Number.isNaN(ts)) {
      localStorage.removeItem(HIGHLIGHT_KEY);
      return;
    }
    const remaining = ts + MAX_AGE_MS - Date.now();
    if (remaining <= 0) {
      localStorage.removeItem(HIGHLIGHT_KEY);
      return;
    }
    setHighlightHelp(true);
    const timer = window.setTimeout(() => {
      setHighlightHelp(false);
      localStorage.removeItem(HIGHLIGHT_KEY);
    }, remaining);
    return () => window.clearTimeout(timer);
  }, []);

  const dismissHelpHighlight = () => {
    if (!highlightHelp) return;
    setHighlightHelp(false);
    localStorage.removeItem("ethisay_highlight_help");
  };

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);
  
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
            <Link to="/" className="flex items-center" aria-label="Ethisay home">
              <img src={logo} alt="Ethisay" className="h-6 md:h-7 w-auto -my-1 block dark:hidden" />
              <img src={logoDark} alt="Ethisay" className="h-6 md:h-7 w-auto -my-1 hidden dark:block" />
            </Link>
            
            <div className="hidden md:flex items-center space-x-1">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path} aria-current={isActive ? "page" : undefined}>
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

            <div className="flex items-center gap-1 sm:gap-2">
              <Link to="/help" aria-label="Help" onClick={dismissHelpHighlight}>
                <Button
                  variant={highlightHelp ? "default" : "ghost"}
                  size="sm"
                  className={
                    highlightHelp
                      ? "p-2 animate-pulse ring-2 ring-primary ring-offset-2 ring-offset-background"
                      : "p-2"
                  }
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="ghost" size="sm" className="p-2" onClick={toggleTheme} aria-label="Toggle dark mode">
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex gap-1" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
                <span className="hidden md:inline">Search</span>
              </Button>
              <Button variant="ghost" size="sm" className="sm:hidden p-2" onClick={() => setSearchOpen(true)}>
                <Search className="h-4 w-4" />
              </Button>
              {user && <NotificationBell />}
              {user ? (
                <Button variant="outline" size="sm" onClick={signOut} className="gap-1 text-xs sm:text-sm px-2 sm:px-3">
                  <LogOut className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              ) : (
                <Link to="/auth">
                  <Button variant="default" size="sm" className="text-xs sm:text-sm px-2 sm:px-4">
                    <span className="hidden sm:inline">Join Ethisay</span>
                    <span className="sm:hidden">Join</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation - Compact */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-t border-border">
        <div className="grid grid-cols-6 gap-0 px-1 py-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} className="flex items-center justify-center" aria-current={isActive ? "page" : undefined}>
                <Button 
                  variant={isActive ? "default" : "ghost"} 
                  size="sm"
                  className="h-10 w-full flex-col gap-0.5 px-1 text-xs"
                >
                  <item.icon className="h-3.5 w-3.5" />
                  <span className="text-xs leading-tight">{item.label}</span>
                </Button>
              </Link>
            );
          })}
          
          {/* Mobile Search Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-full flex-col gap-0.5 px-1 text-xs"
            onClick={() => setSearchOpen(true)}
          >
            <Search className="h-3.5 w-3.5" />
            <span className="text-xs leading-tight">Search</span>
          </Button>
        </div>
      </nav>
      
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
};

export default Navigation;