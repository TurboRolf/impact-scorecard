import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TrendingUp, AlertTriangle, Users, ArrowRight, Flame, Shield } from "lucide-react";

const trendingTopics = [
  { tag: "#FastFashion", posts: 1243, trend: "up" },
  { tag: "#GreenWashing", posts: 892, trend: "up" },
  { tag: "#EthicalTech", posts: 651, trend: "up" },
  { tag: "#BoycottPlastic", posts: 534, trend: "up" },
  { tag: "#FairTrade", posts: 421, trend: "up" },
];

const suggestedCreators = [
  { name: "EcoWarrior", username: "ecowarrior", bio: "Sustainable living advocate", avatar: "ecowarrior" },
  { name: "TechEthics", username: "techethics", bio: "AI ethics researcher", avatar: "techethics" },
  { name: "GreenConsumer", username: "greenconsumer", bio: "Ethical shopping guide", avatar: "greenconsumer" },
];

const activeBoycotts = [
  { title: "Fast Fashion Reform", company: "Various brands", participants: 12400 },
  { title: "Data Privacy Rights", company: "Tech Giants", participants: 8900 },
];

const RightSidebar = () => {
  return (
    <div className="sticky top-20 space-y-4">
      {/* Trending Topics */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Flame className="h-4 w-4 text-discourage" />
            Trendande ämnen
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {trendingTopics.map((topic, i) => (
              <div key={topic.tag} className="flex items-center justify-between group cursor-pointer">
                <div>
                  <p className="text-sm font-medium group-hover:text-brand-primary transition-colors">{topic.tag}</p>
                  <p className="text-xs text-muted-foreground">{topic.posts.toLocaleString()} inlägg</p>
                </div>
                <TrendingUp className="h-3.5 w-3.5 text-recommend" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Active Boycotts */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-discourage" />
            Aktiva bojkotter
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {activeBoycotts.map((boycott) => (
              <div key={boycott.title} className="p-2.5 rounded-md bg-muted/50 hover:bg-muted transition-colors cursor-pointer">
                <p className="text-sm font-medium line-clamp-1">{boycott.title}</p>
                <p className="text-xs text-muted-foreground">{boycott.company}</p>
                <div className="flex items-center gap-1 mt-1.5">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{boycott.participants.toLocaleString()} deltagare</span>
                </div>
              </div>
            ))}
          </div>
          <Link to="/boycotts">
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs gap-1">
              Visa alla <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Suggested Creators */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Shield className="h-4 w-4 text-brand-primary" />
            Föreslagna skapare
          </CardTitle>
        </CardHeader>
        <CardContent className="p-3 pt-0">
          <div className="space-y-3">
            {suggestedCreators.map((creator) => (
              <div key={creator.username} className="flex items-center gap-2.5">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.avatar}`} />
                  <AvatarFallback>{creator.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{creator.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{creator.bio}</p>
                </div>
                <Button variant="outline" size="sm" className="h-7 text-xs px-2.5 flex-shrink-0">
                  Följ
                </Button>
              </div>
            ))}
          </div>
          <Link to="/creators">
            <Button variant="ghost" size="sm" className="w-full mt-2 text-xs gap-1">
              Visa alla <ArrowRight className="h-3 w-3" />
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="px-2 text-[11px] text-muted-foreground space-y-1">
        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
          <span className="hover:underline cursor-pointer">Om</span>
          <span className="hover:underline cursor-pointer">Integritet</span>
          <span className="hover:underline cursor-pointer">Villkor</span>
          <span className="hover:underline cursor-pointer">Kontakt</span>
        </div>
        <p>© 2026 EthiCheck</p>
      </div>
    </div>
  );
};

export default RightSidebar;
