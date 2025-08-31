import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { useCreateOrUpdateStance, CompanyStance } from "@/hooks/useCompanyStances";

interface CompanyStanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName?: string;
  companyCategory?: string;
  existingStance?: {
    stance: CompanyStance;
    ethics_rating?: number;
    environment_rating?: number;
    politics_rating?: number;
    overall_rating?: number;
    notes?: string;
  };
}

const CompanyStanceDialog = ({
  open,
  onOpenChange,
  companyName = "",
  companyCategory = "",
  existingStance
}: CompanyStanceDialogProps) => {
  const [formData, setFormData] = useState({
    company_name: companyName,
    company_category: companyCategory,
    stance: existingStance?.stance || 'neutral' as CompanyStance,
    ethics_rating: existingStance?.ethics_rating || 3,
    environment_rating: existingStance?.environment_rating || 3,
    politics_rating: existingStance?.politics_rating || 3,
    overall_rating: existingStance?.overall_rating || 3,
    notes: existingStance?.notes || ""
  });

  const createOrUpdateStance = useCreateOrUpdateStance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) return;

    await createOrUpdateStance.mutateAsync(formData);
    onOpenChange(false);
    setFormData({
      company_name: "",
      company_category: "",
      stance: 'neutral',
      ethics_rating: 3,
      environment_rating: 3,
      politics_rating: 3,
      overall_rating: 3,
      notes: ""
    });
  };

  const stanceOptions = [
    { value: 'recommend' as CompanyStance, label: 'Recommend', icon: ThumbsUp, color: 'bg-recommend' },
    { value: 'neutral' as CompanyStance, label: 'Neutral', icon: Minus, color: 'bg-neutral' },
    { value: 'discourage' as CompanyStance, label: 'Discourage', icon: ThumbsDown, color: 'bg-discourage' },
  ];

  const categories = [
    "Technology", "Fashion", "Food & Beverage", "Automotive", 
    "Energy", "Financial", "Retail", "Healthcare", "Entertainment"
  ];

  const renderStarRating = (rating: number, onChange: (rating: number) => void) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          className="p-0 h-auto"
        >
          <Star
            className={`h-5 w-5 transition-colors ${
              star <= rating ? "text-brand-accent fill-current" : "text-muted-foreground"
            }`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existingStance ? "Update Company Stance" : "Add Company Stance"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                placeholder="Enter company name"
                required
              />
            </div>
            <div>
              <Label htmlFor="company_category">Category</Label>
              <select
                id="company_category"
                value={formData.company_category}
                onChange={(e) => setFormData({ ...formData, company_category: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <Label>Your Stance</Label>
            <div className="flex gap-2 mt-2">
              {stanceOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, stance: option.value })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md border transition-colors ${
                      formData.stance === option.value
                        ? `${option.color} text-white`
                        : 'border-input bg-background hover:bg-accent'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium">Ratings</h4>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Ethics ({formData.ethics_rating}/5)</Label>
                {renderStarRating(formData.ethics_rating, (rating) => 
                  setFormData({ ...formData, ethics_rating: rating })
                )}
              </div>
              <div>
                <Label>Environment ({formData.environment_rating}/5)</Label>
                {renderStarRating(formData.environment_rating, (rating) => 
                  setFormData({ ...formData, environment_rating: rating })
                )}
              </div>
              <div>
                <Label>Politics ({formData.politics_rating}/5)</Label>
                {renderStarRating(formData.politics_rating, (rating) => 
                  setFormData({ ...formData, politics_rating: rating })
                )}
              </div>
              <div>
                <Label>Overall ({formData.overall_rating}/5)</Label>
                {renderStarRating(formData.overall_rating, (rating) => 
                  setFormData({ ...formData, overall_rating: rating })
                )}
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Share your thoughts about this company..."
              rows={3}
            />
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOrUpdateStance.isPending}>
              {createOrUpdateStance.isPending ? "Saving..." : "Save Stance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyStanceDialog;