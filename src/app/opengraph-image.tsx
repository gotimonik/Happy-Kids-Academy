import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #6C5CE7 0%, #4834A8 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 120, display: "flex" }}>🎓</div>
        <div style={{ fontSize: 72, fontWeight: 700, marginTop: 20, display: "flex" }}>Happy Kids Academy</div>
        <div style={{ fontSize: 32, marginTop: 16, color: "#FFD166", display: "flex" }}>
          Learn • Play • Grow ✨
        </div>
      </div>
    ),
    { ...size },
  );
}
