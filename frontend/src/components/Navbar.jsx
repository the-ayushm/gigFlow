import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="flex justify-between p-4 border-b">
      <h1 className="font-bold">GigFlow</h1>

      <div className="flex gap-4">
        <a href="/gigs">Gigs</a>

        {user ? (
          <>
            <a href="/dashboard">Dashboard</a>
            <button onClick={logout} className="text-red-600">
              Logout
            </button>
          </>
        ) : (
          <>
            <a href="/login">Login</a>
            <a href="/register">Register</a>
          </>
        )}
      </div>
    </nav>
  );
}
