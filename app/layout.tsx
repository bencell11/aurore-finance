import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainNavigation from "@/components/navigation/MainNavigation";
import ChatBubble from "@/components/ai-coach/ChatBubble";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aurore Finance - Conseiller financier IA pour la Suisse",
  description: "Optimisez vos finances avec notre conseiller IA spécialisé dans le système financier suisse. Simulateurs, conseils personnalisés et suivi d'objectifs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MainNavigation />
        {children}
        <ChatBubble />
      </body>
    </html>
  );
}
