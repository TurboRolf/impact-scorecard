import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/hooks/useAuth";

type Status = "loading" | "success" | "error";

const AuthCallback = () => {
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const navigate = useNavigate();
  const { session } = useAuth();
  useDocumentTitle("Email Verified");

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const searchParams = new URLSearchParams(window.location.search);

    const linkError =
      hashParams.get("error_description") || searchParams.get("error_description");
    if (linkError) {
      setErrorMsg(linkError.replace(/\+/g, " "));
      setStatus("error");
      return;
    }

    const code = searchParams.get("code");
    if (code) {
      supabase.auth.exchangeCodeForSession(code).then(({ error }) => {
        if (error) {
          setErrorMsg(error.message);
          setStatus("error");
        } else {
          setStatus("success");
        }
      });
      return;
    }

    // Implicit flow: token is in hash and supabase-js auto-consumes it.
    if (hashParams.get("access_token") || hashParams.get("type")) {
      setStatus("success");
      return;
    }

    // No tokens — if a session exists we still treat as success.
    supabase.auth.getSession().then(({ data: { session } }) => {
      setStatus(session ? "success" : "success");
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-3">
          <div className="flex justify-center">
            {status === "loading" && (
              <Loader2 className="h-12 w-12 text-muted-foreground animate-spin" />
            )}
            {status === "success" && (
              <CheckCircle2 className="h-12 w-12 text-primary" />
            )}
            {status === "error" && (
              <XCircle className="h-12 w-12 text-destructive" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-brand bg-clip-text text-transparent">
            {status === "loading" && "Verifying your email..."}
            {status === "success" && "Email verified!"}
            {status === "error" && "Verification failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          {status === "success" && (
            <>
              <p className="text-muted-foreground">
                Welcome to Ethisay! Your account is ready to go.
              </p>
              {session ? (
                <Button className="w-full" onClick={() => navigate("/")}>
                  Go to feed
                </Button>
              ) : (
                <Button className="w-full" onClick={() => navigate("/auth")}>
                  Sign in
                </Button>
              )}
            </>
          )}
          {status === "error" && (
            <>
              <p className="text-sm text-muted-foreground">
                {errorMsg || "The verification link is invalid or has expired."}
              </p>
              <Button asChild className="w-full">
                <Link to="/auth">Back to sign in</Link>
              </Button>
            </>
          )}
          {status === "loading" && (
            <p className="text-sm text-muted-foreground">Hang tight…</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;