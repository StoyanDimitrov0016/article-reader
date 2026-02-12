import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Article Reader",
  description: "A lightweight article site optimized for listening on the go.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="min-h-screen bg-background text-foreground">
          <header className="bg-card/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Article Reader
              </Link>
              <nav className="flex items-center gap-2 text-sm">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">Home</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/#categories">Categories</Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/quizzes">Quizzes</Link>
                </Button>
              </nav>
            </div>
            <Separator />
          </header>
          {children}
          <footer className="bg-card">
            <Separator />
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4 text-xs text-muted-foreground">
              <p>Built for fast reading and listen mode.</p>
              <p>POC</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
