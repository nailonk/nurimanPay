import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = () => {
      const savedAdmin = localStorage.getItem("admin_user");
      const token = localStorage.getItem("token");

      if (savedAdmin && token) {
        try {
          const parsedAdmin = JSON.parse(savedAdmin);
          // Ensure data integrity before setting state
          if (parsedAdmin && parsedAdmin.role === 'admin') {
            setAdmin(parsedAdmin);
          } else {
            localStorage.clear();
          }
        } catch (e) {
          localStorage.clear();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = (adminData, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("admin_user", JSON.stringify(adminData));
    setAdmin(adminData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin_user");
    setAdmin(null);
    localStorage.clear();
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};