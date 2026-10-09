import type { ProgressShareData } from "./progress-url";

/**
 * Draws the "My progress" card that "Share my progress" sends as an image:
 * a 1080 × 1080 PNG (square, so it shows uncropped in WhatsApp, Messages,
 * Instagram, etc.) in the app's own look — the header's purple → pink
 * gradient, the logo, the child's level and four stat tiles.
 *
 * Drawn on a canvas entirely on the device (no network, nothing uploaded),
 * with the app's own Baloo 2 font, read from the `--font-baloo` variable
 * `next/font` sets on <body>.
 */
const SIZE = 1080;
const LOGO_SRC = "/icons/icon-512.png";
const BRAND_PURPLE = "#6C5CE7";

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
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas not available");

  // Background: the app header's signature gradient + soft decorative circles.
  const bg = ctx.createLinearGradient(0, 0, SIZE, SIZE);
  bg.addColorStop(0, BRAND_PURPLE);
  bg.addColorStop(0.5, "#A45EEA");
  bg.addColorStop(1, "#FF707D");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, SIZE, SIZE);
  ctx.fillStyle = "rgba(255,255,255,0.10)";
  ctx.beginPath();
  ctx.arc(SIZE - 90, 110, 230, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.07)";
  ctx.beginPath();
  ctx.arc(70, SIZE - 60, 200, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Logo in a white circle.
  const logoCenterY = 190;
  ctx.save();
  ctx.shadowColor = "rgba(20,20,43,0.25)";
  ctx.shadowBlur = 30;
  ctx.shadowOffsetY = 10;
  ctx.fillStyle = "#FFFFFF";
  ctx.beginPath();
  ctx.arc(SIZE / 2, logoCenterY, 130, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  if (logo) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(SIZE / 2, logoCenterY, 118, 0, Math.PI * 2);
    ctx.clip();
    ctx.drawImage(logo, SIZE / 2 - 118, logoCenterY - 118, 236, 236);
    ctx.restore();
  }

  // Title and level pill.
  ctx.fillStyle = "#FFFFFF";
  ctx.font = `700 62px ${font}`;
  ctx.fillText("My Happy Kids Academy progress", SIZE / 2, 382, SIZE - 120);

  const levelText = `Level ${data.level}`;
  ctx.font = `800 54px ${font}`;
  const pillWidth = ctx.measureText(levelText).width + 110;
  ctx.fillStyle = "#FFFFFF";
  roundedRect(ctx, (SIZE - pillWidth) / 2, 432, pillWidth, 84, 42);
  ctx.fill();
  ctx.fillStyle = BRAND_PURPLE;
  ctx.fillText(levelText, SIZE / 2, 477);

  // 2 × 2 stat tiles.
  const stats: ReadonlyArray<readonly [string, number, string, string]> = [
    ["⭐", data.stars, "Stars", "#E17B00"],
    ["🪙", data.coins, "Coins", "#B7791F"],
    ["🏅", data.badges, "Badges", "#E84393"],
    ["📚", data.lessonsCompleted, "Lessons", "#0984E3"],
  ];
  const tileW = 430;
  const tileH = 196;
  const gap = 40;
  const left = (SIZE - tileW * 2 - gap) / 2;
  const top = 570;
  stats.forEach(([emoji, value, label, color], index) => {
    const x = left + (index % 2) * (tileW + gap);
    const y = top + Math.floor(index / 2) * (tileH + gap);
    ctx.save();
    ctx.shadowColor = "rgba(20,20,43,0.18)";
    ctx.shadowBlur = 24;
    ctx.shadowOffsetY = 8;
    ctx.fillStyle = "#FFFFFF";
    roundedRect(ctx, x, y, tileW, tileH, 40);
    ctx.fill();
    ctx.restore();

    ctx.textAlign = "left";
    ctx.font = `76px ${font}`;
    ctx.fillText(emoji, x + 40, y + tileH / 2 + 4);
    ctx.fillStyle = color;
    ctx.font = `800 84px ${font}`;
    ctx.fillText(String(value), x + 150, y + 82, tileW - 170);
    ctx.fillStyle = "#4A4A68";
    ctx.font = `600 38px ${font}`;
    ctx.fillText(label, x + 152, y + 146, tileW - 170);
    ctx.textAlign = "center";
  });

  // Footer.
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = `600 34px ${font}`;
  ctx.fillText("Learn • Play • Grow  —  free, offline, no ads", SIZE / 2, 1040, SIZE - 100);

  const dataUrl = canvas.toDataURL("image/png");
  return { dataUrl, file: dataUrlToFile(dataUrl, PROGRESS_CARD_FILENAME) };
}
