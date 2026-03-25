import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, ArrowRight, Flame } from "lucide-react";
import { useBoycotts } from "@/hooks/useBoycotts";

const RightSidebar = () => {
  const { data: boycotts = [] } = useBoycotts();

  // Get top active boycotts sorted by participants
  const trendingBoycotts = boycotts
    .filter(b => b.status === 'active')
    .sort((a, b) => (b.participants_count || 0) - (a.participants_count || 0))
    .slice(0, 5);

  return (
    <div className="sticky top-20 space-y-4">
      {/* Trending Boycotts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Flame className="h-4 w-4 text-discourage" />
            Trending Boycotts
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          {trendingBoycotts.length > 0 ? (
            <div className="space-y-3">
              {trendingBoycotts.map((boycott) => (
                <div key={boycott.id} className="p-2.5 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium line-clamp-1">{boycott.title}</p>
                    {boycott.categories?.name && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 flex-shrink-0">
                        {boycott.categories.name}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{boycott.company}</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {(boycott.participants_count || 0).toLocaleString()} participants
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2">No active boycotts yet.</p>
          )}
          <Link to="/boycotts">
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs gap-1">
              View all <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="px-2 text-[11px] text-muted-foreground space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="hover:underline cursor-pointer">About</span>
          <span className="hover:underline cursor-pointer">Privacy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
          <span className="hover:underline cursor-pointer">Contact</span>
        </div>
        <p>© 2026 EthiCheck</p>
      </div>
    </div>
  );
};

export default RightSidebar;
