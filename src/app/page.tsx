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

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero
        brideName="Ана-Мария"
        groomName="Иван"
        weddingDate="15 юни 2024 г."
      />

      {/* Wedding Details Section */}
      <section id="wedding-details" className="section-padding bg-background">
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
                      15 юни 2024 г. от 16:00 ч.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold">Празненство</p>
                    <p className="text-muted-foreground">
                      15 юни 2024 г. от 18:00 ч.
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

      {/* Theme Showcase Section */}
      <section className="section-padding bg-background/80 backdrop-blur-sm">
        <div className="container-wedding">
          <h2 className="text-3xl font-bold text-center mb-12">
            Сватбен уебсайт
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Color Palette Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle>Цветова палитра</CardTitle>
                <CardDescription>Цветовете на нашата сватба</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="text-center">
                    <div className="w-full h-12 bg-primary rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Сватбена роза</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-secondary rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Шампанско злато</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-accent rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Градински зелен</p>
                  </div>
                  <div className="text-center">
                    <div className="w-full h-12 bg-muted rounded-md mb-2"></div>
                    <p className="text-xs font-medium">Крем</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Typography Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle>Типография</CardTitle>
                <CardDescription>Елегантни шрифтове</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-xl font-bold">Заглавия</h3>
                    <p className="text-sm text-muted-foreground">
                      Playfair Display
                    </p>
                  </div>
                  <div>
                    <p className="text-base">Основен текст</p>
                    <p className="text-sm text-muted-foreground">Inter шрифт</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Button Styles Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle>Стилове на бутоните</CardTitle>
                <CardDescription>Интерактивни елементи</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button size="sm" className="w-full">
                    Основен
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    Контурен
                  </Button>
                  <Button size="sm" variant="secondary" className="w-full">
                    Вторичен
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container-wedding text-center">
          <p className="text-muted-foreground">
            Сватбен уебсайт на Ана-Мария & Иван
          </p>
        </div>
      </footer>
    </div>
  );
}
