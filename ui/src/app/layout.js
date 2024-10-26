"use client";

import { Inter } from "next/font/google";
import "../styles/globals.css";
import { ThemeProvider, createTheme, Container } from "@mui/material";
import { globalThemeOptions } from "../styles/globalThemeOptions.mjs";
import { useEffect, useState } from "react";
import App from "./page.js";
import { USER_ROLES } from "../utils/constants.mjs";

import Navbar from "../components/common/Navbar.mjs";
import Footer from "../components/common/Footer.mjs";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout() {
  const theme = createTheme(globalThemeOptions);

  const [pageView, setPageView] = useState("home");
  // const [user, setUser] = useState({
  //   firstName: "Bruce",
  //   lastName: "Wayne",
  //   email: "bruce.wayne@waynecorp.com",
  //   number: "01234567890",
  //   iceNumber: "01234567891",
  //   role: USER_ROLES.ADMIN,
  // });
  const [user, setUser] = useState({ role: USER_ROLES.GUEST });

  useEffect(() => {
    globalThis.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pageView]);

  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <Navbar user={user} setPageView={setPageView} />
          <Container maxWidth="xl">
            <App user={user} setUser={setUser} pageView={pageView} setPageView={setPageView} />
          </Container>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
