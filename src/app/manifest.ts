import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "Happy Kids Academy",
    short_name: "Happy Kids Academy",
    description:
      "A joyful, free learning world for young children: alphabet, numbers, math, shapes, colors, animals, Gujarati, Hindi, quizzes, and games.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#FFF8EE",
    theme_color: "#6C5CE7",
    categories: ["education", "kids"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
