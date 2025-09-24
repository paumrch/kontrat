import type { Metadata, Viewport } from "next";
import { fonts } from "@/lib/fonts";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/Header";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Kontrat",
  description: "A production-grade application built with Next.js 15, Turbopack, TypeScript, Tailwind CSS, shadcn/ui and Supabase",
  keywords: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "shadcn/ui"],
  authors: [{ name: "Kontrat Team" }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={fonts} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
