import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, ThumbsUp, Minus, ThumbsDown, Edit, Trash2, Search } from "lucide-react";
import { useUserStances, useDeleteStance, CompanyStanceData } from "@/hooks/useCompanyStances";
import CompanyStanceDialog from "./CompanyStanceDialog";

interface UserStancesListProps {
  userId?: string;
}

const UserStancesList = ({ userId }: UserStancesListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStance, setSelectedStance] = useState<string>("all");
  const [editingStance, setEditingStance] = useState<CompanyStanceData | null>(null);
  const [stanceDialogOpen, setStanceDialogOpen] = useState(false);

  const { data: stances = [], isLoading } = useUserStances(userId);
  const deleteStance = useDeleteStance();

  const filteredStances = stances.filter(stance => 
    (selectedStance === "all" || stance.stance === selectedStance) &&
    (searchTerm === "" || stance.company_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const stanceStats = {
    recommend: stances.filter(s => s.stance === 'recommend').length,
    neutral: stances.filter(s => s.stance === 'neutral').length,
    discourage: stances.filter(s => s.stance === 'discourage').length,
  };

  const handleEditStance = (stance: CompanyStanceData) => {
    setEditingStance(stance);
    setStanceDialogOpen(true);
  };

  const handleDeleteStance = async (stanceId: string) => {
    if (window.confirm("Are you sure you want to delete this stance?")) {
      await deleteStance.mutateAsync(stanceId);
    }
  };

  const getStanceIcon = (stance: string) => {
    switch (stance) {
      case 'recommend': return <ThumbsUp className="h-4 w-4 text-recommend" />;
      case 'neutral': return <Minus className="h-4 w-4 text-neutral" />;
      case 'discourage': return <ThumbsDown className="h-4 w-4 text-discourage" />;
      default: return null;
    }
  };

  const getStanceBadgeVariant = (stance: string) => {
    switch (stance) {
      case 'recommend': return 'default';
      case 'neutral': return 'secondary';
      case 'discourage': return 'destructive';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-muted-foreground">Loading your stances...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-recommend" />
              <div>
                <p className="text-2xl font-bold text-recommend">{stanceStats.recommend}</p>
                <p className="text-sm text-muted-foreground">Recommend</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Minus className="h-5 w-5 text-neutral" />
              <div>
                <p className="text-2xl font-bold text-neutral">{stanceStats.neutral}</p>
                <p className="text-sm text-muted-foreground">Neutral</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <ThumbsDown className="h-5 w-5 text-discourage" />
              <div>
                <p className="text-2xl font-bold text-discourage">{stanceStats.discourage}</p>
                <p className="text-sm text-muted-foreground">Discourage</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search your company stances..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'All' },
            { value: 'recommend', label: 'Recommend' },
            { value: 'neutral', label: 'Neutral' },
            { value: 'discourage', label: 'Discourage' }
          ].map((option) => (
            <Button
              key={option.value}
              variant={selectedStance === option.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedStance(option.value)}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Stances List */}
      <div className="grid gap-4">
        {filteredStances.map((stance) => (
          <Card key={stance.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-gradient-subtle rounded-lg flex items-center justify-center">
                    <span className="text-lg font-bold">{stance.company_name.charAt(0)}</span>
                  </div>
                  <div>
                    <CardTitle className="text-lg">{stance.company_name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{stance.company_category}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Badge variant={getStanceBadgeVariant(stance.stance)} className="gap-1">
                    {getStanceIcon(stance.stance)}
                    {stance.stance}
                  </Badge>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleEditStance(stance)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => handleDeleteStance(stance.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              {/* Notes */}
              {stance.notes && (
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-sm">{stance.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredStances.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedStance !== 'all' 
              ? "No stances found matching your criteria." 
              : "You haven't rated any companies yet."}
          </p>
        </div>
      )}

      {/* Edit Dialog */}
      <CompanyStanceDialog 
        open={stanceDialogOpen}
        onOpenChange={(open) => {
          setStanceDialogOpen(open);
          if (!open) setEditingStance(null);
        }}
        companyName={editingStance?.company_name}
        companyCategory={editingStance?.company_category || ""}
        existingStance={editingStance ? {
          stance: editingStance.stance,
          notes: editingStance.notes || undefined,
        } : undefined}
      />
    </div>
  );
};

export default UserStancesList;