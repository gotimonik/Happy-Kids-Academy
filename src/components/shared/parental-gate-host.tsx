"use client";

import { Lock } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PARENTAL_GATE_EVENT,
  parentalGateRequired,
  requestParentalGate,
  type ParentalGateRequest,
} from "@/lib/parental-gate/request-parental-gate";

/** A multiplication with a two-digit answer (e.g. 7 × 8): easy for an adult,
 * out of reach for the app's pre-school audience, and different every time
 * so it can't be memorized. */
function newQuestion() {
  const a = 3 + Math.floor(Math.random() * 7); // 3–9
  const b = 4 + Math.floor(Math.random() * 6); // 4–9
  return { a, b, answer: a * b };
}

/**
 * The parental gate's UI (see `requestParentalGate`). Mounted once in the
 * root layout. iOS only — renders nothing and installs nothing elsewhere.
 *
 * Besides answering explicit `requestParentalGate()` calls (share, save,
 * App Store), it guards every plain link that would leave the app (an
 * `https://` link to another site, `mailto:`, `tel:`): the tap is held,
 * the question is asked, and only a correct answer opens the link, in
 * Safari (Capacitor opens `window.open` URLs in the system browser).
 */
export function ParentalGateHost() {
  const [pending, setPending] = useState<ParentalGateRequest | null>(null);
  const [question, setQuestion] = useState(newQuestion);
  const [value, setValue] = useState("");
  const [wrong, setWrong] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!parentalGateRequired()) return;

    function onRequest(event: Event) {
      const request = (event as CustomEvent<ParentalGateRequest>).detail;
      setPending((current) => {
        // Only one question at a time; a second request while one is open is declined.
        if (current) {
          request.resolve(false);
          return current;
        }
        return request;
      });
      setQuestion(newQuestion());
      setValue("");
      setWrong(false);
    }

    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      const anchor = (event.target as Element | null)?.closest?.("a[href]");
      if (!(anchor instanceof HTMLAnchorElement)) return;
      let url: URL;
      try {
        url = new URL(anchor.href, window.location.href);
      } catch {
        return;
      }
      const leavesApp =
        url.protocol === "mailto:" ||
        url.protocol === "tel:" ||
        ((url.protocol === "http:" || url.protocol === "https:") && url.origin !== window.location.origin);
      if (!leavesApp) return;

      event.preventDefault();
      event.stopPropagation();
      void requestParentalGate().then((passed) => {
        if (passed) window.open(url.href, "_blank");
      });
    }

    window.addEventListener(PARENTAL_GATE_EVENT, onRequest);
    document.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener(PARENTAL_GATE_EVENT, onRequest);
      document.removeEventListener("click", onClick, true);
    };
  }, []);

  const finish = useCallback(
    (passed: boolean) => {
      pending?.resolve(passed);
      setPending(null);
    },
    [pending],
  );

  function submit(event: FormEvent) {
    event.preventDefault();
    if (Number(value.trim()) === question.answer) {
      finish(true);
      return;
    }
    // Wrong: a fresh question each time, so guessing doesn't converge.
    setWrong(true);
    setQuestion(newQuestion());
    setValue("");
    inputRef.current?.focus();
  }

  return (
    <Dialog open={pending !== null} onOpenChange={(open) => !open && finish(false)}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          // This one is for an adult who is about to type: put the cursor
          // straight in the answer box.
          event.preventDefault();
          inputRef.current?.focus();
        }}
      >
        <form onSubmit={submit} className="flex flex-col gap-4">
          <DialogHeader className="items-center text-center sm:items-start sm:text-left">
            <span
              aria-hidden="true"
              className="flex size-12 items-center justify-center rounded-2xl bg-secondary text-foreground"
            >
              <Lock className="size-6" />
            </span>
            <DialogTitle>Ask a grown-up</DialogTitle>
            <DialogDescription>
              This leaves the app. To continue, a grown-up needs to answer:
            </DialogDescription>
          </DialogHeader>

          <label className="flex flex-col items-center gap-2">
            <span className="font-display text-3xl font-bold tabular-nums">
              {question.a} × {question.b} = ?
            </span>
            <input
              ref={inputRef}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="off"
              aria-label={`What is ${question.a} times ${question.b}?`}
              aria-invalid={wrong || undefined}
              value={value}
              onChange={(event) => {
                setValue(event.target.value.replace(/[^0-9]/g, "").slice(0, 3));
                setWrong(false);
              }}
              className="h-12 w-32 rounded-2xl border-2 border-border bg-background text-center text-2xl font-bold tabular-nums outline-none focus-visible:border-ring"
            />
            {wrong && (
              <span role="alert" className="text-sm font-semibold text-destructive">
                Not quite — here&apos;s a new one.
              </span>
            )}
          </label>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => finish(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={value === ""}>
              Continue
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
