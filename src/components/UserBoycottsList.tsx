import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Users, Clock, Target, Ban, Megaphone, UserCheck } from "lucide-react";
import { useBoycotts, useUserBoycottParticipation } from "@/hooks/useBoycotts";
import { BoycottManageMenu } from "@/components/BoycottManageMenu";
import { useAuth } from "@/hooks/useAuth";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UserBoycottsListProps {
  userId?: string;
}

const UserBoycottsList = ({ userId }: UserBoycottsListProps) => {
  const { data: boycotts = [], isLoading } = useBoycotts();
  const { data: joinedBoycottIds = [], isLoading: isLoadingJoined } = useUserBoycottParticipation(userId);
  const { user } = useAuth();

  const createdBoycotts = boycotts.filter(b => b.organizer_id === userId);
  const joinedBoycotts = boycotts.filter(b => joinedBoycottIds.includes(b.id) && b.organizer_id !== userId);

  const isOwnProfile = user?.id === userId;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-destructive text-destructive-foreground';
      case 'successful': return 'bg-brand-success text-destructive-foreground';
      case 'deactivated':
      case 'ended':
      default: return 'bg-muted text-muted-foreground';
    }
  };

  if (isLoading || isLoadingJoined) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          Loading boycotts...
        </CardContent>
      </Card>
    );
  }

  if (createdBoycotts.length === 0 && joinedBoycotts.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>No boycotts yet</p>
          <p className="text-sm">Create or join boycotts to make a difference!</p>
        </CardContent>
      </Card>
    );
  }

  const renderBoycottCard = (boycott: typeof boycotts[0], showManage: boolean) => (
    <Card key={boycott.id} className={`hover:shadow-md transition-shadow ${boycott.status === 'deactivated' ? 'opacity-70' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {boycott.status === 'deactivated' ? (
                <Ban className="h-4 w-4 text-muted-foreground" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-destructive" />
              )}
              <CardTitle className="text-lg">{boycott.title}</CardTitle>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={getStatusColor(boycott.status)}>
                {boycott.status.charAt(0).toUpperCase() + boycott.status.slice(1)}
              </Badge>
              {boycott.categories && (
                <Badge variant="outline" style={{ backgroundColor: boycott.categories.color + '20', color: '#ffffff' }}>
                  {boycott.categories.name}
                </Badge>
              )}
            </div>
          </div>
          {showManage && isOwnProfile && (
            <BoycottManageMenu
              boycottId={boycott.id}
              boycottTitle={boycott.title}
              isOrganizer={true}
              status={boycott.status}
            />
          )}
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
          <p className="text-sm text-foreground line-clamp-2">{boycott.description}</p>
          {boycott.status === 'deactivated' && boycott.deactivation_reason && (
            <div className="bg-brand-success/10 border border-brand-success/20 p-3 rounded-lg">
              <p className="text-sm font-medium text-brand-success mb-1">Reason for deactivation:</p>
              <p className="text-sm text-muted-foreground">{boycott.deactivation_reason}</p>
            </div>
          )}
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm font-medium text-foreground mb-1">Subject:</p>
            <p className="text-sm text-muted-foreground">{boycott.subject}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Tabs defaultValue="joined" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="joined" className="gap-1.5">
          <UserCheck className="h-3.5 w-3.5" />
          Joined ({joinedBoycotts.length})
        </TabsTrigger>
        <TabsTrigger value="created" className="gap-1.5">
          <Megaphone className="h-3.5 w-3.5" />
          Created ({createdBoycotts.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="joined" className="mt-4 space-y-4">
        {joinedBoycotts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">No boycotts joined yet</p>
            </CardContent>
          </Card>
        ) : (
          joinedBoycotts.map(b => renderBoycottCard(b, false))
        )}
      </TabsContent>

      <TabsContent value="created" className="mt-4 space-y-4">
        {createdBoycotts.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-muted-foreground">
              <p className="text-sm">No boycotts created yet</p>
            </CardContent>
          </Card>
        ) : (
          createdBoycotts.map(b => renderBoycottCard(b, true))
        )}
      </TabsContent>
    </Tabs>
  );
};

export default UserBoycottsList;
