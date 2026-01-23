import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(true);

  const setUserAndPersist = (nextUser) => {
    if (nextUser) {
      localStorage.setItem("user", JSON.stringify(nextUser));
      setUser(nextUser);
    } else {
      localStorage.removeItem("user");
      setUser(null);
    }
  };

  const refreshUser = async () => {
    try {
      const res = await api.get("/auth/me");
      setUserAndPersist(res.data.user);
      return { success: true, user: res.data.user };
    } catch (err) {
      if (err.response?.status === 401) {
        setUserAndPersist(null);
      }
      return { success: false };
    }
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      setLoading(true);
      try {
        const res = await api.get("/auth/me");
        if (!cancelled) setUserAndPersist(res.data.user);
      } catch (err) {
        if (!cancelled && err.response?.status === 401) {
          setUserAndPersist(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (data) => {
    try {
      const res = await api.post("/auth/login", data);

      setUserAndPersist(res.data.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Invalid credentials",
      };
    }
  };

  const register = async (data) => {
    try {
      const res = await api.post("/auth/register", data);

      setUserAndPersist(res.data.user);

      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: err.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      setUserAndPersist(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshUser }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
