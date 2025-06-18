"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { globalThemeOptions } from "@/src/styles/globalThemeOptions.mjs";
import { useEffect, useMemo, useState } from "react";

export default function ClientThemeProvider({ children }) {
  const getSystemTheme = () => (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  const [mode, setMode] = useState("light");

  useEffect(() => {
    setMode(getSystemTheme());

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e) => {
      setMode(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  globalThemeOptions.palette.mode = mode;

  const theme = useMemo(() => createTheme(globalThemeOptions), [mode]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
