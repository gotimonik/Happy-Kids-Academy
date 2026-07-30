import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LegalLayout } from "@/components/shared/legal-layout";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Accessibility",
  description: "Our accessibility commitments for Happy Kids Academy.",
  alternates: { canonical: "/accessibility" },
};

const LAST_UPDATED = "July 30, 2026";

export default function AccessibilityPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Accessibility" }]} />
      <LegalLayout title="Accessibility Statement" lastUpdated={LAST_UPDATED}>
        <section>
          <h2>Our commitment</h2>
          <p>
            Happy Kids Academy is built to meet WCAG 2.1 AA guidelines. Every button, quiz option,
            and settings control is a real, focusable, screen-reader-friendly element — not a
            picture standing in for one.
          </p>
        </section>

        <section>
          <h2>What we support</h2>
          <ul>
            <li>Full keyboard navigation, including visible focus outlines throughout the app.</li>
            <li>Descriptive labels and live-region announcements for screen readers, including quiz feedback and game results.</li>
            <li>A &quot;skip to content&quot; link at the top of every page.</li>
            <li>Respect for your operating system&apos;s reduced-motion setting — confetti, balloon movement, and animated demos are toned down or disabled automatically.</li>
            <li>Light and dark themes with color combinations checked for adequate contrast.</li>
            <li>Large, forgiving touch targets sized for small hands.</li>
          </ul>
        </section>

        <section>
          <h2>Known limitations</h2>
          <p>
            A few games are inherently visual or timed by design — Balloon Pop and the Speed Round,
            for example — which can be harder to play with a screen reader or without a mouse/touch
            input. We&apos;re continuing to improve alternate ways to play these over time.
          </p>
        </section>

        <section>
          <h2>Feedback</h2>
          <p>
            If you run into an accessibility barrier anywhere in the app, please let us know what
            page you were on and what happened — that detail helps us fix it.
          </p>
        </section>
      </LegalLayout>
    </PageContainer>
  );
}
