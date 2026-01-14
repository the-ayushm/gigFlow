import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");


const submit = async (e) => {
  e.preventDefault();
  setError("");

  const result = await login(form);

  if (!result.success) {
    setError(result.message);
  }
};


  return (
  <div className="page">
    <form onSubmit={submit} className="card">
      <h2 className="title">Login to GigFlow</h2>
      {error && (
  <p className="text-red-600 text-sm mb-3 text-center">
    {error}
  </p>
)}
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
