"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

// Types for authentication state
interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  loginTime?: number;
  timeRemaining?: number;
  sessionInfo?: {
    isAuthenticated: boolean;
    loginTime?: number;
    timeRemaining?: number;
  };
}

interface AuthContextType extends AuthState {
  login: (accessCode: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component props
interface AuthProviderProps {
  children: ReactNode;
}

// Security monitoring - store access attempts
interface AccessAttempt {
  timestamp: number;
  success: boolean;
  userAgent?: string;
  ip?: string;
}

class SecurityMonitor {
  private attempts: AccessAttempt[] = [];
  private readonly maxAttempts = 100; // Keep last 100 attempts

  logAttempt(success: boolean, userAgent?: string, ip?: string) {
    const attempt: AccessAttempt = {
      timestamp: Date.now(),
      success,
      userAgent,
      ip,
    };

    this.attempts.unshift(attempt);

    // Keep only the most recent attempts
    if (this.attempts.length > this.maxAttempts) {
      this.attempts = this.attempts.slice(0, this.maxAttempts);
    }

    // Log to console for monitoring
    console.log(
      `[Security] ${success ? "Successful" : "Failed"} login attempt at ${new Date(attempt.timestamp).toISOString()}`
    );

    // Store in localStorage for persistence (in real app, this would go to a secure backend)
    try {
      localStorage.setItem("admin_security_log", JSON.stringify(this.attempts));
    } catch (error) {
      console.warn("Failed to store security log:", error);
    }
  }

  getAttempts(): AccessAttempt[] {
    return [...this.attempts];
  }

  getFailedAttempts(timeWindow: number = 24 * 60 * 60 * 1000): AccessAttempt[] {
    const cutoff = Date.now() - timeWindow;
    return this.attempts.filter(
      (attempt) => !attempt.success && attempt.timestamp > cutoff
    );
  }

  loadFromStorage() {
    try {
      const stored = localStorage.getItem("admin_security_log");
      if (stored) {
        this.attempts = JSON.parse(stored);
      }
    } catch (error) {
      console.warn("Failed to load security log:", error);
      this.attempts = [];
    }
  }
}

// Create security monitor instance
const securityMonitor = new SecurityMonitor();

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
  });

  // Check authentication status
  const checkAuth = useCallback(async (): Promise<void> => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const sessionInfo = await response.json();
        setAuthState({
          isAuthenticated: sessionInfo.isAuthenticated,
          isLoading: false,
          loginTime: sessionInfo.loginTime,
          timeRemaining: sessionInfo.timeRemaining,
          sessionInfo,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  // Login function
  const login = async (
    accessCode: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accessCode }),
        credentials: "include",
      });

      const result = await response.json();

      // Log the attempt
      securityMonitor.logAttempt(
        result.success,
        navigator.userAgent,
        "client" // In a real app, you'd get the actual IP from the server
      );

      if (result.success) {
        // Refresh auth state after successful login
        await checkAuth();
      }

      return result;
    } catch (error) {
      console.error("Login error:", error);
      securityMonitor.logAttempt(false, navigator.userAgent, "client");
      return {
        success: false,
        error: "Възникна грешка при свързването със сървъра",
      };
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      // Clear auth state
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
      });

      // Clear any client-side session data
      sessionStorage.removeItem("admin_redirect");

      console.log("[Auth] User logged out");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear state on error for security
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
      });
    }
  };

  // Refresh session info
  const refreshSession = useCallback(async (): Promise<void> => {
    if (authState.isAuthenticated) {
      await checkAuth();
    }
  }, [authState.isAuthenticated, checkAuth]);

  // Check auth on mount and load security log
  useEffect(() => {
    securityMonitor.loadFromStorage();
    checkAuth();
  }, [checkAuth]);

  // Set up periodic session refresh (every 5 minutes)
  useEffect(() => {
    if (authState.isAuthenticated) {
      const interval = setInterval(refreshSession, 5 * 60 * 1000);
      return () => clearInterval(interval);
    }
  }, [authState.isAuthenticated, refreshSession]);

  // Provide context value
  const contextValue: AuthContextType = {
    ...authState,
    login,
    logout,
    checkAuth,
    refreshSession,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

// Export security monitor for admin dashboard
export const getSecurityMonitor = () => securityMonitor;

// Hook for security monitoring
export const useSecurityMonitor = () => {
  const [attempts, setAttempts] = useState<AccessAttempt[]>([]);

  useEffect(() => {
    const updateAttempts = () => {
      setAttempts(securityMonitor.getAttempts());
    };

    updateAttempts();

    // Update every 30 seconds
    const interval = setInterval(updateAttempts, 30000);
    return () => clearInterval(interval);
  }, []);

  return {
    attempts,
    failedAttempts: securityMonitor.getFailedAttempts(),
    totalAttempts: attempts.length,
    recentFailures: securityMonitor.getFailedAttempts(60 * 60 * 1000), // Last hour
  };
};
