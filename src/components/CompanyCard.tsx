import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingDown, TrendingUp, AlertTriangle, ThumbsUp, Minus, ThumbsDown, MessageSquare } from "lucide-react";

interface CompanyCardProps {
  name: string;
  category: string;
  logo?: string;
  overallRating: number;
  ethicsRating: number;
  environmentRating: number;
  politicsRating: number;
  activeBoycotts: number;
  trend: "up" | "down" | "stable";
  description: string;
  recommendCount?: number;
  neutralCount?: number;
  discourageCount?: number;
  onRate?: () => void;
  onReview?: () => void;
  onStartBoycott?: () => void;
}

const CompanyCard = ({
  name,
  category,
  logo,
  overallRating,
  ethicsRating,
  environmentRating,
  politicsRating,
  activeBoycotts,
  trend,
  description,
  recommendCount = 0,
  neutralCount = 0,
  discourageCount = 0,
  onRate,
  onReview,
  onStartBoycott
}: CompanyCardProps) => {
  const ratings = [
    { label: "Ethics", value: ethicsRating, color: "text-earth-blue" },
    { label: "Environment", value: environmentRating, color: "text-earth-green" },
    { label: "Politics", value: politicsRating, color: "text-earth-orange" },
  ];

  return (
    <Card className="hover:shadow-card transition-all duration-300">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 bg-gradient-subtle rounded-lg flex items-center justify-center">
              {logo ? (
                <img src={logo} alt={name} className="w-8 h-8 object-contain" />
              ) : (
                <span className="text-lg font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <p className="text-sm text-muted-foreground">{category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div 
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onReview}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < overallRating ? "text-earth-orange fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-1 font-semibold">{overallRating}/5</span>
            </div>
            {trend === "up" && <TrendingUp className="h-4 w-4 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-4 w-4 text-red-500" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          {ratings.map((rating) => (
            <div 
              key={rating.label} 
              className="text-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={onReview}
            >
              <div className={`text-lg font-bold ${rating.color}`}>{rating.value}/5</div>
              <div className="text-xs text-muted-foreground">{rating.label}</div>
            </div>
          ))}
        </div>
        
        {activeBoycotts > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <span className="text-sm text-destructive font-medium">
              {activeBoycotts} active boycott{activeBoycotts > 1 ? 's' : ''}
            </span>
          </div>
        )}
        
        {/* User Stance Distribution */}
        <div className="flex gap-2 mb-4">
          <div className="flex items-center gap-1 flex-1">
            <ThumbsUp className="h-4 w-4 text-recommend" />
            <span className="text-sm text-recommend font-medium">{recommendCount}</span>
          </div>
          <div className="flex items-center gap-1 flex-1">
            <Minus className="h-4 w-4 text-neutral" />
            <span className="text-sm text-neutral font-medium">{neutralCount}</span>
          </div>
          <div className="flex items-center gap-1 flex-1">
            <ThumbsDown className="h-4 w-4 text-discourage" />
            <span className="text-sm text-discourage font-medium">{discourageCount}</span>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="default" size="sm" className="flex-1 gap-1" onClick={onRate}>
            <MessageSquare className="h-4 w-4" />
            Add Stance
          </Button>
          <Button variant="outline" size="sm" className="flex-1" onClick={onStartBoycott}>
            Start Boycott
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;