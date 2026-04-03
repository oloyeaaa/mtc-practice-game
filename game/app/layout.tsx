import type { Metadata } from "next";
import { Nunito, Fredoka } from "next/font/google";
import "./globals.css";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const fredoka = Fredoka({
  variable: "--font-fredoka",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "Times Table Legends",
  description: "Train. Battle. Collect. Master your times tables!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${nunito.variable} ${fredoka.variable} h-full`}>
      <body className="min-h-full bg-[#1a1a2e] text-white font-[var(--font-nunito)] select-none overflow-hidden">
        {children}
      </body>
    </html>
  );
}
