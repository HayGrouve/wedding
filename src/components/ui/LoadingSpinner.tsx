import React from "react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = "md",
  className = "",
  text = "Зареждане...",
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 ${className}`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-wedding-rose/20 border-t-wedding-rose`}
        aria-hidden="true"
      />
      {text && (
        <span
          className={`${textSizeClasses[size]} text-muted-foreground font-medium`}
        >
          {text}
        </span>
      )}
      <span className="sr-only">Зареждане на съдържанието</span>
    </div>
  );
};

export default LoadingSpinner;
