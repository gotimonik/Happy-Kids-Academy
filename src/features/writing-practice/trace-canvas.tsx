"use client";

import { forwardRef, useImperativeHandle } from "react";
import { useTracePad } from "./use-trace-pad";

export interface TraceCanvasHandle {
  clear: () => void;
}

export const TraceCanvas = forwardRef<TraceCanvasHandle, { guideText: string; strokeColor: string }>(
  function TraceCanvas({ guideText, strokeColor }, ref) {
    const { canvasRef, containerRef, clear, handlePointerDown, handlePointerMove, handlePointerUp } =
      useTracePad({ guideText, strokeColor });

    useImperativeHandle(ref, () => ({ clear }), [clear]);

    return (
      <div
        ref={containerRef}
        className="aspect-square w-full max-w-md self-center overflow-hidden rounded-3xl border border-border bg-card shadow-lg"
      >
        <canvas
          ref={canvasRef}
          role="img"
          aria-label={`Writing practice pad. Guide letter ${guideText}. Draw with your mouse, finger, or stylus.`}
          className="touch-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />
      </div>
    );
  },
);
