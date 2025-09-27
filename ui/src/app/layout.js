import "../styles/globals.css";
import ConfigureAmplifyClientSide from "@/src/app/amplify-config";
import { Inter } from "next/font/google";
import styles from "@/src/styles/page.module.css";

import Navbar from "@/src/components/common/Navbar.mjs";
import Footer from "@/src/components/common/Footer.mjs";
import ClientThemeProvider from "@/src/components/common/ClientThemeProvider.mjs";
import { UserProvider } from "@/src/utils/userContext";

import { ToastContainer } from "react-toastify";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigureAmplifyClientSide />
        <ClientThemeProvider>
          <ToastContainer position="bottom-right" />
          <UserProvider>
            <Navbar />
            <main data-cy="body" className={styles.main}>
              {children}
            </main>
            <Footer />
          </UserProvider>
        </ClientThemeProvider>
      </body>
    </html>
  );
}
