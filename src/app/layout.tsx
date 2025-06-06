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
    "венчавка",
    "тържество",
    "България",
    "wedding",
    "ceremony",
    "reception",
  ],
  authors: [{ name: "Ана-Мария & Иван" }],
  creator: "Ана-Мария & Иван",
  publisher: "Ана-Мария & Иван",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    title: "Ана-Мария & Иван - Сватба 15 септември 2025",
    description:
      "Присъединете се към нас за нашия специален ден! Венчавка в Къща на Културата и тържество в Хотел България, София.",
    type: "website",
    locale: "bg_BG",
    url: "https://wedding-ana-maria-ivan.vercel.app",
    siteName: "Сватба на Ана-Мария и Иван",
    images: [
      {
        url: "/hero-bg.jpg",
        width: 1920,
        height: 1080,
        alt: "Сватба на Ана-Мария и Иван - 15 септември 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ана-Мария & Иван - Сватба 15 септември 2025",
    description: "Присъединете се към нас за нашия специален ден!",
    images: ["/hero-bg.jpg"],
  },
  alternates: {
    canonical: "https://wedding-ana-maria-ivan.vercel.app",
  },
  category: "event",
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
