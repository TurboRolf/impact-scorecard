import React from "react";
import { ThumbsUp, Minus, ThumbsDown, AlertTriangle, Users } from "lucide-react";

interface ProfileStatsProps {
  stanceStats: {
    recommend: number;
    neutral: number;
    discourage: number;
  };
  boycottsCreated: number;
  boycottsJoined: number;
}

const ProfileStats = ({ stanceStats, boycottsCreated, boycottsJoined }: ProfileStatsProps) => {
  const stats = [
    { 
      icon: ThumbsUp, 
      value: stanceStats.recommend, 
      label: "Rec.", 
      fullLabel: "Recommended",
      color: "text-recommend" 
    },
    { 
      icon: Minus, 
      value: stanceStats.neutral, 
      label: "Neu.", 
      fullLabel: "Neutral",
      color: "text-neutral" 
    },
    { 
      icon: ThumbsDown, 
      value: stanceStats.discourage, 
      label: "Disc.", 
      fullLabel: "Discouraged",
      color: "text-discourage" 
    },
    { 
      icon: AlertTriangle, 
      value: boycottsCreated, 
      label: "Created", 
      fullLabel: "Boycotts Created",
      color: "text-brand-accent" 
    },
    { 
      icon: Users, 
      value: boycottsJoined, 
      label: "Joined", 
      fullLabel: "Boycotts Joined",
      color: "text-brand-success" 
    },
  ];

  return (
    <>
      {/* Mobile: Compact horizontal scroll */}
      <div className="md:hidden flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        {stats.map((stat, index) => (
          <div 
            key={index}
            className="flex-shrink-0 flex items-center gap-1.5 bg-card border rounded-lg px-2.5 py-1.5"
          >
            <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            <span className={`text-sm font-semibold ${stat.color}`}>{stat.value}</span>
            <span className="text-[10px] text-muted-foreground">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Desktop: Grid cards */}
      <div className="hidden md:grid grid-cols-5 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-card border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
              <span className="text-sm font-medium">{stat.fullLabel}</span>
            </div>
            <div className={`text-2xl font-bold ${stat.color}`}>{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {index < 3 ? "Companies" : "Boycotts"}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProfileStats;
