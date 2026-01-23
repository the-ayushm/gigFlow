import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login, user } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await login(form);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Login to GigFlow</h2>

        <form onSubmit={submit}>
          <input
            className="input mb-3"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            required
          />
          <input
            className="input mb-4"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="btn w-full"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
