import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
  metadataBase: new URL("https://wedding-ana-maria-georgi.vercel.app"),
  title: "Ана-Мария & Георги - Сватба 15 септември 2025",
  description:
    "Присъединете се към нас за сватбата на Ана-Мария и Георги на 15 септември 2025 г. в София. RSVP и детайли за церемонията и празненството.",
  keywords: [
    "сватба",
    "Ана-Мария",
    "Георги",
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
  authors: [{ name: "Ана-Мария & Георги" }],
  creator: "Ана-Мария & Георги",
  publisher: "Ана-Мария & Георги",
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
    title: "Ана-Мария & Георги - Сватба 15 септември 2025",
    description:
      "Присъединете се към нас за нашия специален ден! Венчавка в Къща на Културата и тържество в Хотел България, София.",
    type: "website",
    locale: "bg_BG",
    url: "https://wedding-ana-maria-georgi.vercel.app",
    siteName: "Сватба на Ана-Мария и Георги",
    images: [
      {
        url: "/wedding-social-thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Сватба на Ана-Мария и Георги - 15 септември 2025",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ана-Мария & Георги - Сватба 15 септември 2025",
    description: "Присъединете се към нас за нашия специален ден!",
    images: ["/wedding-social-thumbnail.jpg"],
  },
  alternates: {
    canonical: "https://wedding-ana-maria-georgi.vercel.app",
  },
  category: "event",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bg" dir="ltr" suppressHydrationWarning>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
