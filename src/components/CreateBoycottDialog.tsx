import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useCompanies } from "@/hooks/useCompanyStances";
import { Plus } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface CreateBoycottDialogProps {
  onBoycottCreated: () => void;
}

export const CreateBoycottDialog = ({ onBoycottCreated }: CreateBoycottDialogProps) => {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { data: companies = [] } = useCompanies();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    subject: "",
    category_id: "",
    impact: "medium"
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open) {
      fetchCategories();
    }
  }, [open]);

  const fetchCategories = async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load categories",
        variant: "destructive"
      });
    } else {
      setCategories(data || []);
    }
  };

  const checkDuplicateSubject = async (subject: string) => {
    const { data, error } = await supabase
      .from('boycotts')
      .select('id')
      .eq('status', 'active')
      .ilike('subject', subject.trim());
    
    if (error) {
      console.error('Error checking duplicate:', error);
      return false;
    }
    
    return data && data.length > 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if user is authenticated
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "Authentication required",
          description: "You need to be logged in to create a boycott",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      // Check for duplicate subject
      const isDuplicate = await checkDuplicateSubject(formData.subject);
      if (isDuplicate) {
        toast({
          title: "Duplicate boycott",
          description: "A boycott with this subject already exists. Please join the existing one or create a boycott with a different subject.",
          variant: "destructive"
        });
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from('boycotts')
        .insert({
          title: formData.title,
          description: formData.description,
          company: formData.company,
          subject: formData.subject,
          category_id: formData.category_id,
          impact: formData.impact,
          organizer_id: user.id
        });

      if (error) {
        throw error;
      }

      toast({
        title: "Boycott created",
        description: "Your boycott has been created successfully!",
        variant: "default"
      });

      // Reset form and close dialog
      setFormData({
        title: "",
        description: "",
        company: "",
        subject: "",
        category_id: "",
        impact: "medium"
      });
      setOpen(false);
      onBoycottCreated();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create boycott",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="h-4 w-4" />
          Start Boycott
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Boycott</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Boycott Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Stop FastFashion Corp Sweatshops"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Target Company</Label>
            <Select
              value={formData.company}
              onValueChange={(value) => setFormData(prev => ({ ...prev, company: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a company" />
              </SelectTrigger>
              <SelectContent>
                {companies.map((company) => (
                  <SelectItem key={company.id} value={company.name}>
                    {company.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject/Topic</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => setFormData(prev => ({ ...prev, subject: e.target.value }))}
              placeholder="e.g., Volvo factory CO2 emissions"
              required
            />
            <p className="text-xs text-muted-foreground">
              This must be unique - we'll prevent duplicate boycotts on the same topic
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={formData.category_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category_id: value }))}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="impact">Expected Impact</Label>
            <Select
              value={formData.impact}
              onValueChange={(value) => setFormData(prev => ({ ...prev, impact: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="very-high">Very High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Explain why you're organizing this boycott and what you hope to achieve..."
              rows={4}
              required
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Boycott"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};