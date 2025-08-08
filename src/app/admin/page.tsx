import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAdminSession, getSessionInfo } from "@/lib/auth";

// Force dynamic rendering since we use cookies for authentication
export const dynamic = "force-dynamic";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, LogOut, ArrowLeft } from "lucide-react";
import { AdminDashboard as AdminDashboardComponent } from "@/components/admin/AdminDashboard";

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
          <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Върни се към началната страница"
              >
                <Button variant="ghost" size="sm" className="h-10 w-10 p-0">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="w-10 h-10 bg-primary/10 flex items-center justify-center rounded">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-serif text-primary">
                  Админ Панел
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">Анна-Мария & Георги - Сватбена Система</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
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
        {/* Session Info Card */}
        <div className="mb-6">
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Информация за сесията</span>
              </CardTitle>
              <CardDescription>
                Добре дошли в административния панел
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Статус:
                </p>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Активен
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Сигурност:
                </p>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-800"
                >
                  JWT
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Guest Management Dashboard */}
        <AdminDashboardComponent />
      </main>
    </div>
  );
}
