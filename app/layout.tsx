import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
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
        <div className="min-h-screen bg-zinc-50 text-zinc-900">
          <header className="border-b border-zinc-200 bg-white/90 backdrop-blur">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4">
              <Link href="/" className="text-lg font-semibold tracking-tight">
                Article Reader
              </Link>
              <nav className="flex items-center gap-4 text-sm text-zinc-600">
                <Link className="hover:text-zinc-900" href="/">
                  Home
                </Link>
                <Link className="hover:text-zinc-900" href="/#categories">
                  Categories
                </Link>
                <Link className="hover:text-zinc-900" href="/quizzes">
                  Quizzes
                </Link>
              </nav>
            </div>
          </header>
          {children}
          <footer className="border-t border-zinc-200 bg-white">
            <div className="mx-auto flex w-full max-w-4xl items-center justify-between px-6 py-4 text-xs text-zinc-500">
              <p>Built for fast reading and listen mode.</p>
              <p>POC</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
