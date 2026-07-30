import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { LegalLayout } from "@/components/shared/legal-layout";
import { PageContainer } from "@/components/shared/page-container";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Happy Kids Academy handles data, including the anonymous usage analytics we collect to improve the app.",
  alternates: { canonical: "/privacy-policy" },
};

const LAST_UPDATED = "July 30, 2026";

export default function PrivacyPolicyPage() {
  return (
    <PageContainer>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]} />
      <LegalLayout title="Privacy Policy" lastUpdated={LAST_UPDATED}>
        <section>
          <h2>The short version</h2>
          <p>
            Happy Kids Academy does not collect, store, or transmit any personal information. There
            are no user accounts, no sign-ups, and no servers involved in normal use. Everything the
            app remembers — stars, coins, badges, language, and sound preferences — stays in your
            browser, on your device. We do use privacy-conscious, anonymous usage analytics to
            understand which pages and games are popular, described below.
          </p>
        </section>

        <section>
          <h2>What is stored, and where</h2>
          <p>
            The app uses your browser&apos;s local storage to remember your progress between visits.
            This includes: stars and best quiz scores per topic, coins, lessons completed, total time
            spent in the app, and your language/voice/music settings. None of this is sent anywhere —
            it never leaves your device, and we (the app&apos;s developers) never see it.
          </p>
          <p>
            You can clear this data at any time from <strong>Settings → Reset Progress</strong>, or by
            clearing your browser&apos;s site data for this page.
          </p>
        </section>

        <section>
          <h2>Voice and sound</h2>
          <p>
            Spoken pronunciation and feedback use your browser&apos;s built-in text-to-speech engine
            (the Web Speech API). This processing happens locally in your browser or operating
            system — no audio or text is sent to us or to any third party for this purpose.
          </p>
        </section>

        <section>
          <h2>No accounts, no ads</h2>
          <p>
            Happy Kids Academy has no login system and displays no advertising.
          </p>
        </section>

        <section>
          <h2>Anonymous usage analytics</h2>
          <p>
            We use Google Analytics to understand, in aggregate, which pages and games are used and
            how often — this helps us decide what to improve next. Analytics data is tied to an
            anonymous device identifier, not to any name, email address, or other personal
            information, since we never collect any of that in the first place.
          </p>
          <p>
            We&apos;ve turned off Google Signals and ad-personalization signals for this site, so
            analytics data is never used for advertising or combined with other Google account
            activity. Some browser ad/tracker blockers may prevent analytics from loading — the app
            works exactly the same either way.
          </p>
          <p>
            You can read Google&apos;s own explanation of what Analytics collects at{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
              policies.google.com/privacy
            </a>
            .
          </p>
        </section>

        <section>
          <h2>Children&apos;s privacy</h2>
          <p>
            This app is designed for young children and is built specifically to avoid collecting any
            personal information from any user, child or adult. The only data collected is anonymous
            aggregate usage analytics (see above) — never a name, contact detail, photo, or anything
            that identifies a specific child.
          </p>
        </section>

        <section>
          <h2>Changes to this policy</h2>
          <p>
            If this policy ever changes — for example, if a future feature introduces optional
            account sync — this page will be updated first, with a new &quot;last updated&quot; date
            above, before that feature is enabled.
          </p>
        </section>
      </LegalLayout>
    </PageContainer>
  );
}
