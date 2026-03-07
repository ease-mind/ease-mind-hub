import React, { createContext, useState, useContext, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { colorsPalette } from '../styles/palette';
import { darkTheme, lightTheme } from '../styles/default.theme';

const ThemeContext = createContext({
  theme: lightTheme,
  colors: colorsPalette.light,
  toggleTheme: () => {},
  isDarkMode: false,
});

export const EasemindThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [theme, setTheme] = useState(lightTheme);
  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  useEffect(() => {
    setTheme(isDarkMode ? darkTheme : lightTheme)
  }, [isDarkMode]);
  
  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDarkMode, colors: colorsPalette[!isDarkMode ? 'light': 'dark'] }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
