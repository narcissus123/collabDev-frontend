import { createContext, useState, useContext, ReactNode } from "react";
import {
  getItem,
  setItem,
  removeItem,
} from "../../core/services/storage/Storage";
import { User } from "../../configs/types/userTypes";

interface AuthContextProps {
  user: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (userData: User) => void;
  logout: () => void;
  isProfileOwner: (profileId: string) => boolean;
  isProjectOwner: (ownerId: string) => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isAuthenticated: false,
  setCurrentUser: () => {},
  logout: () => {},
  isProfileOwner: () => false,
  isProjectOwner: () => false,
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  // Initialize user state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = getItem("user");
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        return null;
      }
    }
    return null;
  });

  const setCurrentUser = (userData: User) => {
    setUser(userData);
    setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    removeItem("user");
    removeItem("token");
  };

  // Check if current user owns the profile
  const isProfileOwner = (profileId: string): boolean => {
    return user?._id === profileId;
  };

  // Check if current user is project owner
  const isProjectOwner = (ownerId: string): boolean => {
    return user?._id === ownerId;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    setCurrentUser,
    logout,
    isProfileOwner,
    isProjectOwner,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
