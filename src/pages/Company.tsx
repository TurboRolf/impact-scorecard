import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navigation from "@/components/Navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star, TrendingDown, TrendingUp, AlertTriangle, ThumbsUp, Minus, ThumbsDown, ArrowLeft, ExternalLink } from "lucide-react";
import CompanyStanceDialog from "@/components/CompanyStanceDialog";
import CompanyReviewDialog from "@/components/CompanyReviewDialog";
import { CreateBoycottDialog } from "@/components/CreateBoycottDialog";
import { useState } from "react";
import { useCompanyReviews } from "@/hooks/useCompanyReviews";
import { useBoycotts } from "@/hooks/useBoycotts";

const Company = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [stanceDialogOpen, setStanceDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [boycottDialogOpen, setBoycottDialogOpen] = useState(false);

  const { data: company, isLoading } = useQuery({
    queryKey: ["company", id],
    queryFn: async () => {
      if (!id) throw new Error("Company ID is required");
      
      const { data, error } = await supabase
        .from("company_ratings_view")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      
      if (error) throw error;
      if (!data) throw new Error("Company not found");
      
      return data;
    },
    enabled: !!id
  });

  const { data: reviews } = useCompanyReviews(company?.name || "");
  const { data: boycotts } = useBoycotts();

  const companyBoycotts = boycotts?.filter(boycott => 
    boycott.company === company?.name && boycott.status === "active"
  ) || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary pb-20 md:pb-8">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="flex items-center justify-center h-64">
            <div className="text-lg">Loading company details...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-gradient-primary pb-20 md:pb-8">
        <Navigation />
        <div className="container mx-auto px-4 pt-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Company Not Found</h1>
            <Button onClick={() => navigate("/companies")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Companies
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const ratings = [
    { label: "Ethics", value: Number(company.avg_ethics_rating || 0), color: "text-earth-blue" },
    { label: "Environment", value: Number(company.avg_environment_rating || 0), color: "text-earth-green" },
    { label: "Politics", value: Number(company.avg_politics_rating || 0), color: "text-earth-orange" },
  ];

    return (
      <div className="min-h-screen bg-gradient-primary pb-20 md:pb-8">
        <Navigation />
        
        <div className="container mx-auto px-4 pt-20 pb-8">
          <div className="mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/companies")}
              className="mb-4"
            >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Companies
          </Button>
            
            <div className="flex flex-col sm:flex-row sm:items-start gap-4 sm:gap-6 mb-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-subtle rounded-lg flex items-center justify-center mx-auto sm:mx-0">
                {company.logo_url ? (
                  <img src={company.logo_url} alt={company.name} className="w-12 h-12 sm:w-16 sm:h-16 object-contain" />
                ) : (
                  <span className="text-xl sm:text-2xl font-bold">{company.name?.charAt(0)}</span>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{company.name}</h1>
                <Badge variant="secondary" className="mb-2">{company.category}</Badge>
                <p className="text-muted-foreground mb-4 text-sm sm:text-base">{company.description}</p>
                
                <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 sm:h-5 sm:w-5 ${
                          i < Number(company.avg_overall_rating || 0) ? "text-earth-orange fill-current" : "text-muted-foreground"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-base sm:text-lg font-semibold">{Number(company.avg_overall_rating || 0).toFixed(1)}/5</span>
                  </div>
                  <div className="text-sm text-muted-foreground">{company.total_ratings} reviews</div>
                </div>
                
                {company.website_url && (
                  <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                    <a href={company.website_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Visit Website
                    </a>
                  </Button>
                )}
              </div>
            </div>
          
            {/* Rating Categories */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {ratings.map((rating) => (
              <Card key={rating.label}>
                <CardContent className="text-center py-4">
                  <div className={`text-2xl font-bold ${rating.color}`}>{rating.value.toFixed(1)}</div>
                  <div className="text-sm text-muted-foreground">{rating.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* User Stances */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Community Stance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center justify-center sm:block sm:text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ThumbsUp className="h-5 w-5 text-recommend" />
                    <span className="text-2xl font-bold text-recommend">{company.recommend_count}</span>
                  </div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Recommend</div>
                </div>
                <div className="flex items-center justify-center sm:block sm:text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Minus className="h-5 w-5 text-neutral" />
                    <span className="text-2xl font-bold text-neutral">{company.neutral_count}</span>
                  </div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Neutral</div>
                </div>
                <div className="flex items-center justify-center sm:block sm:text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <ThumbsDown className="h-5 w-5 text-discourage" />
                    <span className="text-2xl font-bold text-discourage">{company.discourage_count}</span>
                  </div>
                  <div className="text-sm sm:text-xs text-muted-foreground">Discourage</div>
                </div>
              </div>
              
              <Button onClick={() => setStanceDialogOpen(true)} className="w-full h-12">
                Share Your Stance
              </Button>
            </CardContent>
          </Card>
          
          {/* Active Boycotts Alert */}
          {company.active_boycotts_count > 0 && (
            <Card className="border-destructive bg-destructive/5 mb-6">
              <CardContent className="py-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <span className="font-medium text-destructive">
                    {company.active_boycotts_count} active boycott{company.active_boycotts_count > 1 ? 's' : ''} against this company
                  </span>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button onClick={() => setReviewDialogOpen(true)} variant="default" className="h-12 flex-1">
              Write Review
            </Button>
            <Button onClick={() => setBoycottDialogOpen(true)} variant="outline" className="h-12 flex-1">
              Start Boycott
            </Button>
          </div>
        </div>
        
        {/* Tabs for detailed information */}
        <Tabs defaultValue="reviews" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="reviews">Reviews ({reviews?.length || 0})</TabsTrigger>
            <TabsTrigger value="boycotts">Active Boycotts ({companyBoycotts.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="space-y-4">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg capitalize">{review.category} Review</CardTitle>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < review.rating ? "text-earth-orange fill-current" : "text-muted-foreground"
                            }`}
                          />
                        ))}
                        <span className="ml-1 font-semibold">{review.rating}/5</span>
                      </div>
                    </div>
                  </CardHeader>
                  {review.review_text && (
                    <CardContent>
                      <p className="text-muted-foreground">{review.review_text}</p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(review.created_at).toLocaleDateString()}
                      </p>
                    </CardContent>
                  )}
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No reviews yet. Be the first to review this company!</p>
                <Button onClick={() => setReviewDialogOpen(true)} className="mt-4">
                  Write First Review
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="boycotts" className="space-y-4">
            {companyBoycotts.length > 0 ? (
              companyBoycotts.map((boycott) => (
                <Card key={boycott.id}>
                  <CardHeader>
                    <CardTitle>{boycott.title}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Active</Badge>
                      <span className="text-sm text-muted-foreground">
                        {boycott.participants_count} participants
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-2">{boycott.description}</p>
                    <p className="text-sm text-muted-foreground">
                      Started on {new Date(boycott.start_date).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No active boycotts against this company.</p>
                <Button onClick={() => setBoycottDialogOpen(true)} className="mt-4">
                  Start a Boycott
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Dialogs */}
      <CompanyStanceDialog
        open={stanceDialogOpen}
        onOpenChange={setStanceDialogOpen}
        companyName={company.name || ""}
      />
      
      <CompanyReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        companyName={company.name || ""}
      />
      
      <CreateBoycottDialog
        open={boycottDialogOpen}
        onOpenChange={setBoycottDialogOpen}
        onBoycottCreated={() => setBoycottDialogOpen(false)}
        preselectedCompany={company.name || ""}
      />
    </div>
  );
};

export default Company;