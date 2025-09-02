import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star, ThumbsUp, Minus, ThumbsDown } from "lucide-react";
import { useCreateOrUpdateStance, CompanyStance, useCompanies } from "@/hooks/useCompanyStances";
import { useCreatePost } from "@/hooks/usePosts";

interface CompanyStanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName?: string;
  companyCategory?: string;
  existingStance?: {
    stance: CompanyStance;
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
    notes: existingStance?.notes || ""
  });
  const [postToFeed, setPostToFeed] = useState(false);

  const { data: companies = [] } = useCompanies();
  const createOrUpdateStance = useCreateOrUpdateStance();
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) return;

    try {
      await createOrUpdateStance.mutateAsync(formData);
      
      // Create post if option is selected
      if (postToFeed && formData.notes.trim()) {
        const stanceText = formData.stance === 'recommend' ? 'recommend' : 
                          formData.stance === 'discourage' ? 'discourage' : 
                          'am neutral on';
        
        const postContent = `I ${stanceText} ${formData.company_name}. ${formData.notes}`;
        
        await createPost.mutateAsync({
          content: postContent,
          company_name: formData.company_name,
          company_category: formData.company_category,
        });
      }
      
      onOpenChange(false);
      setFormData({
        company_name: "",
        company_category: "",
        stance: 'neutral',
        notes: ""
      });
      setPostToFeed(false);
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
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


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {existingStance ? "Update Company Stance" : "Add Company Stance"}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Set your general stance on this company. For detailed category-specific reviews, use the Review feature.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">Company Name *</Label>
              <Select 
                value={formData.company_name} 
                onValueChange={(value) => {
                  const selectedCompany = companies.find(c => c.name === value);
                  setFormData({ 
                    ...formData, 
                    company_name: value,
                    company_category: selectedCompany?.category || ""
                  });
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="post-to-feed" 
              checked={postToFeed}
              onCheckedChange={(checked) => setPostToFeed(checked === true)}
            />
            <Label htmlFor="post-to-feed" className="text-sm">
              Post this stance to my feed (requires notes)
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOrUpdateStance.isPending || createPost.isPending}>
              {createOrUpdateStance.isPending || createPost.isPending ? "Saving..." : "Save Stance"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyStanceDialog;