import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LegalLayout } from "@/components/shared/legal-layout";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using Happy Kids Academy.",
  alternates: { canonical: "/terms" },
};

const LAST_UPDATED = "July 30, 2026";

export default function TermsPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Terms of Use" }]} />
      <LegalLayout title="Terms of Use" lastUpdated={LAST_UPDATED}>
        <section>
          <h2>Using the app</h2>
          <p>
            Happy Kids Academy is a free educational web app for young children, covering the
            alphabet, numbers, math, shapes, colors, animals, and more, along with quizzes and games.
            You&apos;re welcome to use it at home, in a classroom, or anywhere else, at no cost and
            without creating an account.
          </p>
        </section>

        <section>
          <h2>Appropriate use</h2>
          <ul>
            <li>Don&apos;t attempt to disrupt, overload, or gain unauthorized access to the app or its infrastructure.</li>
            <li>Don&apos;t copy, resell, or redistribute the app&apos;s content or code as your own commercial product.</li>
            <li>Don&apos;t use the app in any way that violates applicable laws.</li>
          </ul>
        </section>

        <section>
          <h2>Content and ownership</h2>
          <p>
            The design, code, and learning content presented in this app belong to Happy Kids
            Academy unless otherwise noted. Everyday words, letters, numbers, and general educational
            concepts are, of course, not owned by anyone — it&apos;s the particular presentation,
            design, and app experience that is protected.
          </p>
        </section>

        <section>
          <h2>No warranty</h2>
          <p>
            The app is provided &quot;as is,&quot; without warranties of any kind, express or
            implied. We work to keep it accurate, fast, and reliable, but we can&apos;t guarantee it
            will always be error-free, uninterrupted, or perfectly compatible with every device or
            browser.
          </p>
        </section>

        <section>
          <h2>Limitation of liability</h2>
          <p>
            To the fullest extent permitted by law, Happy Kids Academy and its creators are not
            liable for any indirect, incidental, or consequential damages arising from your use of, or
            inability to use, the app.
          </p>
        </section>

        <section>
          <h2>Changes to these terms</h2>
          <p>
            These terms may be updated occasionally to reflect new features or legal requirements.
            Continued use of the app after an update means you accept the revised terms.
          </p>
        </section>
      </LegalLayout>
    </PageContainer>
  );
}
