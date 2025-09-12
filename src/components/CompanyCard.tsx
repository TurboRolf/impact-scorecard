import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingDown, TrendingUp, AlertTriangle, ThumbsUp, Minus, ThumbsDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompanyCardProps {
  id: string;
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
  id,
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
  const navigate = useNavigate();
  const ratings = [
    { label: "Ethics", value: ethicsRating, color: "text-earth-blue" },
    { label: "Environment", value: environmentRating, color: "text-earth-green" },
    { label: "Politics", value: politicsRating, color: "text-earth-orange" },
  ];

  return (
    <Card className="hover:shadow-card transition-all duration-300 cursor-pointer" onClick={() => navigate(`/company/${id}`)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 sm:w-14 sm:h-14 bg-gradient-subtle rounded-lg flex items-center justify-center flex-shrink-0">
              {logo ? (
                <img src={logo} alt={name} className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
              ) : (
                <span className="text-lg font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-base sm:text-lg truncate">{name}</CardTitle>
              <p className="text-sm text-muted-foreground truncate">{category}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 flex-shrink-0">
            <div 
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onReview?.(); }}
            >
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 sm:h-4 sm:w-4 ${
                    i < overallRating ? "text-earth-orange fill-current" : "text-muted-foreground"
                  }`}
                />
              ))}
              <span className="ml-1 font-semibold text-sm">{overallRating}/5</span>
            </div>
            {trend === "up" && <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" />}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{description}</p>
        
        <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4">
          {ratings.map((rating) => (
            <div 
              key={rating.label} 
              className="text-center cursor-pointer hover:opacity-80 transition-opacity"
              onClick={(e) => { e.stopPropagation(); onReview?.(); }}
            >
              <div className={`text-base sm:text-lg font-bold ${rating.color}`}>{rating.value}/5</div>
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
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="default" 
            size="sm" 
            className="flex-1 gap-1 h-10" 
            onClick={(e) => { e.stopPropagation(); onRate?.(); }}
          >
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Add Stance</span>
            <span className="sm:hidden">Stance</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-10" 
            onClick={(e) => { e.stopPropagation(); onStartBoycott?.(); }}
          >
            <span className="hidden sm:inline">Start Boycott</span>
            <span className="sm:hidden">Boycott</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;