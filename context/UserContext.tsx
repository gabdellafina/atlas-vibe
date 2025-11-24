// context/UserContext.tsx
import { onAuthStateChanged } from "firebase/auth";
import React, { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { getUserProfile, loginUser, logoutUser, registerUser, UserProfile } from "../services/firebase/userService";
import { auth } from "../services/firebaseConfig";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface UserContextData {
  user: User | null;
  setUser: (user: User | null) => void;
  updateUser: (updates: Partial<User>) => void;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  loading: boolean;
}

const UserContext = createContext<UserContextData | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // loading começa como true

  // Listener do Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const profile: UserProfile | null = await getUserProfile(firebaseUser.uid);
          if (profile) {
            setUser({
              id: profile.id,
              name: profile.name,
              email: profile.email,
              role: profile.role,
              avatar: profile.avatar,
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          console.error("Erro ao carregar perfil:", err);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUser = (updates: Partial<User>) => {
    if (user) setUser({ ...user, ...updates });
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const profile: UserProfile | null = await loginUser(email, password);
      if (!profile) throw new Error("Perfil não encontrado");

      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar,
      });
    } catch (error) {
      console.error("Erro no login:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    setLoading(true);
    try {
      const profile: UserProfile = await registerUser(userData.name, userData.email, userData.password);
      setUser({
        id: profile.id,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        avatar: profile.avatar,
      });
    } catch (error) {
      console.error("Erro no registro:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!user;

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateUser,
        logout,
        isAuthenticated,
        login,
        register,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextData => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within a UserProvider");
  return context;
};