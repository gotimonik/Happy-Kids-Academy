import type { ProgressShareData } from "./progress-url";

/**
 * Draws the "My progress" card that "Share my progress" sends as an image,
 * in the app's own look — the header's purple → pink gradient, the logo,
 * the child's level and four stat tiles.
 *
 * 1080 × 1920 (9:16), Instagram's Story size: a square image shared to a
 * Story gets zoomed to fill the tall screen and cropped at the sides, with
 * no way for the person to shrink it back. All the content sits in the
 * middle 1080 × 1350 band (y 285–1635), which is
 *  - clear of Instagram's own Story bars (profile row on top, reply bar at
 *    the bottom), and
 *  - exactly what's kept when Instagram crops a feed post to 4:5 portrait;
 * the gradient and decoration above and below that band are safe to lose.
 * Chat apps (WhatsApp, Messages) show the whole tall image as-is.
 *
 * Drawn on a canvas entirely on the device (no network, nothing uploaded),
 * with the app's own Baloo 2 font, read from the `--font-baloo` variable
 * `next/font` sets on <body>.
 */
const WIDTH = 1080;
const HEIGHT = 1920;
/** Top of the 1080 × 1350 (4:5) content band, centered vertically. */
const BAND_TOP = (HEIGHT - 1350) / 2;
const LOGO_SRC = "/icons/icon-512.png";
const BRAND_PURPLE = "#6C5CE7";
const APP_HOST = new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://happykidsacademy.playfantacy.com").host;

export interface ProgressCard {
  readonly dataUrl: string;
  readonly file: File;
}

export const PROGRESS_CARD_FILENAME = "happy-kids-academy-progress.png";

function displayFont(): string {
  const fromBody =
    typeof document !== "undefined"
      ? getComputedStyle(document.body).getPropertyValue("--font-baloo").trim()
      : "";
  return `${fromBody ? `${fromBody}, ` : ""}ui-rounded, system-ui, sans-serif`;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Couldn't load ${src}`));
    image.src = src;
  });
}

/** `ctx.roundRect` only exists from iOS 16; the app supports iOS 15. */
function roundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function dataUrlToFile(dataUrl: string, filename: string): File {
  const base64 = dataUrl.slice(dataUrl.indexOf(",") + 1);
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
  return new File([bytes], filename, { type: "image/png" });
}

export async function renderProgressCard(data: ProgressShareData): Promise<ProgressCard> {
  if ("fonts" in document) await document.fonts.ready.catch(() => {});
  const logo = await loadImage(LOGO_SRC).catch(() => null);
  const font = displayFont();

  const canvas = document.createElement("canvas");
  canvas.width = WIDTH;
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");
  const cx = WIDTH / 2;
  /** y within the content band → y on the canvas. */
  const y = (bandY: number) => BAND_TOP + bandY;

  // Background: the app header's signature gradient over the whole canvas,
  // plus soft decorative circles and sparkles in the margins above and
  // below the content band (fine to lose to Instagram's bars or crop).
  const bg = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  bg.addColorStop(0, BRAND_PURPLE);
  bg.addColorStop(0.5, "#A45EEA");
  bg.addColorStop(1, "#FF707D");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(WIDTH - 80, 170, 280, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  ctx.beginPath();
  ctx.arc(60, HEIGHT - 120, 260, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.18)";
  for (const [sx, sy, r] of [
    [140, 150, 10], [300, 230, 6], [880, 330, 8], [190, 1700, 7], [760, 1790, 10], [960, 1640, 6],
  ] as const) {
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Logo in a white circle.
  const logoCenterY = y(215);
  ctx.save();
  ctx.shadowColor = "rgba(20,20,43,0.25)";
  ctx.shadowBlur = 34;
  ctx.shadowOffsetY = 12;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(cx, logoCenterY, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, logoCenterY, 136, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, cx - 136, logoCenterY - 136, 272, 272);
    ctx.restore();
  }

  // Title and level pill.
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 64px ${font}`;
  ctx.fillText("My Happy Kids Academy progress", cx, y(450), WIDTH - 100);

  const levelText = `Level ${data.level}`;
  ctx.font = `800 58px ${font}`;
  const pillWidth = ctx.measureText(levelText).width + 120;
  ctx.fillStyle = "#FFFFFF";
  roundedRect(ctx, cx - pillWidth / 2, y(505), pillWidth, 92, 46);
  ctx.fill();
  ctx.fillStyle = BRAND_PURPLE;
  ctx.fillText(levelText, cx, y(553));

  // 2 × 2 stat tiles.
  const stats: ReadonlyArray<readonly [string, number, string, string]> = [
    ["⭐", data.stars, "Stars", "#E17B00"],
    ["🪙", data.coins, "Coins", "#B7791F"],
    ["🏅", data.badges, "Badges", "#E84393"],
    ["📚", data.lessonsCompleted, "Lessons", "#0984E3"],
  ];
  const tileW = 440;
  const tileH = 232;
  const gap = 40;
  const left = (WIDTH - tileW * 2 - gap) / 2;
  const top = y(665);
  stats.forEach(([emoji, value, label, color], index) => {
    const x = left + (index % 2) * (tileW + gap);
    const ty = top + Math.floor(index / 2) * (tileH + gap);
    ctx.save();
    ctx.shadowColor = "rgba(20,20,43,0.18)";
    ctx.shadowBlur = 26;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "#FFFFFF";
    roundedRect(ctx, x, ty, tileW, tileH, 44);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = "left";
    ctx.font = `84px ${font}`;
    ctx.fillText(emoji, x + 40, ty + tileH / 2 + 4);
    ctx.fillStyle = color;
    ctx.font = `800 92px ${font}`;
    ctx.fillText(String(value), x + 158, ty + 96, tileW - 178);
    ctx.fillStyle = "#4A4A68";
    ctx.font = `600 40px ${font}`;
    ctx.fillText(label, x + 160, ty + 172, tileW - 178);
    ctx.textAlign = "center";
  });

  // Footer: the app's address, so the picture still leads back to the app
  // even where the caption (with its link) gets separated from it.
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `600 38px ${font}`;
  ctx.fillText(`Play free at ${APP_HOST}`, cx, y(1265), WIDTH - 100);

  const dataUrl = canvas.toDataURL("image/png");
  return { dataUrl, file: dataUrlToFile(dataUrl, PROGRESS_CARD_FILENAME) };
}
