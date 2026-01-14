import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

const submit = async (e) => {
  e.preventDefault();
  setError("");

  const result = await register(form);

  if (!result.success) {
    setError(result.message);
  } else {
    navigate("/dashboard");
  }
};


 return (
  <div className="page">
    <form onSubmit={submit} className="card">
      <h2 className="title">Create Account</h2>

      <input className="input mb-2" placeholder="First Name"
        onChange={(e) => setForm({ ...form, firstName: e.target.value })} />

      <input className="input mb-2" placeholder="Last Name"
        onChange={(e) => setForm({ ...form, lastName: e.target.value })} />

      <input className="input mb-2" placeholder="Email"
        onChange={(e) => setForm({ ...form, email: e.target.value })} />

      <input className="input mb-4" type="password" placeholder="Password"
        onChange={(e) => setForm({ ...form, password: e.target.value })} />

      <button className="btn w-full">Register</button>
    </form>
  </div>
);

}
