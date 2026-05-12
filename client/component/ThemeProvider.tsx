import { vars } from "nativewind";
import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  themeVars: any;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(() => {
    const colorScheme = Appearance.getColorScheme();
    return colorScheme === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setTheme(colorScheme === "dark" ? "dark" : "light");
    });

    return () => subscription?.remove();
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  const themeVars = vars({
    "--color-background": theme === "light" ? "255 255 255" : "0 0 0",
    "--color-text": theme === "light" ? "0 0 0" : "255 255 255",
  });

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, themeVars }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
