import { axiosInst } from "@/api/axios";
import React, { createContext, useContext, useState } from "react";

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("jwtToken"),
  );

  const login = (token: string) => {
    localStorage.setItem("jwtToken", token);
    axiosInst.defaults.headers.Authorization = `Bearer ${token}`;
    setToken(token);
  };

  const logout = () => {
    localStorage.removeItem("jwtToken");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
