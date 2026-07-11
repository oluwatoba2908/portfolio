import Image from "next/image";
import { clsx } from "clsx";

export type AvatarSize = "sm" | "md" | "lg";

export type AvatarProps = {
  src: string;
  alt: string;
  size?: AvatarSize;
  className?: string;
};

const sizeMap: Record<AvatarSize, { px: number; className: string }> = {
  sm: { px: 40, className: "w-10 h-10" },
  md: { px: 62, className: "w-[62px] h-[62px]" },
  lg: { px: 76, className: "w-[76px] h-[76px]" }
};

/**
 * Round avatar image. Used in testimonial cards. Sized wrappers keep
 * next/image happy with a fixed aspect ratio and stable rendered size.
 */
export function Avatar({ src, alt, size = "md", className }: AvatarProps) {
  const s = sizeMap[size];
  return (
    <div
      className={clsx(
        "relative shrink-0 overflow-hidden bg-bg-inset",
        "rounded-[var(--radius-avatar)]",
        s.className,
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes={`${s.px}px`}
        className="object-cover"
      />
    </div>
  );
}
