import React, { useEffect, useState } from 'react';
import { ThemeContext } from './ThemeContext.ts';

type ThemeProviderProps = {
  children: React.ReactNode;
}
export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(localStorage.getItem("dark-mode") === "true" || false);

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
