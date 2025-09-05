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
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {isBoycott && <AlertTriangle className="h-5 w-5 text-destructive" />}
              <span className="font-semibold text-lg">{user.name}</span>
              {user.isCreator && (
                <Badge variant="secondary" className="text-xs">
                  Creator
                </Badge>
              )}
              {isBoycott && (
                <Badge variant="destructive" className="text-xs gap-1">
                  Boycott
                </Badge>
              )}
            </div>
            {company && (
              <p className="text-sm text-muted-foreground mb-2">
                About: <span className="font-medium">{company.name}</span> • 
                Category: <span className="font-medium">{company.category}</span>
              </p>
            )}
          </div>
          {company && (
            <div className="text-right">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < company.rating ? "text-brand-accent fill-current" : "text-muted-foreground"
                    }`}
                  />
                ))}
                <span className="ml-1 text-sm font-medium text-brand-accent">{company.rating}/5</span>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-foreground mb-4">{content}</p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-xs">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm text-muted-foreground">@{user.username} · {timestamp}</span>
            </div>
          </div>
          
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
        </div>
      </CardContent>
    </Card>
  );
};

export default PostCard;