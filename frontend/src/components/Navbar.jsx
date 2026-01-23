import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="font-bold text-2xl text-gray-900 hover:text-gray-700">
            GigFlow
          </Link>

          <div className="flex items-center gap-6">
            <Link 
              to="/gigs" 
              className="text-gray-700 hover:text-black font-medium transition-colors"
            >
              Gigs
            </Link>

            {user ? (
              <>
                <span className="text-gray-700 font-medium">
                  Hi, {user.firstName}
                </span>
                <Link 
                  to="/dashboard" 
                  className="text-gray-700 hover:text-black font-medium transition-colors"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-black font-medium transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="text-gray-700 hover:text-black font-medium transition-colors"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
