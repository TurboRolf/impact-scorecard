import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Users, Calendar, TrendingUp, Search } from "lucide-react";
import { CreateBoycottDialog } from "@/components/CreateBoycottDialog";
import { useBoycotts, useBoycottStats, useJoinBoycott } from "@/hooks/useBoycotts";
import { useToast } from "@/hooks/use-toast";

const queryClient = new QueryClient();

const BoycottsContent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  
  const { data: boycotts = [], isLoading, refetch } = useBoycotts(searchTerm);
  const { data: stats, isLoading: statsLoading } = useBoycottStats();
  const joinBoycottMutation = useJoinBoycott();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-brand-primary text-white";
      case "successful":
        return "bg-brand-success text-white";
      case "ended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "very-high":
        return "text-destructive";
      case "high":
        return "text-brand-accent";
      case "medium":
        return "text-brand-primary";
      default:
        return "text-muted-foreground";
    }
  };

  const handleJoinBoycott = async (boycottId: string) => {
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

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Active Boycotts</h1>
          <p className="text-muted-foreground">
            Join collective action for corporate accountability and ethical business practices.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boycotts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <CreateBoycottDialog onBoycottCreated={refetch} />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-primary">
                {statsLoading ? "..." : stats?.activeBoycotts}
              </div>
              <div className="text-sm text-muted-foreground">Active Boycotts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-success">
                {statsLoading ? "..." : stats?.totalParticipants.toLocaleString()}
              </div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-brand-accent">
                {statsLoading ? "..." : stats?.successfulCampaigns}
              </div>
              <div className="text-sm text-muted-foreground">Successful Campaigns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">
                {statsLoading ? "..." : stats?.companiesChanged}
              </div>
              <div className="text-sm text-muted-foreground">Companies Changed</div>
            </CardContent>
          </Card>
        </div>

        {/* Boycotts List */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">Loading boycotts...</div>
            </div>
          ) : boycotts.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-muted-foreground">
                {searchTerm ? 'No boycotts found matching your search.' : 'No boycotts yet. Be the first to create one!'}
              </div>
            </div>
          ) : (
            boycotts.map((boycott) => (
              <Card key={boycott.id} className="hover:shadow-card transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-5 w-5 text-destructive" />
                        <CardTitle className="text-lg">{boycott.title}</CardTitle>
                        <Badge className={getStatusColor(boycott.status)} variant="secondary">
                          {boycott.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        Against: <span className="font-medium">{boycott.company}</span> • 
                        Category: <span className="font-medium">{boycott.categories.name}</span>
                      </p>
                    </div>
                    <div className={`text-right ${getImpactColor(boycott.impact)}`}>
                      <TrendingUp className="h-4 w-4 mb-1 ml-auto" />
                      <div className="text-xs font-medium capitalize">{boycott.impact.replace('-', ' ')} impact</div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-foreground mb-4">{boycott.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="flex items-center gap-2">
                         <Avatar className="h-6 w-6">
                           <AvatarFallback className="text-xs">
                             A
                           </AvatarFallback>
                         </Avatar>
                         <span className="text-sm text-muted-foreground">
                           by Anonymous
                         </span>
                       </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Users className="h-4 w-4" />
                        {boycott.participants_count.toLocaleString()} participants
                      </div>
                      
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Started {new Date(boycott.start_date).toLocaleDateString()}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Learn More
                      </Button>
                      {boycott.status === "active" && (
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={() => handleJoinBoycott(boycott.id)}
                          disabled={joinBoycottMutation.isPending}
                        >
                          {joinBoycottMutation.isPending ? "Joining..." : "Join Boycott"}
                        </Button>
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

const Boycotts = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BoycottsContent />
    </QueryClientProvider>
  );
};

export default Boycotts;