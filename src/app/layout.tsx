import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ана-Мария & Иван - Сватба 15 септември 2025",
  description:
    "Присъединете се към нас за сватбата на Ана-Мария и Иван на 15 септември 2025 г. в София. RSVP и детайли за церемонията и празненството.",
  keywords: [
    "сватба",
    "Ана-Мария",
    "Иван",
    "София",
    "15 септември 2025",
    "RSVP",
  ],
  authors: [{ name: "Ана-Мария & Иван" }],
  openGraph: {
    title: "Ана-Мария & Иван - Сватба 15 септември 2025",
    description: "Присъединете се към нас за нашия специален ден!",
    type: "website",
    locale: "bg_BG",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" dir="ltr">
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
