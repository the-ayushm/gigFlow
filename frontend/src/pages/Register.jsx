import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const { register, user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const result = await register(form);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Account created successfully");
      navigate("/dashboard");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        <form onSubmit={submit}>
          <input
            className="input mb-3"
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            required
          />

          <input
            className="input mb-3"
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            required
          />

          <input
            className="input mb-3"
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            className="input mb-4"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="btn w-full"
          >
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}
