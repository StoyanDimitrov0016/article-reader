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
  title: "Lesson Reader",
  description: "A lightweight lesson app optimized for listening on the go.",
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
            <div className="flex w-full flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Lesson Reader
              </Link>
              <nav className="flex flex-wrap items-center gap-1.5 text-sm">
                <Button asChild variant="ghost" size="sm">
                  <Link href="/">Lessons</Link>
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
            <div className="flex w-full flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
              <p>Built for uninterrupted lesson listening.</p>
              <p>POC</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
