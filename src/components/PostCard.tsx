import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share, Star, AlertTriangle, Target, Users, Calendar } from "lucide-react";

interface PostCardProps {
  user: {
    name: string;
    username: string;
    avatar?: string;
    isCreator?: boolean;
  };
  content: string;
  company?: {
    name: string;
    rating: number;
    category: string;
  };
  boycott?: {
    title: string;
    company: string;
    subject: string;
    impact: 'low' | 'medium' | 'high' | 'very-high';
    participants_count: number;
    category?: string;
  };
  isBoycott?: boolean;
  timestamp: string;
  likes: number;
  comments: number;
}

const PostCard = ({ user, content, company, boycott, isBoycott, timestamp, likes, comments }: PostCardProps) => {
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'bg-blue-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-orange-500';
      case 'very-high':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getImpactText = (impact: string) => {
    switch (impact) {
      case 'very-high':
        return 'Very High';
      default:
        return impact.charAt(0).toUpperCase() + impact.slice(1);
    }
  };
  return (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold">{user.name}</span>
                {user.isCreator && (
                  <Badge variant="secondary" className="text-xs">
                    Creator
                  </Badge>
                )}
                {isBoycott && (
                  <Badge variant="destructive" className="text-xs gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Boycott
                  </Badge>
                )}
              </div>
              <span className="text-sm text-muted-foreground">@{user.username} · {timestamp}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      
      <CardContent className="pt-0">
        {/* Regular post content */}
        {!company && !boycott && <p className="text-foreground mb-4">{content}</p>}
        
        {/* Company review card */}
        {company && (
          <Card className="bg-muted/50 border-0 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">{company.name}</h4>
                  <p className="text-sm text-muted-foreground">{company.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i < company.rating ? "text-earth-orange fill-current" : "text-muted-foreground"
                      }`}
                    />
                  ))}
                  <span className="ml-1 text-sm font-medium">{company.rating}/5</span>
                </div>
              </div>
              {content && (
                <p className="text-foreground mt-3 pt-3 border-t">{content}</p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Boycott card */}
        {boycott && (
          <Card className="bg-muted/50 border-0 mb-4">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <h4 className="font-semibold">{boycott.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">Target: {boycott.company}</p>
                  <p className="text-sm text-muted-foreground">{boycott.category}</p>
                </div>
                <div className="flex items-center gap-1">
                  <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-white ${getImpactColor(boycott.impact)}`}>
                    {getImpactText(boycott.impact)} Impact
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-3">
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{boycott.participants_count} participants</span>
                </div>
              </div>
              {content && (
                <p className="text-foreground mt-3 pt-3 border-t">{content}</p>
              )}
            </CardContent>
          </Card>
        )}
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <Button variant="ghost" size="sm" className="gap-2 hover:text-red-500">
            <Heart className="h-4 w-4" />
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 hover:text-blue-500">
            <MessageCircle className="h-4 w-4" />
            {comments}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2 hover:text-green-500">
            <Share className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;