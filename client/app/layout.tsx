// client/app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import Header from "@/components/layout/Header"; // Import Header
import Footer from "@/components/layout/Footer"; // Import Footer

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Tutor Platform",
  description: "Connecting students and tutors",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen overflow-hidden flex flex-col`}>
        <AuthProvider>
          <SocketProvider>
            <Header />
            <main className="flex-grow overflow-y-auto">
              {children}
            </main>
            <Footer />
          </SocketProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
