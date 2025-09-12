import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Star, Users, MessageCircle, TrendingUp, Search, Award } from "lucide-react";
import { useCreators } from "@/hooks/useProfile";

const Creators = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: creators = [], isLoading } = useCreators();
  
  const filteredCreators = creators.filter(creator =>
    searchTerm === "" || 
    creator.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    creator.bio?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
        <Navigation />
        <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
          <div className="flex items-center justify-center py-20">
            <p className="text-muted-foreground">Loading creators...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle pb-20 md:pb-8">
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
        </div>

        {/* Creators Grid */}
        {filteredCreators.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">No creators found.</p>
            <p className="text-sm text-muted-foreground">
              Be the first creator! Switch to creator mode in your profile settings.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCreators.map((creator) => (
              <Card key={creator.id} className="hover:shadow-card transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={creator.username ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${creator.username}` : undefined} />
                      <AvatarFallback className="text-lg">
                        {creator.display_name?.charAt(0) || creator.username?.charAt(0) || 'C'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <CardTitle className="text-lg truncate">
                          {creator.display_name || creator.username || 'Anonymous Creator'}
                        </CardTitle>
                        <Award className="h-4 w-4 text-earth-blue flex-shrink-0" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        @{creator.username || 'username'}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {creator.bio || 'No bio provided yet.'}
                  </p>
                  
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
        )}
      </div>
    </div>
  );
};

export default Creators;