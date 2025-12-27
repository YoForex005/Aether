


import React, { createContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type AuthContextType = {
  token: string | null;
  loading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType>({
  token: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const saved = await AsyncStorage.getItem("appToken");
        if (saved) {
          setToken(saved); 
        }
      } catch (err) {
        console.log("TOKEN LOAD ERROR:", err);
      } finally {
        setLoading(false); 
      }
    };
    loadToken();
  }, []);

  // Save token
  const login = async (newToken: string) => {
    try {
      await AsyncStorage.setItem("appToken", newToken);
      setToken(newToken);
    } catch (err) {
      console.log("TOKEN SAVE ERROR:", err);
    }
  };

  // Remove token
  const logout = async () => {
    try {
      await AsyncStorage.removeItem("appToken");
      setToken(null);
    } catch (err) {
      console.log("TOKEN REMOVE ERROR:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};



