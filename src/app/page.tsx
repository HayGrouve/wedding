import Hero from "@/components/Hero";
import WeddingDetails from "@/components/sections/WeddingDetails";
import { RSVPForm } from "@/components/forms/RSVPForm";
import MainLayout from "@/components/layout/MainLayout";
import WeddingStructuredData from "@/components/seo/WeddingStructuredData";

export default function Home() {
  // Wedding date: September 15, 2025 at 14:00 (2:00 PM)
  const weddingDate = new Date("2025-09-15T14:00:00");

  return (
    <>
      <WeddingStructuredData weddingDate={weddingDate} />
      <MainLayout>
        {/* Hero Section */}
        <section
          id="home"
          className="scroll-offset"
          aria-label="Заглавна секция"
        >
          <Hero
            brideName="Ана-Мария"
            groomName="Иван"
            weddingDate="15 септември 2025 г."
          />
        </section>

        {/* Wedding Details Section */}
        <WeddingDetails />

        {/* Gallery Section Placeholder */}
        <section
          id="gallery"
          className="section-padding bg-background/80 backdrop-blur-sm scroll-offset"
          aria-label="Галерия"
        >
          <div className="container-wedding">
            <h2 className="text-3xl font-bold text-center mb-12">Галерия</h2>
            <p className="text-center text-muted-foreground">
              Галерията ще бъде добавена скоро...
            </p>
          </div>
        </section>

        {/* RSVP Section */}
        <section
          id="rsvp"
          className="section-padding bg-card scroll-offset"
          aria-label="RSVP форма"
        >
          <div className="container-wedding">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 wedding-text-gradient">
                RSVP
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Моля, потвърдете присъствието си до 1 септември 2025 г.
              </p>
            </div>
            <div className="max-w-md mx-auto">
              <RSVPForm />
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
