import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="p-6 text-center">
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // User is logged in, show the protected content
  return children;
}
