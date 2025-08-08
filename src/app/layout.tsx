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
  metadataBase: new URL("https://wedding-delta-drab.vercel.app"),
  title: "Сватба на Анна-Мария и Георги",
      description:
      "Присъединете се към нас за сватбата на Анна-Мария и Георги. RSVP и детайли за церемонията и празненството.",
  keywords: [
    "сватба",
    "Анна-Мария",
    "Георги",
    "София",
          "13 декември 2025",
    "RSVP",
    "венчавка",
    "тържество",
    "България",
    "wedding",
    "ceremony",
    "reception",
  ],
  authors: [{ name: "Анна-Мария & Георги" }],
  creator: "Анна-Мария & Георги",
  publisher: "Анна-Мария & Георги",
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
    title: "Сватба на Анна-Мария и Георги",
    description:
      "Присъединете се към нас за сватбата на Анна-Мария и Георги",
    type: "website",
    locale: "bg_BG",
    url: "https://wedding-delta-drab.vercel.app",
    siteName: "Сватба на Анна-Мария и Георги",
    images: [
      {
        url: "https://wedding-delta-drab.vercel.app/images/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Сватба на Анна-Мария и Георги - 13 декември 2025",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Сватба на Анна-Мария и Георги",
    description: "Присъединете се към нас за сватбата на Анна-Мария и Георги",
    images: ["https://wedding-delta-drab.vercel.app/images/thumbnail.jpg"],
    creator: "@wedding",
    site: "@wedding",
  },
  alternates: {
    canonical: "https://wedding-delta-drab.vercel.app",
  },
  other: {
    "theme-color": "#6c757d",
    "msapplication-TileColor": "#6c757d",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "default",
    "apple-mobile-web-app-title": "Сватба Анна-Мария & Георги",
    "application-name": "Сватба Анна-Мария & Георги",
    "msapplication-config": "/browserconfig.xml",
    "format-detection": "telephone=no",
    // Additional social media meta tags
    "og:image:width": "1200",
    "og:image:height": "630",
    "og:image:type": "image/jpeg",
    "og:image:alt": "Сватба на Анна-Мария и Георги - 13 декември 2025",
    // WhatsApp specific
    "og:image:secure_url": "https://wedding-delta-drab.vercel.app/images/thumbnail.jpg",
    // LinkedIn specific
    "og:image:url": "https://wedding-delta-drab.vercel.app/images/thumbnail.jpg",
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
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/images/thumbnail.jpg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/images/thumbnail.jpg" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/images/thumbnail.jpg" />
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/images/thumbnail.jpg" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Сватба Анна-Мария & Георги" />
        <meta name="msapplication-TileColor" content="#6c757d" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        {/* Additional social media meta tags for better compatibility */}
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:alt" content="Сватба на Анна-Мария и Георги - 13 декември 2025" />
        <meta property="og:image:secure_url" content="https://wedding-delta-drab.vercel.app/images/thumbnail.jpg" />
        <meta property="og:image:url" content="https://wedding-delta-drab.vercel.app/images/thumbnail.jpg" />
        {/* WhatsApp specific */}
        <meta property="og:image" content="https://wedding-delta-drab.vercel.app/images/thumbnail.jpg" />
        {/* Pinterest specific */}
        <meta name="pinterest-rich-pin" content="true" />
        {/* Additional Twitter Card meta tags */}
        <meta name="twitter:image:alt" content="Сватба на Анна-Мария и Георги - 13 декември 2025" />
        <meta name="twitter:image:width" content="1200" />
        <meta name="twitter:image:height" content="630" />
      </head>
      <body
        className={`${playfairDisplay.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
