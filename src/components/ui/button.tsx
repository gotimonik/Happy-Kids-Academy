import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes, CSSProperties } from "react";
import { cn } from "@/lib/utils";

/**
 * The shared "tactile" button language for the whole app: every filled or
 * outlined variant gets a colored 3D bottom edge (a hard-edged box-shadow in
 * a darker shade of the button's own color) plus a soft ambient glow
 * beneath it, so a flat color reads as a raised, pressable object instead
 * of a flat rectangle — then presses flat into that edge on tap. The gloss
 * highlight along the top (`.btn-tactile` in globals.css) and the colored
 * edge together are what make it "stylish" rather than just rounded-and-flat;
 * `ghost` intentionally opts out since it's meant to read as bare text/icon
 * until hovered, not as an object sitting on the page.
 *
 * `ToolIconButton` and `OptionButton` aren't built from this component (an
 * icon-only toolbar square and a full-width answer row have their own
 * shapes/behavior), but they reuse this same visual language by hand so
 * every clickable "button" in the app — action buttons, toolbar icons, quiz
 * answers — reads as one consistent family.
 */
export const buttonVariants = cva(
  // `disabled:translate-y-0` locks the resting (non-pressed) position — it's
  // the only disabled override for shape/shadow now, since `pointer-events-none`
  // already blocks hover/active from firing. Disabled buttons keep their full
  // 3D tactile shadow (just dimmed by `disabled:opacity-50` along with the
  // rest of the button) instead of going flat, so a disabled button still
  // reads as "the same kind of button", just unavailable right now.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-bold transition-all disabled:pointer-events-none disabled:opacity-50 disabled:translate-y-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
  {
    variants: {
      variant: {
        // Every shadow color-mixes from var(--btn-accent, ...) rather than
        // the theme color directly: `accentColor` (below) sets that custom
        // property alongside the background, so a recolored button (e.g. a
        // category's own color) gets a shadow that matches its face instead
        // of staying tinted to the variant's default theme color.
        primary:
          "btn-tactile bg-primary text-primary-foreground shadow-[0_5px_0_0_color-mix(in_srgb,var(--btn-accent,var(--primary))_100%,black_20%),0_8px_14px_-6px_color-mix(in_srgb,var(--btn-accent,var(--primary))_70%,transparent)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_0_color-mix(in_srgb,var(--btn-accent,var(--primary))_100%,black_20%),0_2px_4px_-2px_color-mix(in_srgb,var(--btn-accent,var(--primary))_50%,transparent)]",
        secondary:
          "btn-tactile bg-secondary text-secondary-foreground shadow-[0_5px_0_0_color-mix(in_srgb,var(--btn-accent,var(--secondary))_100%,black_16%),0_8px_14px_-6px_rgba(20,30,60,0.18)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_0_color-mix(in_srgb,var(--btn-accent,var(--secondary))_100%,black_16%),0_2px_4px_-2px_rgba(20,30,60,0.14)]",
        success:
          "btn-tactile bg-success text-success-foreground shadow-[0_5px_0_0_color-mix(in_srgb,var(--btn-accent,var(--success))_100%,black_20%),0_8px_14px_-6px_color-mix(in_srgb,var(--btn-accent,var(--success))_70%,transparent)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_0_color-mix(in_srgb,var(--btn-accent,var(--success))_100%,black_20%),0_2px_4px_-2px_color-mix(in_srgb,var(--btn-accent,var(--success))_50%,transparent)]",
        destructive:
          "btn-tactile bg-destructive text-destructive-foreground shadow-[0_5px_0_0_color-mix(in_srgb,var(--btn-accent,var(--destructive))_100%,black_20%),0_8px_14px_-6px_color-mix(in_srgb,var(--btn-accent,var(--destructive))_70%,transparent)] hover:brightness-105 hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_0_color-mix(in_srgb,var(--btn-accent,var(--destructive))_100%,black_20%),0_2px_4px_-2px_color-mix(in_srgb,var(--btn-accent,var(--destructive))_50%,transparent)]",
        ghost: "text-foreground hover:bg-secondary active:scale-[0.97]",
        outline:
          "btn-tactile border-2 border-border bg-card text-foreground shadow-[0_5px_0_0_color-mix(in_srgb,var(--btn-accent,var(--border))_100%,black_8%),0_8px_14px_-6px_rgba(20,30,60,0.12)] hover:bg-secondary hover:-translate-y-0.5 active:translate-y-[5px] active:shadow-[0_1px_0_0_color-mix(in_srgb,var(--btn-accent,var(--border))_100%,black_8%)]",
      },
      size: {
        sm: "h-9 px-4",
        md: "h-11 px-5",
        lg: "h-14 px-7 text-base",
        kid: "h-16 px-8 text-lg",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  /**
   * One-off accent color for this button — e.g. a learning category's own
   * color — instead of the variant's theme color. Sets the background AND
   * the "3D edge" shadow together (via the `--btn-accent` custom property
   * the variants above read), so a recolored button's shadow always matches
   * its face. Safe to combine with a `style` that also sets a gradient
   * (e.g. `tileGradient(accentColor)`) — this only adds `--btn-accent` and
   * a same-color `backgroundColor` fallback on top of it.
   */
  accentColor?: string;
}

export function Button({
  className,
  variant,
  size,
  asChild = false,
  accentColor,
  style,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      style={
        accentColor
          ? ({ ...style, backgroundColor: accentColor, "--btn-accent": accentColor } as CSSProperties)
          : style
      }
      {...props}
    />
  );
}
