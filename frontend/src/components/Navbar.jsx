import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-4 border-b">
      <Link to="/" className="text-xl font-bold">
        GigFlow
      </Link>

      <div className="flex items-center gap-4">
        <Link to="/gigs" className="hover:underline">
          Gigs
        </Link>

        {user ? (
          <>
            <Link to="/dashboard" className="hover:underline">
              Dashboard
            </Link>

            <button
              onClick={logout}
              className="btn"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>

            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
