import { Capacitor } from "@capacitor/core";

/**
 * Apple's Kids Category rules (App Review Guidelines 1.3) require anything
 * that leaves the app — links out, the share sheet, the App Store — to sit
 * behind a "parental gate": a check a grown-up can pass but a young child
 * can't. This is that check, for the iOS app only (Android and the website
 * resolve straight to `true`, unchanged).
 *
 * Call it right before the action and only continue on `true`:
 *
 *   if (!(await requestParentalGate())) return;
 *
 * The question UI itself is `<ParentalGateHost />`, mounted once in the root
 * layout; this function just asks it to open and waits for the answer.
 */
export const PARENTAL_GATE_EVENT = "hka:parental-gate";

export interface ParentalGateRequest {
  resolve: (passed: boolean) => void;
}

export function parentalGateRequired(): boolean {
  return Capacitor.getPlatform() === "ios";
}

export function requestParentalGate(): Promise<boolean> {
  if (typeof window === "undefined" || !parentalGateRequired()) return Promise.resolve(true);
  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent<ParentalGateRequest>(PARENTAL_GATE_EVENT, { detail: { resolve } }),
    );
  });
}
