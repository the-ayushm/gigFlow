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
    <nav className="flex justify-between items-center p-4 border-b bg-white">
      <Link to="/" className="font-bold text-xl">
        GigFlow
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/gigs" className="text-gray-700 hover:text-black">
          Gigs
        </Link>

        {user ? (
          <>
            <span className="text-gray-700">
              Hi, {user.firstName}
            </span>
            <Link to="/dashboard" className="text-gray-700 hover:text-black">
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 border rounded text-red-600 hover:bg-red-50"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-black">
              Login
            </Link>
            <Link to="/register" className="text-gray-700 hover:text-black">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
