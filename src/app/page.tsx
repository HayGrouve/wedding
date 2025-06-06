import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar, MapPin, Users } from "lucide-react";
import Hero from "@/components/Hero";
import MainLayout from "@/components/layout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
      {/* Hero Section */}
      <section id="home" className="scroll-offset" aria-label="Заглавна секция">
        <Hero
          brideName="Ана-Мария"
          groomName="Иван"
          weddingDate="15 септември 2025 г."
        />
      </section>

      {/* Wedding Details Section */}
      <section
        id="details"
        className="section-padding bg-background scroll-offset"
        aria-label="Детайли за сватбата"
      >
        <div className="container-wedding">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 wedding-text-gradient">
              Детайли за сватбата
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Всичко, което трябва да знаете за нашия специален ден
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Wedding Details Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Дата и час
                </CardTitle>
                <CardDescription>Кога ще празнуваме</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Церемония</p>
                    <p className="text-muted-foreground">
                      15 септември 2025 г. от 16:00 ч.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Празненство</p>
                    <p className="text-muted-foreground">
                      15 септември 2025 г. от 18:00 ч.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Място
                </CardTitle>
                <CardDescription>Къде ще се проведе сватбата</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Църква</p>
                    <p className="text-muted-foreground">Св. София, София</p>
                  </div>
                  <div>
                    <p className="font-semibold">Празненство</p>
                    <p className="text-muted-foreground">Хотел Гранд, София</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Card */}
            <Card className="wedding-shadow md:col-span-2 lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  RSVP
                </CardTitle>
                <CardDescription>
                  Моля, потвърдете присъствието си
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full">
                    Ще присъствате ли?
                  </Button>
                  <Button variant="outline" className="w-full">
                    Хранителни предпочитания
                  </Button>
                  <Button className="w-full bg-secondary hover:bg-secondary/90">
                    Изпрати RSVP
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

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
            <p className="text-center text-muted-foreground">
              RSVP формата ще бъде добавена скоро...
            </p>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
