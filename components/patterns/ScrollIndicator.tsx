import { clsx } from "clsx";

export type ScrollIndicatorProps = {
  label: string;
  className?: string;
};

/**
 * Green pulsing dot + uppercase eyebrow. Used above section headings on
 * dark backgrounds (Selected Projects). Server component — the pulse is
 * a pure CSS animation defined in globals.css.
 */
export function ScrollIndicator({ label, className }: ScrollIndicatorProps) {
  return (
    <div className={clsx("inline-flex items-center gap-3", className)}>
      <span className="relative inline-block w-3 h-3">
        <span className="absolute inset-0 rounded-full bg-accent-pulse blur-[8px] pulse-dot-glow" />
        <span className="absolute inset-[2px] rounded-full bg-accent-pulse" />
      </span>
      <span className="text-sm uppercase tracking-wide font-medium text-accent-pulse-text">
        {label}
      </span>
    </div>
  );
}
