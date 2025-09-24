import { useState } from "react";
import Navigation from "@/components/Navigation";
import CompanyCard from "@/components/CompanyCard";
import CompanyStanceDialog from "@/components/CompanyStanceDialog";
import CompanyReviewDialog from "@/components/CompanyReviewDialog";
import { CreateBoycottDialog } from "@/components/CreateBoycottDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Globe, Users, Plus, Star } from "lucide-react";
import { useCompanies } from "@/hooks/useCompanyStances";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewType, setViewType] = useState<"global" | "following">("global");
  const [stanceDialogOpen, setStanceDialogOpen] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [boycottDialogOpen, setBoycottDialogOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<{name: string, category: string} | null>(null);
  
  const { data: companies = [], isLoading } = useCompanies();
  
  const categories = [
    "all", "Technology", "Fashion", "Food & Beverage", "Automotive", 
    "Energy", "Financial", "Retail", "Healthcare", "Entertainment"
  ];

  const filteredCompanies = companies.filter(company => 
    (selectedCategory === "all" || company.category === selectedCategory) &&
    (searchTerm === "" || company.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleRateCompany = (companyName: string, companyCategory: string) => {
    setSelectedCompany({ name: companyName, category: companyCategory });
    setStanceDialogOpen(true);
  };

  const handleReviewCompany = (companyName: string, companyCategory: string) => {
    setSelectedCompany({ name: companyName, category: companyCategory });
    setReviewDialogOpen(true);
  };

  const handleStartBoycott = (companyName: string, companyCategory: string) => {
    setSelectedCompany({ name: companyName, category: companyCategory });
    setBoycottDialogOpen(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading companies...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-6">
          <div className="flex items-start justify-between mb-3 sm:mb-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">Company Directory</h1>
              <p className="text-sm sm:text-base text-muted-foreground">
                Rate companies and share your stance on ethical business practices.
              </p>
            </div>
            
            <div className="flex gap-1 sm:gap-2 ml-3">
              <Button onClick={() => setStanceDialogOpen(true)} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4" variant="outline" size="sm">
                <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add Stance</span>
                <span className="sm:hidden">Stance</span>
              </Button>
              <Button onClick={() => setReviewDialogOpen(true)} className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-4" size="sm">
                <Star className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Add Review</span>
                <span className="sm:hidden">Review</span>
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-recommend rounded-full"></div>
              <span className="text-xs sm:text-sm">Recommend</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-neutral rounded-full"></div>
              <span className="text-xs sm:text-sm">Neutral</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 bg-discourage rounded-full"></div>
              <span className="text-xs sm:text-sm">Discourage</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-4 sm:mb-6">
          <div className="flex gap-2 sm:gap-4 mb-3 sm:mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 sm:pl-10 text-sm sm:text-base h-9 sm:h-10"
              />
            </div>
            
            <div className="flex gap-1 sm:gap-2">
              <Button
                variant={viewType === "global" ? "default" : "outline"}
                onClick={() => setViewType("global")}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                size="sm"
              >
                <Globe className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Global</span>
              </Button>
              <Button
                variant={viewType === "following" ? "default" : "outline"}
                onClick={() => setViewType("following")}
                className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3"
                size="sm"
              >
                <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Following</span>
              </Button>
            </div>
          </div>
          
          <div className="flex gap-1.5 sm:gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize text-xs sm:text-sm px-2 py-1"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCompanies.map((company) => (
            <CompanyCard 
              key={company.id}
              id={company.id}
              name={company.name}
              category={company.category}
              logo={company.logo_url || undefined}
              overallRating={Math.round(company.avg_overall_rating || 0)}
              ethicsRating={Math.round(company.avg_ethics_rating || 0)}
              environmentRating={Math.round(company.avg_environment_rating || 0)}
              politicsRating={Math.round(company.avg_politics_rating || 0)}
              activeBoycotts={company.active_boycotts_count}
              trend="stable"
              description={company.description || ""}
              recommendCount={company.recommend_count}
              neutralCount={company.neutral_count}
              discourageCount={company.discourage_count}
              onRate={() => handleRateCompany(company.name, company.category)}
              onReview={() => handleReviewCompany(company.name, company.category)}
              onStartBoycott={() => handleStartBoycott(company.name, company.category)}
            />
          ))}
        </div>
        
        {filteredCompanies.length === 0 && (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No companies found matching your criteria.</p>
            <Button onClick={() => setStanceDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add a Company
            </Button>
          </div>
        )}
        
      <CompanyStanceDialog
        open={stanceDialogOpen}
        onOpenChange={setStanceDialogOpen}
        companyName={selectedCompany?.name}
        companyCategory={selectedCompany?.category}
      />
      
      <CompanyReviewDialog
        open={reviewDialogOpen}
        onOpenChange={setReviewDialogOpen}
        companyName={selectedCompany?.name}
      />
      
      <CreateBoycottDialog
        open={boycottDialogOpen}
        onOpenChange={setBoycottDialogOpen}
        preselectedCompany={selectedCompany?.name}
        onBoycottCreated={() => setBoycottDialogOpen(false)}
      />
      </div>
    </div>
  );
};

export default Companies;