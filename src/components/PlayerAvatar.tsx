interface PlayerAvatarProps {
  name: string;
  /** Optional accent color class for the avatar ring/bg */
  variant?: "primary" | "accent" | "secondary";
}

const variantStyles: Record<NonNullable<PlayerAvatarProps["variant"]>, string> = {
  primary: "bg-gradient-primary text-primary-foreground ring-primary-glow/40",
  accent: "bg-gradient-accent text-accent-foreground ring-accent/40",
  secondary: "bg-secondary text-secondary-foreground ring-secondary/40",
};

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

export const PlayerAvatar = ({ name, variant = "primary" }: PlayerAvatarProps) => {
  return (
    <div className="flex flex-col items-center gap-1.5 animate-scale-in">
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full font-bold text-sm ring-4 shadow-court transition-bounce hover:scale-110 ${variantStyles[variant]}`}
      >
        {getInitials(name)}
      </div>
      <span className="text-[11px] font-semibold text-foreground bg-background/90 backdrop-blur px-2 py-0.5 rounded-full shadow-sm max-w-[80px] truncate">
        {name}
      </span>
    </div>
  );
};
