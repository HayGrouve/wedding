import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Calendar, MapPin, Users } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen wedding-gradient">
      {/* Hero Section Preview */}
      <section className="section-padding">
        <div className="container-wedding text-center">
          <div className="mb-8">
            <Heart className="mx-auto mb-6 h-16 w-16 text-primary" />
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 wedding-text-gradient">
              Ана-Мария & Иван
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8">
              Заедно със семействата си, ви канят на тяхната сватба
            </p>
            <Button size="lg" className="wedding-glow">
              Вижте нашата история
            </Button>
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
            {/* Wedding Details Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  Детайли за сватбата
                </CardTitle>
                <CardDescription>Кога и къде ще празнуваме</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold">Дата и час</p>
                    <p className="text-muted-foreground">
                      15 юни 2024 г. от 16:00 ч.
                    </p>
                  </div>
                  <div>
                    <p className="font-semibold flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      Място
                    </p>
                    <p className="text-muted-foreground">
                      Красива градинска зала
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* RSVP Card */}
            <Card className="wedding-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-secondary" />
                  RSVP Формуляр
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

            {/* Color Palette Card */}
            <Card className="wedding-shadow md:col-span-2 lg:col-span-1">
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
          </div>

          {/* Typography Showcase */}
          <div className="mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4">Типография</h2>
            <div className="space-y-4">
              <h1 className="text-4xl font-bold">
                Елегантни заглавия (Playfair Display)
              </h1>
              <h2 className="text-2xl font-semibold">Красиви подзаглавия</h2>
              <p className="text-lg">
                Чист основен текст с шрифт Inter за отлична четимост
              </p>
              <p className="text-muted-foreground">
                Заглушен текст за вторична информация
              </p>
            </div>
          </div>

          {/* Button Variations */}
          <div className="mt-16">
            <h3 className="text-xl font-bold text-center mb-8">
              Стилове на бутоните
            </h3>
            <div className="flex flex-wrap justify-center gap-4">
              <Button>Основен бутон</Button>
              <Button variant="secondary">Вторичен бутон</Button>
              <Button variant="outline">Контурен бутон</Button>
              <Button variant="ghost">Прозрачен бутон</Button>
              <Button variant="destructive">Деструктивен бутон</Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t py-8">
        <div className="container-wedding text-center">
          <p className="text-muted-foreground">
            Сватбен уебсайт - готов за внедряване
          </p>
        </div>
      </footer>
    </div>
  );
}
