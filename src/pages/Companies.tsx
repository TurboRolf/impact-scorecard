import { useState } from "react";
import Navigation from "@/components/Navigation";
import CompanyCard from "@/components/CompanyCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter } from "lucide-react";

const Companies = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = [
    "all", "Technology", "Fashion", "Food & Beverage", "Automotive", 
    "Energy", "Financial", "Retail", "Healthcare", "Entertainment"
  ];
  
  const mockCompanies = [
    {
      name: "Apple",
      category: "Technology",
      overallRating: 4,
      ethicsRating: 4,
      environmentRating: 4,
      politicsRating: 3,
      activeBoycotts: 0,
      trend: "up" as const,
      description: "Tech giant known for premium devices and privacy focus, working on carbon neutrality by 2030."
    },
    {
      name: "Amazon",
      category: "Technology",
      overallRating: 2,
      ethicsRating: 2,
      environmentRating: 2,
      politicsRating: 3,
      activeBoycotts: 3,
      trend: "down" as const,
      description: "E-commerce and cloud computing leader facing criticism for labor practices and tax avoidance."
    },
    {
      name: "Patagonia",
      category: "Fashion",
      overallRating: 5,
      ethicsRating: 5,
      environmentRating: 5,
      politicsRating: 5,
      activeBoycotts: 0,
      trend: "up" as const,
      description: "Outdoor clothing company committed to environmental activism and sustainable practices."
    },
    {
      name: "Tesla",
      category: "Automotive",
      overallRating: 3,
      ethicsRating: 3,
      environmentRating: 4,
      politicsRating: 2,
      activeBoycotts: 1,
      trend: "stable" as const,
      description: "Electric vehicle manufacturer leading the transition to sustainable transportation."
    },
    {
      name: "Nestlé",
      category: "Food & Beverage",
      overallRating: 2,
      ethicsRating: 1,
      environmentRating: 2,
      politicsRating: 2,
      activeBoycotts: 5,
      trend: "down" as const,
      description: "Global food conglomerate facing ongoing criticism for water rights and labor practices."
    },
    {
      name: "Ben & Jerry's",
      category: "Food & Beverage",
      overallRating: 4,
      ethicsRating: 5,
      environmentRating: 4,
      politicsRating: 5,
      activeBoycotts: 0,
      trend: "up" as const,
      description: "Ice cream company known for social activism and progressive values."
    }
  ];

  const filteredCompanies = mockCompanies.filter(company => 
    (selectedCategory === "all" || company.category === selectedCategory) &&
    (searchTerm === "" || company.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company Directory</h1>
          <p className="text-muted-foreground">
            Browse all companies in our database. View ratings, read reviews, and discover what the community thinks about corporate practices.
          </p>
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
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
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
          {filteredCompanies.map((company, index) => (
            <CompanyCard key={index} {...company} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Companies;