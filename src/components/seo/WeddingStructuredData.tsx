import Script from "next/script";

interface WeddingStructuredDataProps {
  weddingDate: Date;
}

const WeddingStructuredData: React.FC<WeddingStructuredDataProps> = ({
  weddingDate,
}) => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Сватба на Ана-Мария и Георги",
    description:
      "Празнуване на сватбата на Ана-Мария и Георги - специален ден, изпълнен с любов, радост и незабравими моменти заедно с най-близките хора.",
    startDate: weddingDate.toISOString(),
    endDate: new Date(weddingDate.getTime() + 8 * 60 * 60 * 1000).toISOString(), // 8 hours later
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: [
      {
        "@type": "Place",
        name: "Къща на Културата",
        address: {
          "@type": "PostalAddress",
          streetAddress: 'ул. "Култура" 1',
          addressLocality: "София",
          postalCode: "1000",
          addressCountry: "BG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 42.6977,
          longitude: 23.3219,
        },
      },
      {
        "@type": "Place",
        name: 'Хотел "България"',
        address: {
          "@type": "PostalAddress",
          streetAddress: 'бул. "Русия" 4',
          addressLocality: "София",
          postalCode: "1000",
          addressCountry: "BG",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: 42.6966,
          longitude: 23.3245,
        },
      },
    ],
    organizer: {
      "@type": "Person",
      name: "Ана-Мария и Георги",
      description: "Младоженци",
    },
    performer: {
      "@type": "Person",
      name: "Ана-Мария и Георги",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "BGN",
      availability: "https://schema.org/InviteOnly",
      validFrom: new Date().toISOString(),
      validThrough: new Date(
        weddingDate.getTime() - 24 * 60 * 60 * 1000
      ).toISOString(), // Day before wedding
    },
    image: [
      {
        "@type": "ImageObject",
        url: "/wedding-social-thumbnail.jpg",
        width: 1200,
        height: 630,
        caption: "Сватба на Ана-Мария и Георги",
      },
    ],
    subEvent: [
      {
        "@type": "Event",
        name: "Венчавка",
        description: "Официална церемония по венчаване",
        startDate: weddingDate.toISOString(),
        endDate: new Date(
          weddingDate.getTime() + 2 * 60 * 60 * 1000
        ).toISOString(), // 2 hours
        location: {
          "@type": "Place",
          name: "Къща на Културата",
          address: {
            "@type": "PostalAddress",
            streetAddress: 'ул. "Култура" 1',
            addressLocality: "София",
            postalCode: "1000",
            addressCountry: "BG",
          },
        },
      },
      {
        "@type": "Event",
        name: "Тържество",
        description: "Сватбено тържество с вечеря и танци",
        startDate: new Date(
          weddingDate.getTime() + 4 * 60 * 60 * 1000
        ).toISOString(), // 4 hours after ceremony
        endDate: new Date(
          weddingDate.getTime() + 8 * 60 * 60 * 1000
        ).toISOString(), // 8 hours total
        location: {
          "@type": "Place",
          name: 'Хотел "България"',
          address: {
            "@type": "PostalAddress",
            streetAddress: 'бул. "Русия" 4',
            addressLocality: "София",
            postalCode: "1000",
            addressCountry: "BG",
          },
        },
      },
    ],
    inLanguage: "bg",
    isAccessibleForFree: true,
    keywords: [
      "сватба",
      "венчавка",
      "тържество",
      "София",
      "България",
      "Ана-Мария",
      "Георги",
      "wedding",
      "ceremony",
      "reception",
    ],
    audience: {
      "@type": "Audience",
      audienceType: "Семейство и приятели",
    },
  };

  return (
    <Script
      id="wedding-structured-data"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData, null, 2),
      }}
    />
  );
};

export default WeddingStructuredData;
