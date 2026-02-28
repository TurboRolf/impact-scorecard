import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen message="Checking authentication..." />;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
