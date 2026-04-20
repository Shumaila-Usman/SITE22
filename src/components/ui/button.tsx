"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost";
type ButtonSize = "default" | "sm" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const variantClasses: Record<ButtonVariant, string> = {
  default:
    "bg-red-600 text-white border border-red-500 shadow-glow hover:bg-red-500 hover:scale-[1.02]",
  outline:
    "bg-transparent text-white border border-white/35 hover:border-red-500 hover:text-red-300",
  ghost: "bg-transparent text-zinc-200 hover:bg-white/10 hover:text-white",
};

const sizeClasses: Record<ButtonSize, string> = {
  default: "h-11 px-6 text-sm",
  sm: "h-9 px-4 text-xs",
  lg: "h-12 px-8 text-base",
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-semibold tracking-wide transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/70 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[variant],
          sizeClasses[size],
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
