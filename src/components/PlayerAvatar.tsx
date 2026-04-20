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

/** Primera palabra arriba, resto (apellidos) debajo para no cortar el texto */
function splitGivenAndFamily(fullName: string): { given: string; family: string | null } {
  const parts = fullName.trim().split(/\s+/).filter(Boolean);
  if (parts.length <= 1) return { given: parts[0] ?? "", family: null };
  return {
    given: parts[0],
    family: parts.slice(1).join(" "),
  };
}

export const PlayerAvatar = ({ name, variant = "primary" }: PlayerAvatarProps) => {
  const { given, family } = splitGivenAndFamily(name);

  return (
    <div className="flex shrink-0 flex-col items-center gap-1.5 animate-scale-in">
      <div
        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-bold text-sm ring-4 shadow-court transition-bounce hover:scale-110 ${variantStyles[variant]}`}
      >
        {getInitials(name)}
      </div>
      <div className="flex max-w-[120px] flex-col items-center gap-0.5 rounded-2xl bg-background/95 px-3 py-1.5 text-center shadow-sm ring-1 ring-border/40 backdrop-blur">
        <span className="text-[11px] font-semibold leading-tight text-foreground">{given}</span>
        {family !== null ? (
          <span className="break-words text-[10px] font-medium leading-snug text-foreground/90">
            {family}
          </span>
        ) : null}
      </div>
    </div>
  );
};
