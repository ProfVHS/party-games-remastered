import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext.ts';
import { themeType } from '../../types/ThemeType.ts';

type ThemeProviderProps = {
  children: React.ReactNode;
  theme?: themeType;
}
export const ThemeProvider = ({children, theme}: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(theme === "dark" || localStorage.getItem("dark-mode") === "true" || false);

  const toggleDarkMode = () => {
    localStorage.setItem("dark-mode", String(!darkMode))
    setDarkMode(prev => !prev)
  };

  useEffect(() => {
    document.documentElement.setAttribute(
      'data-theme',
      darkMode ? 'dark' : 'light'
    );
  }, [darkMode]);

  const value = {
    darkMode,
    toggleDarkMode,
  }
  return(
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}
