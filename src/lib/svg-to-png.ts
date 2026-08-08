/**
 * Rasterizes a self-contained inline SVG (solid shapes only — no external
 * images/fonts) to a PNG data URL on a white background, so a colored
 * picture can be saved/downloaded like a normal image. `targetSize` is the
 * longest output edge in pixels; the SVG's own `viewBox` supplies the aspect
 * ratio.
 *
 * Unlike the free-draw canvas (which is already raster and can export
 * synchronously), this has to serialize the SVG, load it as an `<img>`, and
 * draw *that* onto a canvas — image decoding is inherently async, so this
 * is too.
 */
export async function svgToPngDataUrl(svg: SVGSVGElement, targetSize = 800): Promise<string | null> {
  const viewBox = svg.viewBox.baseVal;
  const width = viewBox && viewBox.width ? viewBox.width : svg.clientWidth;
  const height = viewBox && viewBox.height ? viewBox.height : svg.clientHeight;
  if (!width || !height) return null;

  // Clone rather than serialize the live node directly: a detached clone
  // can be given explicit width/height/xmlns attributes some browsers
  // require for a standalone (non-inline) SVG document, without touching
  // the interactive one still on screen.
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute("width", String(width));
  clone.setAttribute("height", String(height));
  clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const svgString = new XMLSerializer().serializeToString(clone);
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Failed to rasterize SVG"));
      img.src = url;
    });

    const scale = targetSize / Math.max(width, height);
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } catch {
    return null;
  } finally {
    URL.revokeObjectURL(url);
  }
}
