import React from "react";
import { redirect } from "next/navigation";
import { getAdminSession, getSessionInfo } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Users, Calendar, Settings, LogOut } from "lucide-react";

export default async function AdminDashboard() {
  // Check authentication on server side
  const session = await getAdminSession();

  if (!session || !session.isAdmin) {
    redirect("/admin/login");
  }

  // Get session information
  const sessionInfo = await getSessionInfo();

  // Format session time
  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleString("bg-BG", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Format remaining time
  const formatRemainingTime = (milliseconds: number) => {
    const hours = Math.floor(milliseconds / (1000 * 60 * 60));
    const minutes = Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}ч ${minutes}м`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-wedding-cream via-background to-wedding-sage/10">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-wedding-rose/10 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-wedding-rose" />
              </div>
              <div>
                <h1 className="text-2xl font-serif text-wedding-rose">
                  Админ Панел
                </h1>
                <p className="text-sm text-muted-foreground">
                  Ана-Мария & Иван - Сватбена Система
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800"
              >
                <Shield className="w-3 h-3 mr-1" />
                Автентифициран
              </Badge>

              <form action="/api/auth/logout?redirect=true" method="POST">
                <Button
                  type="submit"
                  variant="outline"
                  size="sm"
                  className="text-muted-foreground hover:text-destructive cursor-pointer hover:bg-transparent hover:border-destructive/20"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Излез
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {/* Session Info Card */}
          <Card className="border-wedding-rose/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-wedding-rose" />
                <span>Информация за сесията</span>
              </CardTitle>
              <CardDescription>Детайли за текущата админ сесия</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {sessionInfo && (
                <>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Влизане в:
                    </p>
                    <p className="text-sm">
                      {formatTime(sessionInfo.loginTime || Date.now())}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Остава време:
                    </p>
                    <p className="text-sm">
                      {sessionInfo.timeRemaining
                        ? formatRemainingTime(sessionInfo.timeRemaining)
                        : "Неизвестно"}
                    </p>
                  </div>
                </>
              )}
              <Badge variant="outline" className="w-full justify-center">
                Сесията изтича след 24 часа
              </Badge>
            </CardContent>
          </Card>

          {/* Quick Actions Card */}
          <Card className="border-wedding-sage/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="w-5 h-5 text-wedding-sage" />
                <span>Бързи действия</span>
              </CardTitle>
              <CardDescription>Често използвани функции</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Users className="w-4 h-4 mr-2" />
                Управление на гости
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Calendar className="w-4 h-4 mr-2" />
                Програма на събитието
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                disabled
              >
                <Settings className="w-4 h-4 mr-2" />
                Настройки на сайта
              </Button>
              <p className="text-xs text-muted-foreground text-center pt-2">
                Функциите ще бъдат добавени скоро
              </p>
            </CardContent>
          </Card>

          {/* System Status Card */}
          <Card className="border-wedding-gold/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-wedding-gold" />
                <span>Състояние на системата</span>
              </CardTitle>
              <CardDescription>
                Информация за сигурността и производителността
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Автентификация:</span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Активна
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Сигурност:</span>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  JWT Токени
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Сесии:</span>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-800"
                >
                  httpOnly Cookies
                </Badge>
              </div>
              <div className="text-xs text-muted-foreground pt-2">
                Всички достъпи се логват за сигурност
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="mt-8 border-wedding-rose/20 bg-gradient-to-r from-wedding-rose/5 to-wedding-gold/5">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-serif text-wedding-rose">
                Добре дошли в админ панела!
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Това е защитената админ зона за управление на сватбената система
                на Ана-Мария и Иван. Тук ще можете да управлявате гости,
                програма, настройки и други важни аспекти от сватбата.
              </p>
              <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>Защитено с JWT автентификация</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
