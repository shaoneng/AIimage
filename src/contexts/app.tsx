"use client";

import { ContextProviderProps, ContextProviderValue } from "../types/index";
import { User } from "../backend/type/type";
import { createContext, useContext, useState } from "react";

export const AppContext = createContext({} as ContextProviderValue);
export const useAppContext = () => useContext(AppContext);

export const AppContextProvider = ({ children }: ContextProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [navDashboardTitle, setNavDashboardTitle] = useState<string>("");

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        navDashboardTitle,
        setNavDashboardTitle,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
