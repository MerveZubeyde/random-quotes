import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";

import { ThemeProvider } from "@/app/ThemeContext";
import { QuotesContextProvider } from "@/app/QuotesContext";
import { TopNav } from "@/app/Navbar";
import { getApprovedQuotes } from "@/lib/quote-repository";

import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Random Quotes Application",
  description: "Random Quotes Application 200825",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialQuotes = await getApprovedQuotes();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable} h-full antialiased`}
    >
      <body className="flex min-h-svh flex-col bg-background text-foreground">
        <ThemeProvider>
          <QuotesContextProvider initialQuotes={initialQuotes}>
            <TopNav />
            {children}
          </QuotesContextProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
