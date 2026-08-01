import { clsx } from "clsx";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  const base =
    variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "text-ink-muted text-sm";
  return <button className={clsx(base, className)} {...props} />;
}
