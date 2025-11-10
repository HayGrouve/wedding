import Hero from "@/components/Hero";
import WeddingDetails from "@/components/sections/WeddingDetails";
import WeddingInvitation from "@/components/sections/WeddingInvitation";
import ScheduleTimeline from "@/components/sections/ScheduleTimeline";
import { RSVPForm } from "@/components/forms/RSVPForm";
import MainLayout from "@/components/layout/MainLayout";
import WeddingStructuredData from "@/components/seo/WeddingStructuredData";

export default function Home() {
  // Wedding date: December 13, 2025
  const weddingDate = new Date("2025-12-13T14:00:00");

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
          <Hero weddingDate="13.12.2025" />
        </section>

        {/* Wedding Invitation Section */}
        <WeddingInvitation />

        {/* Schedule Timeline */}
        <ScheduleTimeline />

        {/* Wedding Details Section */}
        <WeddingDetails />

        {/* RSVP Section */}
        <section
          id="rsvp"
          className="section-padding bg-card scroll-offset"
          aria-label="RSVP форма"
        >
          <div className="container-wedding">
            <div className="text-center mb-12">
              <h2 className="font-great-vibes text-3xl md:text-5xl font-bold mb-4">
                Потвърди присъствие
              </h2>
              {/* add a message that users have to cinfirm their presence */}
              <p>
                Моля, потвърдете присъствието си до <b>15.11.2025г!</b>
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <RSVPForm />
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
}
