import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Calendar, Search, Check, Ban } from "lucide-react";
import { CreateBoycottDialog } from "@/components/CreateBoycottDialog";
import { BoycottManageMenu } from "@/components/BoycottManageMenu";
import { useBoycotts, useBoycottStats, useJoinBoycott, useLeaveBoycott, useUserBoycottParticipation } from "@/hooks/useBoycotts";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const Boycotts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const { data: boycotts = [], isLoading, refetch } = useBoycotts(searchTerm);
  const { data: stats, isLoading: statsLoading } = useBoycottStats();
  const { data: joinedBoycotts = [] } = useUserBoycottParticipation(user?.id);
  const joinBoycottMutation = useJoinBoycott();
  const leaveBoycottMutation = useLeaveBoycott();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-primary text-white";
      case "successful":
        return "bg-brand-success text-white";
      case "deactivated":
        return "bg-muted text-muted-foreground";
      case "ended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleJoinBoycott = async (boycottId: string) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "You need to be logged in to join a boycott",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await joinBoycottMutation.mutateAsync(boycottId);
      toast({
        title: "Joined boycott",
        description: "You have successfully joined this boycott!"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  const handleLeaveBoycott = async (boycottId: string) => {
    try {
      await leaveBoycottMutation.mutateAsync(boycottId);
      toast({
        title: "Left boycott",
        description: "You have left this boycott"
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">Active Boycotts</h1>
          <p className="text-xs sm:text-base text-muted-foreground">
            Join collective action for corporate accountability.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-2 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Search boycotts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm"
            />
          </div>
          <CreateBoycottDialog onBoycottCreated={refetch} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
          <Card>
            <CardContent className="p-2.5 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-brand-primary">
                {statsLoading ? "..." : stats?.activeBoycotts}
              </div>
              <div className="text-[10px] sm:text-sm text-muted-foreground">Active</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-brand-success">
                {statsLoading ? "..." : stats?.totalParticipants.toLocaleString()}
              </div>
              <div className="text-[10px] sm:text-sm text-muted-foreground">Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-brand-accent">
                {statsLoading ? "..." : stats?.successfulCampaigns}
              </div>
              <div className="text-[10px] sm:text-sm text-muted-foreground">Successful</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-2.5 sm:p-4 text-center">
              <div className="text-lg sm:text-2xl font-bold text-destructive">
                {statsLoading ? "..." : stats?.companiesChanged}
              </div>
              <div className="text-[10px] sm:text-sm text-muted-foreground">Changed</div>
            </CardContent>
          </Card>
        </div>

        {/* Boycotts List */}
        <div className="space-y-3 sm:space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">Loading boycotts...</div>
            </div>
          ) : boycotts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground text-sm">
                {searchTerm ? 'No boycotts found matching your search.' : 'No boycotts yet. Be the first to create one!'}
              </div>
            </div>
          ) : (
            boycotts.map((boycott) => (
              <Card key={boycott.id} className={`hover:shadow-card transition-all duration-300 ${boycott.status === 'deactivated' ? 'opacity-70' : ''}`}>
                <CardHeader className="p-3 sm:p-6 pb-2 sm:pb-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 mb-1 sm:mb-2 flex-wrap">
                        {boycott.status === 'deactivated' ? (
                          <Ban className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
                        ) : (
                          <AlertTriangle className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-destructive flex-shrink-0" />
                        )}
                        <CardTitle className="text-sm sm:text-lg truncate">{boycott.title}</CardTitle>
                        <Badge className={`${getStatusColor(boycott.status)} text-[10px] sm:text-xs`} variant="secondary">
                          {boycott.status}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        <span className="font-medium">{boycott.company}</span> • {boycott.categories.name}
                      </p>
                    </div>
                    <BoycottManageMenu
                      boycottId={boycott.id}
                      boycottTitle={boycott.title}
                      isOrganizer={user?.id === boycott.organizer_id}
                      status={boycott.status}
                    />
                  </div>
                </CardHeader>
                
                <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                  <p className="text-xs sm:text-base text-foreground mb-3 sm:mb-4 line-clamp-2 sm:line-clamp-none">{boycott.description}</p>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground flex-wrap">
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        {boycott.participants_count.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        {new Date(boycott.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none">
                        Learn More
                      </Button>
                      {boycott.status === "active" && (
                        joinedBoycotts.includes(boycott.id) ? (
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => handleLeaveBoycott(boycott.id)}
                            disabled={leaveBoycottMutation.isPending}
                            className="gap-1 text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                          >
                            <Check className="h-3 w-3 sm:h-4 sm:w-4" />
                            {leaveBoycottMutation.isPending ? "..." : "Joined"}
                          </Button>
                        ) : (
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleJoinBoycott(boycott.id)}
                            disabled={joinBoycottMutation.isPending}
                            className="text-xs sm:text-sm h-8 sm:h-9 flex-1 sm:flex-none"
                          >
                            {joinBoycottMutation.isPending ? "..." : "Join"}
                          </Button>
                        )
                      )}
                      {boycott.status === "deactivated" && (
                        <Badge variant="outline" className="text-xs">
                          No longer active
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Boycotts;