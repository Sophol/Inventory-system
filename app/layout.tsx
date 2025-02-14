import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SessionProvider } from "next-auth/react";
import { moulRegular } from "./fonts/fonts";
import { auth } from "@/auth";
import { Toaster } from "@/components/ui/toaster";
import ThemeProvider from "@/context/Theme";
import { getLocale, getMessages } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

const inter = localFont({
  src: "./fonts/InterVF.ttf",
  variable: "--font-inter",
  weight: "100 200 300 400 500 600 700 800 900",
});

const spaceGrotesk = localFont({
  src: "./fonts/SpaceGroteskVF.ttf",
  variable: "--font-space-grotesk",
  weight: "300 400 500 600 700",
});

// Add Koh Santepheap font import
const kohSantepheap = localFont({
  src: "./fonts/KohSantepheap-Regular.ttf",
  variable: "--font-koh-santepheap",
  weight: "400",
});

export const metadata: Metadata = {
  title: "ERP System",
  description:
    "ERP System is a modern inventory management system that helps you manage your business with ease.",
  icons: {
    icon: "/images/logo.png",
  },
};

const RootLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();
  const messages = await getMessages();
  const locale = await getLocale();
  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={moulRegular.variable}
    >
      <head>
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <SessionProvider session={session}>
        <body
          className={`${inter.variable} ${spaceGrotesk.variable} ${kohSantepheap.variable} antialiased`}
        >
          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange
            >
              {children}
            </ThemeProvider>
            <Toaster />
          </NextIntlClientProvider>
        </body>
      </SessionProvider>
    </html>
  );
};
export default RootLayout;
