/**
 * Google Analytics 4 measurement ID. Not a secret — GA measurement IDs are
 * always visible in client-side page source — so a plain constant (optionally
 * overridable via env var for staging/prod separation) is fine here.
 */
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "G-XNTH812QBR";

export const analyticsEnabled = Boolean(GA_MEASUREMENT_ID);
