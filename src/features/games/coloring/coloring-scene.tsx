import { forwardRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import type { ColoringRegion, SceneId, ShapeSceneId, StructureSceneId } from "./use-coloring-game";
import { isStructureScene, UNCOLORED_FILL } from "./use-coloring-game";

const SHAPE_VIEWBOX = "0 0 300 260";
const STRUCTURE_VIEWBOX = "0 0 300 220";

interface RegionProps {
  readonly fill: string;
  readonly stroke: string;
  readonly strokeWidth: number;
  readonly onClick: () => void;
  readonly role: "button";
  readonly tabIndex: number;
  readonly "aria-label": string;
  readonly className: string;
  readonly onKeyDown: (event: KeyboardEvent) => void;
}

function buildRegionProps(fill: string, label: string, onClick: () => void): RegionProps {
  return {
    fill,
    stroke: "#2D3447",
    strokeWidth: 3,
    onClick,
    role: "button",
    tabIndex: 0,
    "aria-label": label,
    // These are `tabIndex`-focusable SVG shapes, not native buttons — the
    // browser's default UA focus outline doesn't reliably restrict itself
    // to keyboard focus on those the way it does on real `<button>`s, so it
    // was drawing a chunky rectangle around a just-*clicked* region too.
    // Suppress the default outline and only draw one for real keyboard
    // (`:focus-visible`) navigation, same as every other interactive
    // element in the app.
    className: "cursor-pointer outline-none transition-colors focus-visible:outline-2 focus-visible:outline-ring",
    onKeyDown: (event) => {
      if (event.key === "Enter" || event.key === " ") onClick();
    },
  };
}

/** One outline per plain shape scene — same ten shapes as the Shapes learning category, single fillable region. */
function shapeOutline(sceneId: ShapeSceneId, props: RegionProps) {
  switch (sceneId) {
    case "circle":
      return <circle cx="150" cy="140" r="100" {...props} />;
    case "square":
      return <rect x="50" y="40" width="200" height="200" rx="10" {...props} />;
    case "triangle":
      return <polygon points="150,30 245,195 55,195" {...props} />;
    case "rectangle":
      return <rect x="30" y="70" width="240" height="140" rx="10" {...props} />;
    case "star":
      return (
        <polygon
          points="150,40 174,108 245,109 188,152 209,221 150,180 91,221 112,152 55,109 127,108"
          {...props}
        />
      );
    case "oval":
      return <ellipse cx="150" cy="140" rx="120" ry="80" {...props} />;
    case "diamond":
      return <polygon points="150,30 260,140 150,250 40,140" {...props} />;
    case "heart":
      return (
        <path
          d="M150,225 C110,185 40,140 40,90 C40,55 75,30 105,45 C125,55 140,75 150,95
             C160,75 175,55 195,45 C225,30 260,55 260,90 C260,140 190,185 150,225 Z"
          {...props}
        />
      );
    case "pentagon":
      return <polygon points="150,40 245,109 209,221 91,221 55,109" {...props} />;
    case "hexagon":
      return <polygon points="150,40 237,90 237,190 150,240 63,190 63,90" {...props} />;
  }
}

/** The inner markup for each multi-part picture — each named region colored independently. */
function structureContent(
  sceneId: StructureSceneId,
  fillFor: (region: ColoringRegion) => string,
  onRegionClick: (region: ColoringRegion) => void,
): ReactNode {
  const at = (region: string, label: string) => buildRegionProps(fillFor(region), label, () => onRegionClick(region));

  switch (sceneId) {
    case "house":
      return (
        <>
          <circle cx="245" cy="45" r="28" {...at("sun", "Color the sun")} />
          <polygon points="60,90 150,30 240,90" {...at("roof", "Color the roof")} />
          <rect x="70" y="90" width="160" height="100" {...at("house", "Color the house")} />
          <rect x="135" y="130" width="30" height="60" {...at("door", "Color the door")} />
          <rect x="95" y="110" width="30" height="30" {...at("window", "Color the window")} />
          <rect x="30" y="160" width="14" height="35" {...at("tree-trunk", "Color the tree trunk")} />
          <circle cx="37" cy="140" r="30" {...at("tree-top", "Color the tree top")} />
        </>
      );
    case "temple":
      return (
        <>
          <polygon points="70,210 230,210 210,190 90,190" {...at("steps", "Color the steps")} />
          <rect x="90" y="110" width="120" height="80" {...at("body", "Color the temple body")} />
          <rect x="95" y="110" width="14" height="80" {...at("pillar-left", "Color the left pillar")} />
          <rect x="191" y="110" width="14" height="80" {...at("pillar-right", "Color the right pillar")} />
          <rect x="135" y="140" width="30" height="50" rx="15" {...at("door", "Color the door")} />
          <polygon points="150,20 190,110 110,110" {...at("spire", "Color the spire")} />
          <polygon points="150,5 160,22 140,22" {...at("flag", "Color the flag")} />
        </>
      );
    case "car":
      return (
        <>
          <rect x="40" y="120" width="220" height="50" rx="20" {...at("body", "Color the car body")} />
          <path
            d="M90,120 C95,90 125,80 160,80 L190,80 C210,80 220,95 225,120 Z"
            {...at("roof", "Color the car roof")}
          />
          <rect x="118" y="92" width="75" height="24" rx="6" {...at("window", "Color the window")} />
          <circle cx="95" cy="175" r="22" {...at("wheel-front", "Color the front wheel")} />
          <circle cx="205" cy="175" r="22" {...at("wheel-back", "Color the back wheel")} />
          <circle cx="252" cy="140" r="9" {...at("headlight", "Color the headlight")} />
        </>
      );
    case "bike":
      return (
        <>
          <circle cx="70" cy="170" r="35" {...at("wheel-back", "Color the back wheel")} />
          <circle cx="220" cy="170" r="35" {...at("wheel-front", "Color the front wheel")} />
          <polygon points="70,170 145,90 175,90 220,170 145,170" {...at("frame", "Color the bike frame")} />
          <rect x="136" y="76" width="22" height="9" rx="4" {...at("seat", "Color the seat")} />
          <rect x="168" y="76" width="18" height="9" rx="4" {...at("handlebar", "Color the handlebar")} />
          {/* Wheel hubs are decorative only — coloring the whole wheel disc is the point, not the spokes. */}
          <circle cx="70" cy="170" r="7" fill="#2D3447" aria-hidden="true" />
          <circle cx="220" cy="170" r="7" fill="#2D3447" aria-hidden="true" />
        </>
      );
    case "school":
      return (
        <>
          <polygon points="60,100 150,50 240,100" {...at("roof", "Color the roof")} />
          <rect x="60" y="100" width="180" height="100" {...at("building", "Color the school building")} />
          <rect x="135" y="150" width="30" height="50" {...at("door", "Color the door")} />
          <rect x="85" y="125" width="35" height="35" {...at("window-left", "Color the left window")} />
          <rect x="180" y="125" width="35" height="35" {...at("window-right", "Color the right window")} />
          <line x1="150" y1="50" x2="150" y2="22" stroke="#2D3447" strokeWidth="3" aria-hidden="true" />
          <polygon points="150,22 176,29 150,36" {...at("flag", "Color the flag")} />
        </>
      );
    case "building":
      return (
        <>
          <rect x="110" y="40" width="80" height="15" {...at("roof", "Color the rooftop")} />
          <rect x="90" y="55" width="120" height="145" {...at("building", "Color the building")} />
          <rect x="135" y="170" width="30" height="30" {...at("door", "Color the door")} />
          <rect x="105" y="75" width="25" height="25" {...at("window-1", "Color the first window")} />
          <rect x="175" y="75" width="25" height="25" {...at("window-2", "Color the second window")} />
          <rect x="140" y="120" width="25" height="25" {...at("window-3", "Color the third window")} />
        </>
      );
  }
}

/**
 * `ref` exposes the raw `<svg>` DOM node — the Coloring game rasterizes it
 * (see `@/lib/svg-to-png`) to save a picture, the same way the Drawing
 * game's canvas exports its own pixels.
 */
export const ColoringScene = forwardRef<
  SVGSVGElement,
  {
    sceneId: SceneId;
    fills: Record<ColoringRegion, string>;
    onRegionClick: (region: ColoringRegion) => void;
  }
>(function ColoringScene({ sceneId, fills, onRegionClick }, ref) {
  function fillFor(region: ColoringRegion): string {
    return fills[region] ?? UNCOLORED_FILL;
  }

  if (isStructureScene(sceneId)) {
    return (
      <svg ref={ref} viewBox={STRUCTURE_VIEWBOX} className="w-full max-w-sm" aria-label={`A ${sceneId} to color`}>
        <rect x="0" y="0" width="300" height="220" fill="#EAF6FF" />
        {structureContent(sceneId, fillFor, onRegionClick)}
      </svg>
    );
  }

  const props = buildRegionProps(fillFor("shape"), `Color the ${sceneId}`, () => onRegionClick("shape"));
  return (
    <svg ref={ref} viewBox={SHAPE_VIEWBOX} className="w-full max-w-sm" aria-label={`A ${sceneId} to color`}>
      <rect x="0" y="0" width="300" height="260" fill="#EAF6FF" />
      {shapeOutline(sceneId, props)}
    </svg>
  );
});
