import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export const ProtectedRoute = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to AdminLoginPage if accessing admin routes
    if (location.pathname.startsWith("/admin")) {
      return <Navigate to="/admin/login" replace />;
    }
    // Redirect to regular LoginPage for other routes
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};