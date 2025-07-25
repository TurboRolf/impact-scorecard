import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Star, Users, MessageCircle, TrendingUp, Search, Award } from "lucide-react";

const Creators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const categories = ["all", "Environment", "Ethics", "Politics", "Labor Rights", "Consumer Rights"];
  
  const mockCreators = [
    {
      id: 1,
      name: "Sarah Green",
      username: "sarahgreen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150",
      bio: "Environmental advocate & ethical business researcher. Helping consumers make informed choices for a better world.",
      specialties: ["Environment", "Ethics"],
      followers: 12847,
      reviews: 156,
      avgRating: 4.8,
      verified: true,
      recentReview: {
        company: "Tesla",
        rating: 3,
        preview: "Mixed feelings on Tesla's latest sustainability report..."
      }
    },
    {
      id: 2,
      name: "Michael Ethics",
      username: "ethicalmike",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
      bio: "Corporate accountability researcher and boycott organizer. Fighting for fair labor practices worldwide.",
      specialties: ["Labor Rights", "Ethics"],
      followers: 8934,
      reviews: 89,
      avgRating: 4.6,
      verified: true,
      recentReview: {
        company: "FastFashion Corp",
        rating: 1,
        preview: "Continued exploitation of workers despite public promises..."
      }
    },
    {
      id: 3,
      name: "Emma Climate",
      username: "emmac",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      bio: "Climate researcher and environmental policy analyst. Tracking corporate environmental impact and greenwashing.",
      specialties: ["Environment", "Politics"],
      followers: 15623,
      reviews: 203,
      avgRating: 4.9,
      verified: true,
      recentReview: {
        company: "Oil Giant Corp",
        rating: 1,
        preview: "Environmental destruction continues with zero accountability..."
      }
    },
    {
      id: 4,
      name: "Dr. Sarah Justice",
      username: "drjustice",
      avatar: "https://images.unsplash.com/photo-1594824475403-23cea4b9c506?w=150",
      bio: "Healthcare policy researcher and patient rights advocate. Exposing pharmaceutical industry practices.",
      specialties: ["Consumer Rights", "Ethics"],
      followers: 6789,
      reviews: 67,
      avgRating: 4.7,
      verified: false,
      recentReview: {
        company: "Big Pharma Inc",
        rating: 1,
        preview: "Price gouging continues to harm patients..."
      }
    },
    {
      id: 5,
      name: "Alex Privacy",
      username: "alexprivacy",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      bio: "Digital rights advocate and privacy researcher. Investigating tech company data practices.",
      specialties: ["Consumer Rights", "Politics"],
      followers: 9876,
      reviews: 124,
      avgRating: 4.5,
      verified: true,
      recentReview: {
        company: "Tech Corp",
        rating: 2,
        preview: "Recent privacy violations show concerning patterns..."
      }
    },
    {
      id: 6,
      name: "Jordan Fair",
      username: "jordanfair",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
      bio: "Fair trade and supply chain transparency advocate. Investigating global corporate responsibility.",
      specialties: ["Labor Rights", "Environment"],
      followers: 5432,
      reviews: 78,
      avgRating: 4.4,
      verified: false,
      recentReview: {
        company: "Global Retail Corp",
        rating: 2,
        preview: "Supply chain transparency remains a major concern..."
      }
    }
  ];

  const filteredCreators = mockCreators.filter(creator =>
    (selectedCategory === "all" || creator.specialties.includes(selectedCategory)) &&
    (searchTerm === "" || 
     creator.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
     creator.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
     creator.bio.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Featured Creators</h1>
          <p className="text-muted-foreground">
            Follow expert researchers and advocates for in-depth company analysis and ethical insights.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <Card key={creator.id} className="hover:shadow-card transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={creator.avatar} />
                    <AvatarFallback className="text-lg">{creator.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-lg truncate">{creator.name}</CardTitle>
                      {creator.verified && (
                        <Award className="h-4 w-4 text-earth-blue flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">@{creator.username}</p>
                    
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(creator.avgRating) 
                              ? "text-earth-orange fill-current" 
                              : "text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="text-xs text-muted-foreground ml-1">
                        {creator.avgRating}/5
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {creator.bio}
                </p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {creator.specialties.map((specialty) => (
                    <Badge key={specialty} variant="outline" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground mb-4">
                  <div>
                    <div className="font-semibold text-foreground">{creator.followers.toLocaleString()}</div>
                    <div>Followers</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{creator.reviews}</div>
                    <div>Reviews</div>
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{creator.avgRating}</div>
                    <div>Rating</div>
                  </div>
                </div>
                
                {creator.recentReview && (
                  <div className="bg-muted/50 rounded-lg p-3 mb-4">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium">{creator.recentReview.company}</span>
                      <div className="flex items-center gap-1">
                        {[...Array(creator.recentReview.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-earth-orange fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {creator.recentReview.preview}
                    </p>
                  </div>
                )}
                
                <div className="flex gap-2">
                  <Button variant="follow" size="sm" className="flex-1">
                    <Users className="h-3 w-3 mr-1" />
                    Follow
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <MessageCircle className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Creators;