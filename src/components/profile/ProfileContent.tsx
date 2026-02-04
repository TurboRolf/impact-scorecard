import React from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import UserStancesList from "@/components/UserStancesList";
import UserReviewsList from "@/components/UserReviewsList";
import UserBoycottsList from "@/components/UserBoycottsList";

interface ProfileContentProps {
  userId?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
  showPosts?: boolean;
}

const ProfileContent = ({ userId, activeTab, onTabChange, showPosts = true }: ProfileContentProps) => {
  const navigate = useNavigate();

  const tabs = [
    { value: "stances", label: "Stances", mobileLabel: "Stances" },
    ...(showPosts ? [{ value: "posts", label: "Posts", mobileLabel: "Posts" }] : []),
    { value: "reviews", label: "Reviews", mobileLabel: "Reviews" },
    { value: "boycotts", label: "Boycotts", mobileLabel: "Boycotts" },
  ];

  return (
    <div className="w-full">
      {/* Mobile: Compact dropdown */}
      <div className="md:hidden mb-3">
        <Select value={activeTab} onValueChange={onTabChange}>
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Select content" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.mobileLabel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: Traditional Tabs */}
      <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
        <TabsList className={`hidden md:grid w-full ${showPosts ? 'grid-cols-4' : 'grid-cols-3'}`}>
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
        
        <TabsContent value="stances" className="mt-3 md:mt-6">
          <UserStancesList userId={userId} />
        </TabsContent>

        {showPosts && (
          <TabsContent value="posts" className="mt-3 md:mt-6">
            <Card>
              <CardContent className="p-4 md:p-8 text-center">
                <p className="text-sm text-muted-foreground mb-3">
                  No posts yet. Share your thoughts to get started!
                </p>
                <Button onClick={() => navigate('/feed')} variant="earth" size="sm">
                  Create Your First Post
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        
        <TabsContent value="reviews" className="mt-3 md:mt-6">
          <UserReviewsList userId={userId} />
        </TabsContent>
        
        <TabsContent value="boycotts" className="mt-3 md:mt-6">
          <UserBoycottsList userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileContent;
