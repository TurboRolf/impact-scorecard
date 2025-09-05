import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Clock, Target } from "lucide-react";
import { useBoycotts } from "@/hooks/useBoycotts";
import { format } from "date-fns";

interface UserBoycottsListProps {
  userId?: string;
}

const UserBoycottsList = ({ userId }: UserBoycottsListProps) => {
  const { data: boycotts = [], isLoading } = useBoycotts();

  // Filter boycotts created by the user
  const userBoycotts = boycotts.filter(boycott => 
    boycott.organizer_id === userId
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-brand-accent text-white';
      case 'successful':
        return 'bg-brand-success text-white';
      case 'ended':
        return 'bg-muted text-muted-foreground';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'low':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      case 'very-high':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading your boycotts...
        </CardContent>
      </Card>
    );
  }

  if (userBoycotts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No boycotts created yet</p>
          <p className="text-sm">Start your first boycott to make a difference!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Your Boycotts ({userBoycotts.length})</h3>
      </div>
      
      {userBoycotts.map((boycott) => (
        <Card key={boycott.id} className="hover:shadow-md transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg mb-2">{boycott.title}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={getStatusColor(boycott.status)}>
                    {boycott.status.charAt(0).toUpperCase() + boycott.status.slice(1)}
                  </Badge>
                  <Badge variant="outline" className={getImpactColor(boycott.impact)}>
                    {boycott.impact.charAt(0).toUpperCase() + boycott.impact.slice(1)} Impact
                  </Badge>
                  {boycott.categories && (
                    <Badge variant="outline" style={{ backgroundColor: boycott.categories.color + '20', color: boycott.categories.color }}>
                      {boycott.categories.name}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  <span>{boycott.company}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{boycott.participants_count} participants</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{format(new Date(boycott.start_date), 'MMM d, yyyy')}</span>
                </div>
              </div>
              
              <p className="text-sm text-foreground line-clamp-2">
                {boycott.description}
              </p>
              
              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm font-medium text-foreground mb-1">Subject:</p>
                <p className="text-sm text-muted-foreground">{boycott.subject}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default UserBoycottsList;