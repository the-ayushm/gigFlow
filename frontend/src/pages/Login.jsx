import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    const result = await login(form);

    if (!result.success) {
      toast.error(result.message);
    } else {
      toast.success("Logged in successfully");
      navigate("/dashboard");
    }
  };

  return (
    <div className="page">
      <form onSubmit={submit} className="card">
        <h2 className="title">Login to GigFlow</h2>

        <input
          className="input mb-3"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
        <input
          className="input mb-4"
          type="password"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <button className="btn w-full">Login</button>
      </form>
    </div>
  );
}
