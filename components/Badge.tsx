import { cn } from "@/lib/utils";
import { ShieldCheck } from "lucide-react";

type BadgeVariant = "verified" | "sold" | "new" | "category" | "platform";

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className }: BadgeProps) {
  if (variant === "verified") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-violet/20 bg-violet-lighter px-2.5 py-0.5 text-xs font-medium text-violet",
          className
        )}
      >
        <ShieldCheck size={11} />
        Zweryfikowany
      </span>
    );
  }

  if (variant === "sold") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-600",
          className
        )}
      >
        Sprzedany
      </span>
    );
  }

  if (variant === "new") {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium text-emerald-700",
          className
        )}
      >
        Nowy
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md bg-bg-section border border-edge px-2 py-0.5 text-xs font-medium text-ink-muted",
        className
      )}
    >
      {label}
    </span>
  );
}
