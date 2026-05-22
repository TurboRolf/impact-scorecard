import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingDown, TrendingUp, AlertTriangle, Flag, ThumbsUp, Minus, ThumbsDown, Leaf, Users, Scale, Landmark, Eye, Megaphone, Lock, Truck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { countryCodeToFlag } from "@/lib/countryFlag";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompanyCardProps {
  id: string;
  name: string;
  category: string;
  logo?: string;
  country?: string | null;
  overallRating: number;
  environmentRating: number;
  laborRating: number;
  ethicsRating: number;
  politicsRating: number;
  transparencyRating: number;
  marketingAdvertisingRating: number;
  dataPrivacyRating: number;
  supplyChainRating: number;
  activeBoycotts: number;
  trend: "up" | "down" | "stable";
  description: string;
  recommendCount?: number;
  neutralCount?: number;
  discourageCount?: number;
  onRate?: () => void;
  onReview?: (category?: string) => void;
  onStartBoycott?: () => void;
}

const CompanyCard = ({
  id,
  name,
  category,
  logo,
  country,
  overallRating,
  environmentRating,
  laborRating,
  ethicsRating,
  politicsRating,
  transparencyRating,
  marketingAdvertisingRating,
  dataPrivacyRating,
  supplyChainRating,
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
    { key: "environment", label: "Environment", short: "Env", value: environmentRating, Icon: Leaf },
    { key: "labor_human_rights", label: "Labor & Human Rights", short: "Lab", value: laborRating, Icon: Users },
    { key: "ethics_integrity", label: "Ethics & Integrity", short: "Eth", value: ethicsRating, Icon: Scale },
    { key: "politics_lobbying", label: "Politics & Lobbying", short: "Pol", value: politicsRating, Icon: Landmark },
    { key: "transparency", label: "Transparency", short: "Tra", value: transparencyRating, Icon: Eye },
    { key: "marketing_advertising", label: "Marketing & Advertising", short: "Mkt", value: marketingAdvertisingRating, Icon: Megaphone },
    { key: "data_privacy", label: "Data & Privacy", short: "Dat", value: dataPrivacyRating, Icon: Lock },
    { key: "supply_chain", label: "Supply Chain", short: "Sup", value: supplyChainRating, Icon: Truck },
  ];

  const iconColor = (v: number) => {
    if (v <= 0) return "text-muted-foreground/50";
    if (v < 2) return "text-discourage";
    if (v < 3.5) return "text-neutral";
    return "text-recommend";
  };

  const totalStances = recommendCount + neutralCount + discourageCount;
  const pct = (n: number) => (totalStances > 0 ? (n / totalStances) * 100 : 0);

  return (
    <Card className="hover:shadow-card transition-all duration-300 cursor-pointer flex flex-col group" onClick={() => navigate(`/company/${id}`)}>
      <CardHeader className="pb-3 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-11 h-11 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border">
              {logo ? (
                <img src={logo} alt={name} className="w-7 h-7 object-contain" loading="lazy" />
              ) : (
                <span className="text-base font-bold">{name.charAt(0)}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <CardTitle className="text-sm sm:text-base truncate leading-tight">
                {flag && <span className="mr-1.5">{flag}</span>}
                {name}
              </CardTitle>
              <p className="text-xs text-muted-foreground truncate mt-0.5">{category}</p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity gap-1 px-2 py-1"
            onClick={(e) => { e.stopPropagation(); onReview?.(); }}
          >
            <span className="font-semibold tabular-nums">{(overallRating ?? 0).toFixed(1)}</span>
            <Star className="h-3 w-3 text-earth-orange fill-current" />
            {trend === "up" && <TrendingUp className="h-3 w-3 text-green-500" />}
            {trend === "down" && <TrendingDown className="h-3 w-3 text-red-500" />}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 pt-0 flex-1 flex flex-col gap-3">
        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 min-h-[2.5em]">{description}</p>

        {/* Category icons — compact 8-rating overview */}
        <TooltipProvider delayDuration={150}>
          <div className="flex items-center justify-between gap-1">
            {ratings.map((r) => (
              <Tooltip key={r.key}>
                <TooltipTrigger asChild>
                  <button
                    onClick={(e) => { e.stopPropagation(); onReview?.(r.key); }}
                    className="flex flex-col items-center gap-1 flex-1 group/dot py-1"
                    aria-label={`${r.label}: ${r.value.toFixed(1)}`}
                  >
                    <r.Icon className={`h-4 w-4 ${iconColor(r.value)} transition-colors`} />
                    <span className="text-[10px] text-muted-foreground tabular-nums">{r.value > 0 ? r.value.toFixed(1) : "–"}</span>
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="text-xs">
                  {r.label}: {r.value > 0 ? r.value.toFixed(1) : "Not rated"}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </TooltipProvider>

        {activeBoycotts > 0 ? (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AlertTriangle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive" />
            <span className="text-xs sm:text-sm text-destructive font-medium">
              {activeBoycotts} active boycott{activeBoycotts > 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-xs sm:text-sm text-muted-foreground font-medium">
              0 active boycotts
            </span>
          </div>
        )}

        {/* User Stance Distribution */}
        <div className="flex items-center gap-1 sm:gap-2">
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

        <div className="flex gap-2 mt-auto pt-1">
          <Button
            variant="default"
            size="sm"
            className="flex-1 gap-1.5 h-8 text-xs"
            onClick={(e) => { e.stopPropagation(); onRate?.(); }}
          >
            <Flag className="h-3.5 w-3.5" />
            Stance
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1 h-8 text-xs"
            onClick={(e) => { e.stopPropagation(); onStartBoycott?.(); }}
          >
            Boycott
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CompanyCard;