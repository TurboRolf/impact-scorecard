import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingDown, TrendingUp, AlertTriangle, ThumbsUp, Minus, ThumbsDown, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countryCodeToFlag } from "@/lib/countryFlag";

interface CompanyCardProps {
  id: string;
  name: string;
  category: string;
  logo?: string;
  country?: string | null;
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
  country,
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
  const flag = countryCodeToFlag(country);
  const ratings = [
    { label: "Ethics", value: ethicsRating, color: "text-earth-blue" },
    { label: "Environment", value: environmentRating, color: "text-earth-green" },
    { label: "Politics", value: politicsRating, color: "text-earth-orange" },
  ];

  return (
    <Card className="hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col" onClick={() => navigate(`/company/${id}`)}>
      <CardHeader className="pb-3 sm:pb-4 p-4 sm:p-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 sm:gap-3 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-subtle rounded-lg flex items-center justify-center flex-shrink-0">
              {logo ? (
                <img src={logo} alt={name} className="w-6 h-6 sm:w-8 sm:h-8 object-contain" loading="lazy" />
              ) : (
                <span className="text-sm sm:text-lg font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base truncate">
                {flag && <span className="mr-1.5">{flag}</span>}
                {name}
              </CardTitle>
              <p className="text-xs sm:text-sm text-muted-foreground truncate">{category}</p>
            </div>
          </div>
          
          <Badge 
            variant="secondary" 
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity gap-1"
            onClick={(e) => { e.stopPropagation(); onReview?.(); }}
          >
            {overallRating} <Star className="h-3 w-3 text-earth-orange fill-current" />
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6 pt-0 flex-1 flex flex-col">
        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4 line-clamp-2">{description}</p>
        
        <div className="mt-auto">
          <div className="grid grid-cols-3 gap-1 sm:gap-2 mb-3 sm:mb-4">
            {ratings.map((rating) => (
              <div 
                key={rating.label} 
                className="text-center cursor-pointer hover:opacity-80 transition-opacity py-1"
                onClick={(e) => { e.stopPropagation(); onReview?.(); }}
              >
                <div className={`text-sm sm:text-base font-bold ${rating.color}`}>{rating.value}/5</div>
                <div className="text-xs text-muted-foreground leading-tight">{rating.label}</div>
              </div>
            ))}
          </div>
          
          {activeBoycotts > 0 ? (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
              <span className="text-xs sm:text-sm text-destructive font-medium">
                {activeBoycotts} active boycott{activeBoycotts > 1 ? 's' : ''}
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2 mb-3 sm:mb-4">
              <span className="text-xs sm:text-sm text-muted-foreground font-medium">
                0 active boycotts
              </span>
            </div>
          )}
          
          {/* User Stance Distribution */}
          <div className="flex items-center gap-1 sm:gap-2 mb-3 sm:mb-4">
            <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
              <ThumbsUp className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-recommend" />
              <span className="text-xs sm:text-sm text-recommend font-medium">{recommendCount}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
              <Minus className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-neutral" />
              <span className="text-xs sm:text-sm text-neutral font-medium">{neutralCount}</span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1 flex-1 justify-center">
              <ThumbsDown className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-discourage" />
              <span className="text-xs sm:text-sm text-discourage font-medium">{discourageCount}</span>
            </div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2">
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 gap-1 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3" 
              onClick={(e) => { e.stopPropagation(); onRate?.(); }}
            >
              <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden sm:inline">Add Stance</span>
              <span className="sm:hidden">Stance</span>
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 h-8 sm:h-9 text-xs sm:text-sm px-2 sm:px-3" 
              onClick={(e) => { e.stopPropagation(); onStartBoycott?.(); }}
            >
              <span className="hidden sm:inline">Start Boycott</span>
              <span className="sm:hidden">Boycott</span>
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;