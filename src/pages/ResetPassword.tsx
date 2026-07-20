import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/hooks/useAuth";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"request" | "update">("request");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading: authLoading } = useAuth();
  useDocumentTitle("Reset Password");

  useEffect(() => {
    // Recovery links land here with a hash like #access_token=...&type=recovery.
    // supabase-js auto-consumes the hash to establish a session, so checking
    // window.location.hash once is unreliable — by the time our effect runs
    // it may already be cleared, and the user would see the "request reset"
    // form again (looking like a loop). Some deployments/providers may also
    // return a PKCE code in the query string, so exchange that code explicitly.
    // Detect the PASSWORD_RECOVERY event from supabase too, plus fall back to
    // the URL params for safety.
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(window.location.search);
    const isRecoveryLink = hashParams.get("type") === "recovery" || searchParams.get("type") === "recovery";
    const recoveryCode = searchParams.get("code");
    const linkError = hashParams.get("error_description") || searchParams.get("error_description");

    if (isRecoveryLink) {
      setMode("update");
    }

    if (linkError) {
      toast({
        title: "Reset link problem",
        description: linkError.replace(/\+/g, " "),
        variant: "destructive"
      });
    }

    if (recoveryCode) {
      setMode("update");
      supabase.auth.exchangeCodeForSession(recoveryCode).then(({ error }) => {
        if (error) {
          toast({
            title: "Reset link problem",
            description: error.message,
            variant: "destructive"
          });
        }
      });
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setMode("update");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setMode("update");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  useEffect(() => {
    if (!authLoading && session) {
      setMode("update");
    }
  }, [authLoading, session]);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Check your email",
        description: "We sent you a password reset link."
      });
      setEmail("");
    }
    setLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (password.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        description: "Please make sure both passwords are the same.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } else {
      toast({
        title: "Password updated",
        description: "Your password has been reset. You can now sign in."
      });
      navigate("/auth");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4 gap-2">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-between mb-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            {mode === "request" ? "Reset Password" : "Set New Password"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {mode === "request" ? (
            <form onSubmit={handleRequestReset} className="space-y-4">
              <div>
                <Label htmlFor="reset-email">Email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Sending link..." : "Send reset link"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div>
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Choose a new password (min 6 characters)"
                  required
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground mt-1">Minimum 6 characters</p>
              </div>
              <div>
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                  required
                  minLength={6}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Updating..." : "Update password"}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResetPassword;
