import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AlertTriangle, Users, Calendar, TrendingUp, Search, Plus } from "lucide-react";

const Boycotts = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const mockBoycotts = [
    {
      id: 1,
      title: "Stop FastFashion Corp Sweatshops",
      description: "FastFashion Corp continues to use sweatshop labor despite repeated promises to improve working conditions. Join us in demanding fair wages and safe working environments.",
      company: "FastFashion Corp",
      organizer: {
        name: "Michael Ethics",
        username: "ethicalmike",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150"
      },
      participants: 2847,
      startDate: "2023-11-15",
      category: "Labor Rights",
      status: "active",
      impact: "high"
    },
    {
      id: 2,
      title: "Boycott Oil Giant Environmental Destruction",
      description: "Oil Giant Corp's recent oil spill has devastated local ecosystems. We demand immediate cleanup action and commitment to renewable energy transition.",
      company: "Oil Giant Corp",
      organizer: {
        name: "Emma Climate",
        username: "emmac",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150"
      },
      participants: 5624,
      startDate: "2023-10-20",
      category: "Environment",
      status: "active",
      impact: "very-high"
    },
    {
      id: 3,
      title: "Stop Big Pharma Price Gouging",
      description: "Big Pharma Inc has increased insulin prices by 300% over the past decade, making life-saving medication unaffordable for millions.",
      company: "Big Pharma Inc",
      organizer: {
        name: "Dr. Sarah Justice",
        username: "drjustice",
        avatar: "https://images.unsplash.com/photo-1594824475403-23cea4b9c506?w=150"
      },
      participants: 12543,
      startDate: "2023-09-10",
      category: "Healthcare Access",
      status: "successful",
      impact: "very-high"
    },
    {
      id: 4,
      title: "Tech Corp Privacy Violation Response",
      description: "Recent data breaches and privacy violations by Tech Corp show complete disregard for user privacy rights. Demand better data protection.",
      company: "Tech Corp",
      organizer: {
        name: "Alex Privacy",
        username: "alexprivacy",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150"
      },
      participants: 8934,
      startDate: "2023-12-01",
      category: "Privacy Rights",
      status: "active",
      impact: "medium"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-earth-blue text-white";
      case "successful":
        return "bg-earth-green text-white";
      case "ended":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "very-high":
        return "text-destructive";
      case "high":
        return "text-earth-orange";
      case "medium":
        return "text-earth-blue";
      default:
        return "text-muted-foreground";
    }
  };

  const filteredBoycotts = mockBoycotts.filter(boycott =>
    searchTerm === "" || 
    boycott.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    boycott.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-6xl mx-auto pt-20 px-4 pb-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Active Boycotts</h1>
          <p className="text-muted-foreground">
            Join collective action for corporate accountability and ethical business practices.
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search boycotts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="activism" className="gap-2">
            <Plus className="h-4 w-4" />
            Start Boycott
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-earth-blue">23</div>
              <div className="text-sm text-muted-foreground">Active Boycotts</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-earth-green">157K</div>
              <div className="text-sm text-muted-foreground">Total Participants</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-earth-orange">12</div>
              <div className="text-sm text-muted-foreground">Successful Campaigns</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-destructive">8</div>
              <div className="text-sm text-muted-foreground">Companies Changed</div>
            </CardContent>
          </Card>
        </div>

        {/* Boycotts List */}
        <div className="space-y-4">
          {filteredBoycotts.map((boycott) => (
            <Card key={boycott.id} className="hover:shadow-card transition-all duration-300">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-5 w-5 text-destructive" />
                      <CardTitle className="text-lg">{boycott.title}</CardTitle>
                      <Badge className={getStatusColor(boycott.status)} variant="secondary">
                        {boycott.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Against: <span className="font-medium">{boycott.company}</span> • 
                      Category: <span className="font-medium">{boycott.category}</span>
                    </p>
                  </div>
                  <div className={`text-right ${getImpactColor(boycott.impact)}`}>
                    <TrendingUp className="h-4 w-4 mb-1 ml-auto" />
                    <div className="text-xs font-medium capitalize">{boycott.impact} impact</div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-foreground mb-4">{boycott.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={boycott.organizer.avatar} />
                        <AvatarFallback className="text-xs">
                          {boycott.organizer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-muted-foreground">
                        by @{boycott.organizer.username}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      {boycott.participants.toLocaleString()} participants
                    </div>
                    
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Started {new Date(boycott.startDate).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      Learn More
                    </Button>
                    {boycott.status === "active" && (
                      <Button variant="boycott" size="sm">
                        Join Boycott
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Boycotts;