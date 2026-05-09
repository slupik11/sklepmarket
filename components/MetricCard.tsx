import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  icon?: LucideIcon;
  label: string;
  value: string;
  sub?: string;
  highlight?: boolean;
  className?: string;
}

export default function MetricCard({
  icon: Icon,
  label,
  value,
  sub,
  highlight,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border p-5",
        highlight
          ? "border-violet/20 bg-violet-lighter"
          : "border-edge bg-white shadow-card",
        className
      )}
    >
      {Icon && (
        <div className={cn("mb-3 flex h-8 w-8 items-center justify-center rounded-lg", highlight ? "bg-violet/10" : "bg-bg-section")}>
          <Icon size={16} className={highlight ? "text-violet" : "text-ink-muted"} />
        </div>
      )}
      <p className="text-xs font-medium uppercase tracking-wider text-ink-faint">
        {label}
      </p>
      <p className={cn("mt-1 text-2xl font-bold", highlight ? "text-violet" : "text-ink")}>
        {value}
      </p>
      {sub && <p className="mt-0.5 text-xs text-ink-faint">{sub}</p>}
    </div>
  );
}
