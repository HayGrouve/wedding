"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Shield, AlertCircle } from "lucide-react";

// Validation schema for admin login
const adminLoginSchema = z.object({
  accessCode: z
    .string()
    .min(1, "Моля въведете код за достъп")
    .min(6, "Кодът трябва да бъде поне 6 символа"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

interface AdminLoginFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onLogin: (
    accessCode: string
  ) => Promise<{ success: boolean; error?: string }>;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  isOpen,
  onOpenChange,
  onLogin,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attempts, setAttempts] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onSubmit = async (data: AdminLoginFormData) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await onLogin(data.accessCode);

      if (result.success) {
        // Success - form will be closed by parent component
        reset();
        setAttempts(0);
        setError(null);
      } else {
        // Login failed
        setAttempts((prev) => prev + 1);
        setError(result.error || "Неправилен код за достъп");

        // Clear the form after failed attempt
        reset();
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Възникна грешка при влизането. Моля опитайте отново.");
      setAttempts((prev) => prev + 1);
      reset();
    } finally {
      setIsLoading(false);
    }
  };

  // Reset form and error state when dialog opens/closes
  React.useEffect(() => {
    if (!isOpen) {
      reset();
      setError(null);
    }
  }, [isOpen, reset]);

  // Lock out after too many attempts
  const isLockedOut = attempts >= 5;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="sm:max-w-md bg-white dark:bg-gray-900 border-2 border-primary/30 shadow-2xl"
        aria-describedby="admin-login-description"
      >
        <DialogHeader className="text-center space-y-4 pb-2">
          <div className="mx-auto mb-2 w-20 h-20 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center border-2 border-primary/20">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <DialogTitle className="text-2xl text-gray-900 dark:text-gray-100 font-semibold text-center">
            Админ Вход
          </DialogTitle>
          <DialogDescription
            id="admin-login-description"
            className="text-center text-gray-600 dark:text-gray-400 text-base leading-relaxed px-2"
          >
            Въведете код за достъп за управление на сватбената система
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pt-2">
          {/* Error Alert */}
          {error && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Lockout Warning */}
          {attempts >= 3 && !isLockedOut && (
            <Alert className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
              <AlertCircle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="text-amber-800 dark:text-amber-200 font-medium">
                Предупреждение: {5 - attempts} опита остават преди временно
                блокиране
              </AlertDescription>
            </Alert>
          )}

          {/* Lockout Message */}
          {isLockedOut && (
            <Alert
              variant="destructive"
              className="border-red-200 bg-red-50 dark:bg-red-950/20"
            >
              <AlertCircle className="h-5 w-5" />
              <AlertDescription className="text-red-800 dark:text-red-200 font-medium">
                Твърде много неуспешни опити. Моля изчакайте няколко минути и
                опитайте отново.
              </AlertDescription>
            </Alert>
          )}

          {/* Access Code Input */}
          <div className="space-y-3">
            <Label
              htmlFor="accessCode"
              className="text-sm font-semibold text-gray-900 dark:text-gray-100"
            >
              Код за достъп
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                id="accessCode"
                type="password"
                placeholder="Въведете код за достъп"
                disabled={isLoading || isLockedOut}
                className={`
                  pl-11 pr-4 py-3 text-base
                  bg-white dark:bg-gray-800 
                  border-2 border-gray-300 dark:border-gray-600
                  text-gray-900 dark:text-gray-100
                  placeholder:text-gray-500 dark:placeholder:text-gray-400
                  focus:border-primary focus:ring-primary/20 focus:ring-2
                  ${errors.accessCode ? "border-red-500 focus:border-red-500" : ""}
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                {...register("accessCode")}
                aria-describedby={
                  errors.accessCode ? "accessCode-error" : undefined
                }
                autoComplete="current-password"
              />
            </div>
            {errors.accessCode && (
              <p
                id="accessCode-error"
                className="text-sm text-red-600 dark:text-red-400 font-medium flex items-center gap-1"
                role="alert"
              >
                <AlertCircle className="h-4 w-4" />
                {errors.accessCode.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex flex-col gap-3 pt-2">
            <Button
              type="submit"
              disabled={isLoading || isLockedOut}
              className="
                w-full py-3 text-base font-semibold
                bg-primary hover:bg-primary/90 
                text-white border-0
                shadow-lg hover:shadow-xl
                transition-all duration-200
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg
              "
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Влизане...
                </>
              ) : (
                "Влизане"
              )}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="
                w-full py-3 text-base font-medium
                border-2 border-gray-300 dark:border-gray-600
                text-gray-700 dark:text-gray-300
                hover:bg-gray-50 dark:hover:bg-gray-800
                transition-all duration-200
                cursor-pointer
                disabled:opacity-50 disabled:cursor-not-allowed
              "
            >
              Отказ
            </Button>
          </div>

          {/* Attempts Counter (for debugging/monitoring) */}
          {attempts > 0 && (
            <div className="text-sm text-gray-600 dark:text-gray-400 text-center bg-gray-50 dark:bg-gray-800 rounded-lg py-2 px-3">
              Неуспешни опити: {attempts}/5
            </div>
          )}
        </form>

        {/* Security Notice */}
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
          <div className="flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            <span>Вашият достъп се следи за сигурност</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminLoginForm;
