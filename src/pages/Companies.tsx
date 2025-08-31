import { useState } from "react";
import Navigation from "@/components/Navigation";
import CompanyCard from "@/components/CompanyCard";
import CompanyStanceDialog from "@/components/CompanyStanceDialog";
import CompanyReviewDialog from "@/components/CompanyReviewDialog";
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle">
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
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Company Directory</h1>
              <p className="text-muted-foreground">
                Rate companies and share your stance on ethical business practices.
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button onClick={() => setStanceDialogOpen(true)} className="gap-2" variant="outline">
                <Plus className="h-4 w-4" />
                Add Stance
              </Button>
              <Button onClick={() => setReviewDialogOpen(true)} className="gap-2">
                <Star className="h-4 w-4" />
                Add Review
              </Button>
            </div>
          </div>
          
          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-recommend rounded-full"></div>
              <span className="text-sm">Recommend</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-neutral rounded-full"></div>
              <span className="text-sm">Neutral</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-discourage rounded-full"></div>
              <span className="text-sm">Discourage</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button
                variant={viewType === "global" ? "default" : "outline"}
                onClick={() => setViewType("global")}
                className="gap-2"
              >
                <Globe className="h-4 w-4" />
                Global
              </Button>
              <Button
                variant={viewType === "following" ? "default" : "outline"}
                onClick={() => setViewType("following")}
                className="gap-2"
              >
                <Users className="h-4 w-4" />
                Following
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer capitalize"
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
      </div>
    </div>
  );
};

export default Companies;