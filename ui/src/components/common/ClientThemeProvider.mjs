"use client";

import { ThemeProvider, createTheme } from "@mui/material";
import { globalThemeOptions } from "@/src/styles/globalThemeOptions.mjs";

const theme = createTheme(globalThemeOptions);

export default function ClientThemeProvider({ children }) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
