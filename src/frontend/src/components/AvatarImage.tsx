import { cn } from "@/lib/utils";
import type { ExternalBlob } from "@/types";

interface AvatarImageProps {
  blob?: ExternalBlob;
  displayName?: string;
  username?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  xs: "w-6 h-6 text-xs",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

function getInitials(displayName?: string, username?: string): string {
  const name = displayName || username || "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export function AvatarImage({
  blob,
  displayName,
  username,
  size = "md",
  className,
}: AvatarImageProps) {
  const initials = getInitials(displayName, username);
  const sizeClass = sizeMap[size];

  if (blob) {
    return (
      <img
        src={blob.getDirectURL()}
        alt={displayName || username || "Avatar"}
        className={cn(
          "rounded-full object-cover flex-shrink-0",
          sizeClass,
          className,
        )}
      />
    );
  }

  return (
    <span
      className={cn(
        "avatar rounded-full flex-shrink-0 select-none",
        sizeClass,
        className,
      )}
      aria-label={displayName || username || "User avatar"}
    >
      {initials}
    </span>
  );
}
