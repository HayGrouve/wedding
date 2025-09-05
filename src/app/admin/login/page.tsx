"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
import { AuthResponse } from "@/lib/auth";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle } from "lucide-react";

function AdminLoginContent() {
  const [isLoginOpen, setIsLoginOpen] = useState(true);
  const [message, setMessage] = useState<{
    type: "error" | "info";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Check for URL parameters on mount
  useEffect(() => {
    const expired = searchParams.get("expired");
    const error = searchParams.get("error");
    const redirect = searchParams.get("redirect");

    if (expired === "true") {
      setMessage({
        type: "info",
        text: "Вашата сесия изтече. Моля влезте отново.",
      });
    } else if (error === "session_error") {
      setMessage({
        type: "error",
        text: "Възникна грешка със сесията. Моля влезте отново.",
      });
    }

    // Store redirect URL for after login
    if (redirect) {
      sessionStorage.setItem("admin_redirect", redirect);
    }
  }, [searchParams]);

  const handleLogin = async (accessCode: string): Promise<AuthResponse> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
      });

      const result: AuthResponse = await response.json();

      if (result.success) {
        // Clear any error messages
        setMessage(null);

        // Get redirect URL from session storage or default to /admin
        const redirectUrl =
          sessionStorage.getItem("admin_redirect") || "/admin";
        sessionStorage.removeItem("admin_redirect");

        // Close the login form
        setIsLoginOpen(false);

        // Show success message briefly before redirect
        setMessage({
          type: "info",
          text: "Успешно влизане! Пренасочване...",
        });

        // Redirect after a brief delay
        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "Възникна грешка при свързването със сървъра",
      };
    }
  };

  const handleLoginClose = () => {
    // If user closes login without authenticating, redirect to home
    router.push("/");
  };

  return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Page Header */}
        <div className="text-center space-y-2">
                      <h1 className="text-3xl text-primary">Админ Панел</h1>
          <p className="text-muted-foreground">Анна-Мария & Георги - Сватбена Система</p>
        </div>

        {/* Status Messages */}
        {message && (
          <Alert variant={message.type === "error" ? "destructive" : "default"}>
            {message.type === "error" ? (
              <AlertCircle className="h-4 w-4" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        {/* Login Form */}
        <AdminLoginForm
          isOpen={isLoginOpen}
          onOpenChange={setIsLoginOpen}
          onLogin={handleLogin}
        />

        {/* If login form is closed but user is not authenticated, show reopen option */}
        {!isLoginOpen && (
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Нужен е код за достъп за влизане в админ панела
            </p>
            <button
              onClick={() => setIsLoginOpen(true)}
                              className="text-primary hover:text-primary/80 underline"
            >
              Отвори формата за влизане
            </button>
            <br />
            <button
              onClick={handleLoginClose}
              className="text-muted-foreground hover:text-foreground underline text-sm"
            >
              Върни се към началната страница
            </button>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground pt-8">
          <p>Защитено с автентификация</p>
          <p>© 2025 Сватбена Система</p>
        </div>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="w-full max-w-md space-y-6">
            <div className="text-center space-y-2">
              <h1 className="text-3xl text-primary">
                Админ Панел
              </h1>
              <p className="text-muted-foreground">Зареждане...</p>
            </div>
          </div>
        </div>
      }
    >
      <AdminLoginContent />
    </Suspense>
  );
}
