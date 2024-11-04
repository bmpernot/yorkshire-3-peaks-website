import { Inter } from "next/font/google";
import "../styles/globals.css";
import { Container } from "@mui/material";
import styles from "@/src/styles/page.module.css";

import Navbar from "@/src/components/common/Navbar.mjs";
import Footer from "@/src/components/common/Footer.mjs";
import ClientThemeProvider from "@/src/components/common/ClientThemeProvider.mjs";
import ConfigureAmplifyClientSide from "@/src/app/amplify-cognito-config";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClientThemeProvider>
          <Navbar />
          <ConfigureAmplifyClientSide />
          <Container maxWidth="xl">
            <main data-cy="body" className={styles.main}>
              {children}
            </main>
          </Container>
          <Footer />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
