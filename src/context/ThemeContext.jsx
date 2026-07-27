import React, { createContext, useContext, useEffect, useState } from "react";

const THEME_KEY = "trackwell_theme_v1";
const LEGACY_THEME_KEY = "pathway_theme_v1"; // old key from before rename
const ThemeContext = createContext(null);

function loadInitialTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY) || localStorage.getItem(LEGACY_THEME_KEY);
    if (saved === "light" || saved === "dark") {
      return saved;
    }
  } catch (err) {
    console.error("Failed to read saved theme:", err);
  }

  // agar kuch save nahi mila, to system ka preference dekh lo
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }

  return "dark"; // default dark theme
}

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(loadInitialTheme);

  useEffect(() => {
    // console.log("theme is now:", theme);
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.error("Failed to persist theme:", err);
    }
  }, [theme]);

  function toggleTheme() {
    // console.log("toggling theme, current is", theme)
    if (theme == "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  }

  return (
    <ThemeContext.Provider value={{ theme: theme, toggleTheme: toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used inside a ThemeProvider");
  }
  return ctx;
}
