import { createContext } from 'react';

type ThemeContextProps = {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const ThemeContext = createContext<ThemeContextProps | null>(null);
