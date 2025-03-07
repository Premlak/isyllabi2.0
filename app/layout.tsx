import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Security from "./_components/Securtiy";
import { ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "iSyllabi",
  description: "Buy Now",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <Toaster />
      <body className={inter.className}>
          <Security />
          {children}
      </body>  
      </ThemeProvider>
    </html>
    </ClerkProvider>
  );
}
