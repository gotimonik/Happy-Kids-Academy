import type { ColoringRegion } from "./use-coloring-game";

export function ColoringScene({
  fills,
  onRegionClick,
}: {
  fills: Record<ColoringRegion, string>;
  onRegionClick: (region: ColoringRegion) => void;
}) {
  function regionProps(region: ColoringRegion) {
    return {
      fill: fills[region],
      stroke: "#2D3447",
      strokeWidth: 3,
      onClick: () => onRegionClick(region),
      role: "button" as const,
      tabIndex: 0,
      "aria-label": `Color the ${region.replace("-", " ")}`,
      className: "cursor-pointer transition-colors",
      onKeyDown: (event: React.KeyboardEvent) => {
        if (event.key === "Enter" || event.key === " ") onRegionClick(region);
      },
    };
  }

  return (
    <svg viewBox="0 0 300 220" className="w-full max-w-md" aria-label="A house, tree, and sun to color">
      <rect x="0" y="0" width="300" height="220" fill="#EAF6FF" />
      <circle cx="245" cy="45" r="28" {...regionProps("sun")} />
      <polygon points="60,90 150,30 240,90" {...regionProps("roof")} />
      <rect x="70" y="90" width="160" height="100" {...regionProps("house")} />
      <rect x="135" y="130" width="30" height="60" {...regionProps("door")} />
      <rect x="95" y="110" width="30" height="30" {...regionProps("window")} />
      <rect x="30" y="160" width="14" height="35" {...regionProps("tree-trunk")} />
      <circle cx="37" cy="140" r="30" {...regionProps("tree-top")} />
    </svg>
  );
}
