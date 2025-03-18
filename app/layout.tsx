import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Security from "./_components/Securtiy";
import { ClerkProvider} from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ThemeProvider } from "next-themes";
const inter = Inter({ subsets: ["latin"] });
export const metadata: Metadata = {
  title: "जाट विवाह",
  description: "जाट विवाह"
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider publishableKey="pk_test_c291bmQtcGlnZW9uLTI5LmNsZXJrLmFjY291bnRzLmRldiQ">
    <html lang="en" suppressHydrationWarning suppressContentEditableWarning>
    <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
      <Toaster position="bottom-center" duration={3000}/>
      <body className={inter.className}>
          <Security />
          {children}
      </body>  
      </ThemeProvider>
    </html>
    </ClerkProvider>
  );
}
