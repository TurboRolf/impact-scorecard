import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REASONS = [
  "Spam",
  "Harassment",
  "Hate speech",
  "Misinformation",
  "Illegal content",
  "Other",
];

const schema = z.object({
  reason: z.string().min(1, "Please choose a reason"),
  details: z.string().trim().max(500, "Max 500 characters").optional(),
});

interface Props {
  postId: string;
  open: boolean;
  onOpenChange: (o: boolean) => void;
}

const ReportPostDialog = ({ postId, open, onOpenChange }: Props) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const parsed = schema.safeParse({ reason, details });
    if (!parsed.success) {
      toast({ title: "Invalid input", description: parsed.error.issues[0].message, variant: "destructive" });
      return;
    }
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from("post_reports").insert({
      post_id: postId,
      reporter_id: user.id,
      reason: parsed.data.reason,
      details: parsed.data.details || null,
    });
    setSubmitting(false);
    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already reported", description: "You've already reported this post." });
        onOpenChange(false);
        return;
      }
      toast({ title: "Could not submit", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Report submitted", description: "Thank you. Our team will review it." });
    setReason("");
    setDetails("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Report post</DialogTitle>
          <DialogDescription>Help us keep Ethisay safe. Reports are reviewed by moderators.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Reason</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger><SelectValue placeholder="Choose a reason" /></SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Details (optional)</Label>
            <Textarea
              maxLength={500}
              rows={4}
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="Add context (max 500 characters)"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={submitting || !reason}>
            {submitting ? "Submitting..." : "Submit report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReportPostDialog;