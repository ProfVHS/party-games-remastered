import React, { useState } from 'react';
import { ThemeContext } from './ThemeContext.ts';

type ThemeProviderProps = {
  children: React.ReactNode;
}
export const ThemeProvider = ({children}: ThemeProviderProps) => {
  const [darkMode, setDarkMode] = useState<boolean>(false);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

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