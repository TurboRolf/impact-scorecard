import { useState } from "react";
import Navigation from "@/components/Navigation";
import PostCard from "@/components/PostCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Image, Building2 } from "lucide-react";

const Feed = () => {
  const [newPost, setNewPost] = useState("");
  
  const mockPosts = [
    {
      user: {
        name: "Sarah Green",
        username: "sarahgreen",
        avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e5?w=150",
        isCreator: true
      },
      content: "Just finished a deep dive into Tesla's latest sustainability report. While their EV mission is commendable, their labor practices still need significant improvement. Mixed feelings on this one.",
      company: {
        name: "Tesla",
        rating: 3,
        category: "Electric Vehicles"
      },
      timestamp: "2h",
      likes: 24,
      comments: 7
    },
    {
      user: {
        name: "Michael Ethics",
        username: "ethicalmike",
        isCreator: true
      },
      content: "🚨 Starting a boycott against FastFashion Corp for their continued use of sweatshop labor despite multiple promises to change. Who's with me?",
      isBoycott: true,
      timestamp: "4h",
      likes: 156,
      comments: 43
    },
    {
      user: {
        name: "Emma Climate",
        username: "emmac",
      },
      content: "Patagonia continues to impress with their environmental initiatives. Just learned they donated their entire $3B company to fight climate change. This is how business should be done! 🌍",
      company: {
        name: "Patagonia",
        rating: 5,
        category: "Outdoor Apparel"
      },
      timestamp: "6h",
      likes: 89,
      comments: 12
    },
    {
      user: {
        name: "David Consumer",
        username: "davidc",
      },
      content: "Switching from Amazon to local businesses for my holiday shopping. Yes, it's more expensive and takes longer, but supporting ethical companies is worth it.",
      timestamp: "8h",
      likes: 34,
      comments: 18
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      
      <div className="max-w-2xl mx-auto pt-20 px-4 pb-8">
        {/* Create Post */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <Textarea
              placeholder="Share your thoughts on a company's ethics, environmental impact, or political stance..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="min-h-24 resize-none border-0 focus-visible:ring-0 bg-transparent"
            />
            <div className="flex items-center justify-between mt-3 pt-3 border-t">
              <div className="flex gap-2">
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Building2 className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="earth" size="sm" disabled={!newPost.trim()}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Feed */}
        <div className="space-y-4">
          {mockPosts.map((post, index) => (
            <PostCard key={index} {...post} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Feed;