"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, MapPin, Users, Music } from "lucide-react";
import CountdownTimer from "@/components/ui/CountdownTimer";
import VenueCard from "@/components/ui/VenueCard";
import AnimatedCard from "@/components/ui/AnimatedCard";

const WeddingDetails = () => {
  // Wedding date: September 15, 2025 at 14:00 (2:00 PM)
  const weddingDate = new Date("2025-09-15T14:00:00");

  return (
    <section
      id="details"
      className="section-padding bg-background scroll-offset relative overflow-hidden"
      aria-label="Детайли за сватбата"
    >
      {/* Subtle background pattern */}
      <div
        className="absolute inset-0 opacity-[0.02] bg-[radial-gradient(circle_at_50%_50%,_theme(colors.wedding.rose)_1px,_transparent_1px)] bg-[length:24px_24px]"
        aria-hidden="true"
      />
      <div className="container-wedding">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-foreground mb-4"
            id="wedding-details-heading"
          >
            Детайли за Сватбата
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Всички важни детайли за нашия специален ден - от времето до мястото,
            където ще празнуваме нашата любов заедно с вас.
          </p>
        </div>

        {/* Wedding Details Grid */}
        <div
          className="grid gap-6 md:gap-8 lg:gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          role="region"
          aria-labelledby="wedding-details-heading"
        >
          {/* Left Column: Countdown Timer + Important Details */}
          <div className="space-y-6 md:space-y-8">
            {/* Countdown Timer Card */}
            <AnimatedCard delay={0} animationType="fadeInUp">
              <Card className="group transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">
                    Обратно Броене
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CountdownTimer targetDate={weddingDate} />
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Important Details Card */}
            <AnimatedCard delay={600} animationType="fadeInUp">
              <Card className="group transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">
                    Важни Детайли
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        RSVP до
                      </p>
                      <p className="font-medium">1 септември 2025 г.</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Контакт
                      </p>
                      <p className="text-sm">За въпроси се свържете с нас</p>
                    </div>
                    <div>
                      <p className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                        Подаръци
                      </p>
                      <p className="text-sm">
                        Вашето присъствие е най-ценният подарък
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>

          {/* Middle Column: Venue Information (Locations) */}
          <AnimatedCard delay={450} animationType="fadeInUp">
            <VenueCard />
          </AnimatedCard>

          {/* Right Column: Reception + Wedding Ceremony */}
          <div className="space-y-6 md:space-y-8">
            {/* Wedding Reception Card */}
            <AnimatedCard delay={300} animationType="fadeInUp">
              <Card className="group transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Music className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">
                    Тържество
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">18:00 часа</p>
                      <p className="text-sm text-muted-foreground">
                        Коктейл и вечеря
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        Хотел &ldquo;България&rdquo;
                      </p>
                      <p className="text-sm text-muted-foreground">
                        бул. &ldquo;Русия&rdquo; 4, София
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Users className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Кодът на дрехите</p>
                      <p className="text-sm text-muted-foreground">
                        Официално облекло
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>

            {/* Wedding Ceremony Card */}
            <AnimatedCard delay={150} animationType="fadeInUp">
              <Card className="group transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 w-fit">
                    <Calendar className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl font-serif">Венчавка</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">15 септември 2025 г.</p>
                      <p className="text-sm text-muted-foreground">Неделя</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">14:00 часа</p>
                      <p className="text-sm text-muted-foreground">
                        Събиране от 13:30
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Къща на Културата</p>
                      <p className="text-sm text-muted-foreground">
                        ул. &ldquo;Култура&rdquo; 1, София
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AnimatedCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WeddingDetails;
