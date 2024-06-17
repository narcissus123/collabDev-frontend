import { createContext, useState, useContext, ReactNode } from "react";

import { getItem } from "../../core/services/storage/Storage";

interface AuthContextProps {
  isUser: boolean;
  loginAsUser: (isuser: boolean) => void;
  logout: () => void;
  isAdmin: boolean;
  loginAsAdmin: (isadmin: boolean) => void;
  logoutAdmin: () => void;
}

const AuthContext = createContext<AuthContextProps>({
  isUser: false,
  loginAsUser: () => {},
  logout: () => {},
  isAdmin: false,
  loginAsAdmin: () => {},
  logoutAdmin: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isUser, setIsUser] = useState(Boolean(getItem("user")) === true);
  const [isAdmin, setIsAdmin] = useState(Boolean(getItem("admin")) === true);

  const loginAsUser = (isuser: boolean) => {
    setIsUser(isuser);
  };
  const loginAsAdmin = (isadmin: boolean) => {
    setIsAdmin(isadmin);
  };

  const logout = () => {
    setIsUser(false);
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isUser,
        loginAsUser,
        logout,
        isAdmin,
        loginAsAdmin,
        logoutAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
