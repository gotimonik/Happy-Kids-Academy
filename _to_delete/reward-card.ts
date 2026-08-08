/**
 * Renders a shareable "reward card" image summarizing a child's progress —
 * the app's signature brand gradient (see `heroGradient` in
 * `@/lib/ui/tile-gradient`) plus their level and stats, so sharing it looks
 * like a little on-brand achievement badge rather than a plain screenshot.
 */

export interface ProgressShareData {
  readonly level: number;
  readonly stars: number;
  readonly coins: number;
  readonly badges: number;
  readonly lessonsCompleted: number;
}

const CARD_SIZE = 1080;

/** Manual rounded-rect path — kept instead of the newer native `ctx.roundRect` for broader WebView compatibility. */
function roundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

/**
 * Canvas2D's `font` setter parses a plain CSS font string — it doesn't
 * resolve custom properties, so handing it "var(--font-baloo)" literally
 * fails silently. Read the variable's raw value (next/font's generated
 * font-family list) straight off the body instead — same trick used by the
 * Drawing/Writing-practice canvas.
 */
function displayFont(): string {
  if (typeof document === "undefined") return "sans-serif";
  return getComputedStyle(document.body).getPropertyValue("--font-baloo").trim() || "sans-serif";
}

export async function renderRewardCard(data: ProgressShareData): Promise<Blob | null> {
  const canvas = document.createElement("canvas");
  canvas.width = CARD_SIZE;
  canvas.height = CARD_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const font = displayFont();

  // Background: the app's signature 3-color brand gradient.
  const gradient = ctx.createLinearGradient(0, 0, CARD_SIZE, CARD_SIZE);
  gradient.addColorStop(0, "#6C5CE7");
  gradient.addColorStop(0.5, "#A45EEA");
  gradient.addColorStop(1, "#FF707D");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, CARD_SIZE, CARD_SIZE);

  // A couple of soft translucent circles, echoing the on-screen dashboard
  // card's decorative bubbles, so this doesn't read as a flat screenshot.
  ctx.fillStyle = "rgba(255,255,255,0.15)";
  ctx.beginPath();
  ctx.arc(CARD_SIZE - 130, 150, 230, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.beginPath();
  ctx.arc(110, CARD_SIZE - 140, 230, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 46px ${font}`;
  ctx.fillText("Happy Kids Academy", CARD_SIZE / 2, 110);

  ctx.font = "170px sans-serif"; // emoji ignore font-family; keep a plain fallback
  ctx.fillText("🏆", CARD_SIZE / 2, 350);

  ctx.font = `bold 86px ${font}`;
  ctx.fillText(`Level ${data.level}`, CARD_SIZE / 2, 470);

  const stats: ReadonlyArray<{ icon: string; value: number; label: string }> = [
    { icon: "⭐", value: data.stars, label: "Stars" },
    { icon: "🪙", value: data.coins, label: "Coins" },
    { icon: "🏅", value: data.badges, label: "Badges" },
    { icon: "✅", value: data.lessonsCompleted, label: "Lessons" },
  ];

  const chipWidth = 220;
  const chipHeight = 220;
  const gap = 24;
  const totalWidth = stats.length * chipWidth + (stats.length - 1) * gap;
  const startX = (CARD_SIZE - totalWidth) / 2;
  const chipY = 570;

  stats.forEach((stat, index) => {
    const x = startX + index * (chipWidth + gap);
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    roundRectPath(ctx, x, chipY, chipWidth, chipHeight, 32);
    ctx.fill();

    const centerX = x + chipWidth / 2;
    ctx.font = "72px sans-serif";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(stat.icon, centerX, chipY + 75);

    ctx.font = `bold 54px ${font}`;
    ctx.fillText(String(stat.value), centerX, chipY + 145);

    ctx.font = `bold 26px ${font}`;
    ctx.fillStyle = "rgba(255,255,255,0.85)";
    ctx.fillText(stat.label, centerX, chipY + 190);
  });

  ctx.fillStyle = "#FFFFFF";
  ctx.font = `bold 40px ${font}`;
  ctx.fillText("Come learn and play with me!", CARD_SIZE / 2, CARD_SIZE - 110);

  ctx.font = `28px ${font}`;
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.fillText("Free • works offline • no ads, no accounts", CARD_SIZE / 2, CARD_SIZE - 62);

  return new Promise((resolve) => {
    canvas.toBlob((blob) => resolve(blob), "image/png");
  });
}
