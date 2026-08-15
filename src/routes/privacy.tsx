import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

const PRIVACY_EMAIL = "connect@themagislabs.com";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy - Magis Labs" },
      {
        name: "description",
        content:
          "How Magis Labs collects, uses, shares, and protects personal information when you use our website and services.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="legal-doc">
        <Reveal>
          <PageHeroHeading>Privacy Policy</PageHeroHeading>
          <p className="legal-doc__lede">Effective date: August 14, 2026</p>
        </Reveal>
        <Reveal>
          <div>
            <p className="legal-doc__intro">
              This page is maintained by Magis Labs to answer common privacy
              questions about our website and services. It is not legal advice and
              should be reviewed by your own counsel.
            </p>
            <p>
              Magis Labs (&quot;Magis Labs&quot;, &quot;we&quot;, &quot;us&quot;, or
              &quot;our&quot;) respects your privacy. This Privacy Policy explains
              how we collect, use, share, and protect personal information when you
              use our website, services, or communicate with us.
            </p>

            <h2>1. Information we collect</h2>
            <p>
              We collect information you provide directly to us when you contact
              us, request a consultation, submit a form, or otherwise communicate
              with us. This may include:
            </p>
            <ul>
              <li>Name, email address, phone number, and company name</li>
              <li>Job title and professional information</li>
              <li>
                Information you provide about your organization or business needs
              </li>
              <li>Messages, inquiries, and other content you submit</li>
              <li>Other information you voluntarily provide</li>
            </ul>
            <p>
              We may also automatically collect information such as your IP
              address, browser type, device information, pages visited, and
              information collected through cookies or similar technologies.
            </p>

            <h2>2. How we use your information</h2>
            <p>We use the information we collect to:</p>
            <ul>
              <li>Respond to inquiries and requests</li>
              <li>Schedule consultations and communicate with you</li>
              <li>Provide and improve our services</li>
              <li>Understand business needs and develop recommendations</li>
              <li>Improve our website and user experience</li>
              <li>Analyze website usage and performance</li>
              <li>Send relevant communications where permitted</li>
              <li>Protect our website and prevent fraud or misuse</li>
              <li>Comply with legal obligations</li>
            </ul>

            <h2>3. Sharing your information</h2>
            <p>
              We do not sell your personal information. We may share information
              with service providers that help us operate our website and
              business, such as hosting, analytics, email, scheduling,
              communication, and technology providers.
            </p>
            <p>
              We may also disclose information when required by law, to protect
              our rights, prevent fraud or security issues, or as part of a
              business transaction such as a merger or acquisition.
            </p>

            <h2>4. Cookies and analytics</h2>
            <p>
              We may use cookies and similar technologies to remember preferences,
              understand website usage, measure performance, and improve our
              services.
            </p>
            <p>
              You can control cookies through your browser settings. Some website
              features may not function properly if cookies are disabled.
            </p>

            <h2>5. Data security</h2>
            <p>
              We use reasonable administrative, technical, and organizational
              safeguards designed to protect your information. However, no
              internet transmission or electronic storage system is completely
              secure.
            </p>
            <p>
              Please do not submit sensitive personal information, medical
              records, protected health information, passwords, or financial
              credentials through general website forms.
            </p>

            <h2>6. Your choices and rights</h2>
            <p>
              Depending on applicable law, you may have the right to request
              access to, correction of, or deletion of your personal information.
            </p>
            <p>
              You may also opt out of certain marketing communications by
              following the unsubscribe instructions in those communications or
              contacting us.
            </p>
            <p>
              California residents may have additional privacy rights under
              applicable California law.
            </p>

            <h2>7. Healthcare information</h2>
            <p>
              Magis Labs works with organizations in areas including eldercare,
              aging, longevity, hospice, and healthcare.
            </p>
            <p>
              Our general website is not intended to collect patient records or
              protected health information. Please do not submit patient or
              medical information through general contact forms unless we
              specifically provide a secure method for doing so.
            </p>

            <h2>8. Children&apos;s privacy</h2>
            <p>
              Our website is not directed to children under 13, and we do not
              knowingly collect personal information from children under 13.
            </p>

            <h2>9. Changes to this policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be
              posted on this page with a revised effective date.
            </p>

            <h2>10. Contact us</h2>
            <p>
              If you have questions about this Privacy Policy, please contact us
              at{" "}
              <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>.
            </p>
            <p className="legal-doc__signoff">
              <strong>Magis Labs</strong>
              <Link to="/">themagislabs.com</Link>
            </p>
          </div>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
