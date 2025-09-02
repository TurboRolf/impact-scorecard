import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Star } from "lucide-react";
import { useCreateOrUpdateReview, ReviewCategory } from "@/hooks/useCompanyReviews";
import { useCompanies } from "@/hooks/useCompanyStances";
import { useCreatePost } from "@/hooks/usePosts";

interface CompanyReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  companyName?: string;
}

const CompanyReviewDialog = ({
  open,
  onOpenChange,
  companyName = ""
}: CompanyReviewDialogProps) => {
  const [formData, setFormData] = useState({
    company_name: companyName,
    category: 'environment' as ReviewCategory,
    rating: 3,
    review_text: ""
  });
  const [postToFeed, setPostToFeed] = useState(false);

  const { data: companies = [] } = useCompanies();
  const createOrUpdateReview = useCreateOrUpdateReview();
  const createPost = useCreatePost();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company_name.trim()) return;

    try {
      await createOrUpdateReview.mutateAsync(formData);
      
      // Create post if option is selected
      if (postToFeed && formData.review_text.trim()) {
        const categoryText = formData.category === 'overall' ? '' : ` (${formData.category})`;
        const starRating = '★'.repeat(formData.rating) + '☆'.repeat(5 - formData.rating);
        
        const postContent = `${starRating} ${formData.rating}/5 - ${formData.company_name}${categoryText}\n\n${formData.review_text}`;
        
        await createPost.mutateAsync({
          content: postContent,
          company_name: formData.company_name,
        });
      }
      
      onOpenChange(false);
      setFormData({
        company_name: "",
        category: 'environment',
        rating: 3,
        review_text: ""
      });
      setPostToFeed(false);
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const reviewCategories = [
    { value: 'environment' as ReviewCategory, label: 'Environment', description: 'Environmental practices and sustainability' },
    { value: 'ethics' as ReviewCategory, label: 'Ethics', description: 'Business ethics and social responsibility' },
    { value: 'politics' as ReviewCategory, label: 'Politics', description: 'Political positions and contributions' },
    { value: 'overall' as ReviewCategory, label: 'Overall', description: 'General impression and recommendation' },
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
            className={`h-6 w-6 transition-colors ${
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
          <DialogTitle>Add Company Review</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="company_name">Company Name *</Label>
            <Select 
              value={formData.company_name} 
              onValueChange={(value) => setFormData({ ...formData, company_name: value })}
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
            <Label>Review Category *</Label>
            <div className="grid grid-cols-2 gap-3 mt-2">
              {reviewCategories.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: category.value })}
                  className={`p-4 rounded-lg border text-left transition-colors ${
                    formData.category === category.value
                      ? 'border-primary bg-primary/5'
                      : 'border-input bg-background hover:bg-accent'
                  }`}
                >
                  <div className="font-medium">{category.label}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    {category.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Rating ({formData.rating}/5)</Label>
            <div className="mt-2">
              {renderStarRating(formData.rating, (rating) => 
                setFormData({ ...formData, rating })
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="review_text">Review (Optional)</Label>
            <Textarea
              id="review_text"
              value={formData.review_text}
              onChange={(e) => setFormData({ ...formData, review_text: e.target.value })}
              placeholder={`Share your thoughts about ${formData.company_name}'s ${formData.category} practices...`}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox 
              id="post-to-feed" 
              checked={postToFeed}
              onCheckedChange={(checked) => setPostToFeed(checked === true)}
            />
            <Label htmlFor="post-to-feed" className="text-sm">
              Post this review to my feed (requires review text)
            </Label>
          </div>

          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createOrUpdateReview.isPending || createPost.isPending}>
              {createOrUpdateReview.isPending || createPost.isPending ? "Saving..." : "Save Review"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CompanyReviewDialog;