"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorTheme, getColorConfig, getThemeByName, getAllThemes, applyTheme } from '@/lib/colors';

interface ThemeContextType {
  currentTheme: ColorTheme | null;
  themeName: string;
  setTheme: (themeName: string) => void;
  availableThemes: Record<string, ColorTheme>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeName, setThemeName] = useState<string>('');
  const [currentTheme, setCurrentTheme] = useState<ColorTheme | null>(null);

  const availableThemes = getAllThemes();

  const setTheme = (newThemeName: string) => {
    const theme = getThemeByName(newThemeName);
    if (theme) {
      setThemeName(newThemeName);
      setCurrentTheme(theme);
      
      // 应用CSS变量
      applyTheme(theme);
    }
  };

  // 初始化时直接读取JSON配置并应用
  useEffect(() => {
    const initTheme = () => {
      const config = getColorConfig();
      const targetThemeName = config.currentTheme;
      const targetTheme = config.themes[targetThemeName];
      
      if (targetTheme) {
        setThemeName(targetThemeName);
        setCurrentTheme(targetTheme);
        
        // 应用CSS变量
        applyTheme(targetTheme);
      }
    };
    
    initTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      themeName,
      setTheme,
      availableThemes,
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}