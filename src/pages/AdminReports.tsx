import { useEffect, useMemo, useState } from "react";
import { Navigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/hooks/useAuth";
import { useUserRoles } from "@/hooks/useUserRole";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { Trash2, CheckCircle2, X, Loader2 } from "lucide-react";

interface ReportRow {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  details: string | null;
  status: string;
  created_at: string;
}

const AdminReports = () => {
  useDocumentTitle("Admin · Reports");
  const { user, isLoading: authLoading } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useUserRoles();
  const { toast } = useToast();
  const qc = useQueryClient();
  const [busyId, setBusyId] = useState<string | null>(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin_reports"],
    enabled: !!user && isAdmin,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("post_reports")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as ReportRow[];
    },
  });

  const postIds = useMemo(() => Array.from(new Set(reports.map((r) => r.post_id))), [reports]);
  const reporterIds = useMemo(() => Array.from(new Set(reports.map((r) => r.reporter_id))), [reports]);

  const { data: postsMap = {} } = useQuery({
    queryKey: ["admin_reports_posts", postIds],
    enabled: postIds.length > 0,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("id, content, user_id, created_at, is_boycott, company_name")
        .in("id", postIds);
      if (error) throw error;
      const map: Record<string, any> = {};
      (data ?? []).forEach((p) => { map[p.id] = p; });
      return map;
    },
  });

  const { data: profilesMap = {} } = useQuery({
    queryKey: ["admin_reports_profiles", reporterIds, postsMap],
    enabled: reporterIds.length > 0,
    queryFn: async () => {
      const ids = Array.from(new Set([
        ...reporterIds,
        ...Object.values(postsMap as Record<string, any>).map((p: any) => p.user_id),
      ].filter(Boolean)));
      const { data, error } = await supabase
        .from("profiles")
        .select("user_id, username, display_name")
        .in("user_id", ids);
      if (error) throw error;
      const map: Record<string, any> = {};
      (data ?? []).forEach((p) => { map[p.user_id] = p; });
      return map;
    },
  });

  if (authLoading || roleLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></main>
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const grouped = reports.reduce<Record<string, ReportRow[]>>((acc, r) => {
    (acc[r.post_id] ||= []).push(r);
    return acc;
  }, {});

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin_reports"] });
    qc.invalidateQueries({ queryKey: ["admin_reports_posts"] });
  };

  const updateStatus = async (postId: string, status: string) => {
    setBusyId(postId);
    const { error } = await supabase
      .from("post_reports")
      .update({ status, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("post_id", postId);
    setBusyId(null);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated", description: `Marked as ${status}.` });
    refresh();
  };

  const removePost = async (postId: string) => {
    if (!confirm("Permanently delete this post? This cannot be undone.")) return;
    setBusyId(postId);
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (!error) {
      await supabase
        .from("post_reports")
        .update({ status: "removed", reviewed_at: new Date().toISOString(), reviewed_by: user.id })
        .eq("post_id", postId);
    }
    setBusyId(null);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Post removed", description: "The post was deleted." });
    refresh();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 pt-20 pb-24 md:pb-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">Reported posts</h1>
        <p className="text-sm text-muted-foreground mb-6">Review reports from users and take moderation actions.</p>

        {isLoading && <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />}
        {!isLoading && reports.length === 0 && (
          <Card><CardContent className="py-12 text-center text-sm text-muted-foreground">No reports yet.</CardContent></Card>
        )}

        <div className="space-y-4">
          {Object.entries(grouped).map(([postId, list]) => {
            const post = (postsMap as any)[postId];
            const author = post && (profilesMap as any)[post.user_id];
            const allStatuses = new Set(list.map((r) => r.status));
            const statusBadge = allStatuses.has("pending") ? "pending" : Array.from(allStatuses)[0];
            return (
              <Card key={postId}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <CardTitle className="text-base">
                        {post ? (
                          <>Post by {author?.display_name || author?.username || "Unknown"}</>
                        ) : (
                          <span className="text-destructive">Post deleted</span>
                        )}
                      </CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {list.length} report{list.length > 1 ? "s" : ""} · status: <Badge variant={statusBadge === "pending" ? "destructive" : "secondary"}>{statusBadge}</Badge>
                      </p>
                    </div>
                    <div className="flex gap-2 flex-wrap">
                      <Button size="sm" variant="outline" disabled={busyId === postId} onClick={() => updateStatus(postId, "reviewed")}>
                        <CheckCircle2 className="h-4 w-4 mr-1" /> Reviewed
                      </Button>
                      <Button size="sm" variant="outline" disabled={busyId === postId} onClick={() => updateStatus(postId, "dismissed")}>
                        <X className="h-4 w-4 mr-1" /> Dismiss
                      </Button>
                      {post && (
                        <Button size="sm" variant="destructive" disabled={busyId === postId} onClick={() => removePost(postId)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Remove post
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {post && (
                    <div className="rounded-md bg-muted/50 p-3 text-sm">
                      {post.is_boycott && <Badge variant="destructive" className="mb-1.5">Boycott</Badge>}
                      {post.company_name && <p className="text-xs text-muted-foreground mb-1">Tagged: {post.company_name}</p>}
                      <p className="whitespace-pre-wrap">{post.content}</p>
                    </div>
                  )}
                  <div className="space-y-2">
                    {list.map((r) => {
                      const reporter = (profilesMap as any)[r.reporter_id];
                      return (
                        <div key={r.id} className="border-l-2 border-destructive/50 pl-3 py-1">
                          <p className="text-xs">
                            <span className="font-medium">{reporter?.display_name || reporter?.username || "User"}</span>
                            <span className="text-muted-foreground"> · {new Date(r.created_at).toLocaleString()}</span>
                          </p>
                          <p className="text-sm font-medium">{r.reason}</p>
                          {r.details && <p className="text-sm text-muted-foreground">{r.details}</p>}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default AdminReports;