import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Star, Search, Building2, Calendar, Trash2, Edit } from "lucide-react";
import { useUserReviews } from "@/hooks/useCompanyReviews";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UserReviewsListProps {
  userId?: string;
}

const UserReviewsList = ({ userId }: UserReviewsListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const { data: reviews = [], isLoading, refetch } = useUserReviews(userId);
  const { toast } = useToast();

  // Reviews are already filtered by userId in the hook
  const userReviews = reviews;

  // Filter reviews based on search and category
  const filteredReviews = userReviews.filter(review => {
    const matchesSearch = review.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (review.review_text?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);
    const matchesCategory = !selectedCategory || review.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(userReviews.map(review => review.category)));

  const handleDeleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from("company_reviews")
        .delete()
        .eq("id", reviewId);

      if (error) throw error;

      toast({
        title: "Review deleted",
        description: "Your review has been successfully deleted.",
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete review",
        variant: "destructive",
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{rating}/5</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-muted-foreground">Loading your reviews...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userReviews.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userReviews.length > 0 
                ? (userReviews.reduce((sum, review) => sum + review.rating, 0) / userReviews.length).toFixed(1)
                : "0.0"
              }
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Categories Reviewed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{categories.length}</div>
          </CardContent>
        </Card>
      </div>

      {userReviews.length > 0 && (
        <>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search reviews..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Category Filter */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </Button>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Reviews List */}
      {filteredReviews.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center text-muted-foreground">
            {userReviews.length === 0 
              ? "You haven't written any reviews yet. Start by reviewing companies on the Companies page!"
              : "No reviews match your current filters."
            }
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building2 className="h-5 w-5 text-muted-foreground" />
                      <h3 className="font-semibold text-lg">{review.company_name}</h3>
                      <Badge variant="outline">{review.category}</Badge>
                    </div>
                    
                    <div className="mb-3">
                      {renderStars(review.rating)}
                    </div>
                    
                    {review.review_text && (
                      <p className="text-foreground mb-3 leading-relaxed">
                        {review.review_text}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(review.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReview(review.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserReviewsList;