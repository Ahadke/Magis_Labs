import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

const CONTACT_EMAIL = "connect@themagislabs.com";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Magis Labs" },
      {
        name: "description",
        content:
          "Terms and conditions governing use of the Magis Labs website and services.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="legal-doc">
        <Reveal>
          <PageHeroHeading>Terms &amp; Conditions</PageHeroHeading>
          <p className="legal-doc__lede">Effective date: August 14, 2026</p>
        </Reveal>
        <Reveal>
          <div>
            <p className="legal-doc__intro">
              This page is maintained by Magis Labs to answer common legal
              questions about our website and services. It is not legal advice and
              should be reviewed by your own counsel.
            </p>
            <p>
              Welcome to Magis Labs. These Terms and Conditions
              (&quot;Terms&quot;) govern your access to and use of the Magis Labs
              website and services. By using our website, you agree to these
              Terms. If you do not agree, please do not use the website.
            </p>

            <h2>1. Use of the website</h2>
            <p>
              You agree to use the website only for lawful purposes and in
              accordance with these Terms.
            </p>
            <p>You may not:</p>
            <ul>
              <li>Use the website for illegal, fraudulent, or harmful purposes</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Upload viruses, malware, or other harmful code</li>
              <li>
                Scrape, copy, or reproduce our content without authorization
              </li>
              <li>Interfere with the security or availability of the website</li>
              <li>Impersonate another person or organization</li>
            </ul>

            <h2>2. Our services</h2>
            <p>
              Magis Labs provides technology, artificial intelligence, creative,
              digital strategy, marketing, growth, and related consulting
              services.
            </p>
            <p>
              Information on this website is provided for general informational
              purposes. Specific services, pricing, deliverables, timelines, and
              other terms will be governed by the applicable agreement between
              Magis Labs and the client.
            </p>

            <h2>3. AI and technology</h2>
            <p>
              Our services may use artificial intelligence and automated
              technologies.
            </p>
            <p>
              AI-generated information may contain errors or inaccuracies and
              should be reviewed before being relied upon for important
              decisions.
            </p>
            <p>
              We do not guarantee that AI-generated outputs will always be
              accurate, complete, or suitable for a particular purpose.
            </p>

            <h2>4. Healthcare disclaimer</h2>
            <p>
              Magis Labs works with organizations in eldercare, aging, longevity,
              hospice, healthcare, and related industries.
            </p>
            <p>
              Nothing on this website constitutes medical advice, diagnosis,
              treatment, or emergency medical care.
            </p>
            <p>
              The website does not create a healthcare provider-patient
              relationship.
            </p>

            <h2>5. No guarantee of results</h2>
            <p>
              Examples, case studies, strategies, or potential outcomes described
              on this website do not guarantee future results.
            </p>
            <p>
              Business, marketing, technology, and AI outcomes depend on factors
              outside our control.
            </p>

            <h2>6. Intellectual property</h2>
            <p>
              The Magis Labs website, including its text, graphics, branding,
              logos, designs, images, software, and other content, is owned by
              Magis Labs or its licensors and is protected by applicable
              intellectual property laws.
            </p>
            <p>
              You may not reproduce, modify, distribute, or commercially use our
              content without permission.
            </p>

            <h2>7. Third-party services</h2>
            <p>
              Our website may contain links to or integrations with third-party
              websites and services.
            </p>
            <p>
              We do not control or take responsibility for third-party services,
              their content, security, or privacy practices.
            </p>

            <h2>8. Disclaimers</h2>
            <p>
              The website and its content are provided &quot;as is&quot; and
              &quot;as available.&quot;
            </p>
            <p>
              We do not guarantee that the website will always be uninterrupted,
              secure, accurate, or error-free.
            </p>

            <h2>9. Limitation of liability</h2>
            <p>
              To the fullest extent permitted by law, Magis Labs will not be
              liable for indirect, incidental, special, consequential, or punitive
              damages arising from your use of or inability to use the website or
              its content.
            </p>
            <p>
              Nothing in these Terms limits liability that cannot legally be
              limited.
            </p>

            <h2>10. Governing law</h2>
            <p>
              These Terms are governed by the laws of the State of California,
              without regard to its conflict-of-laws principles.
            </p>

            <h2>11. Changes to these Terms</h2>
            <p>
              We may update these Terms from time to time. Changes will be posted
              on this page with a revised effective date.
            </p>
            <p>
              Your continued use of the website after changes are posted means
              you accept the updated Terms to the extent permitted by law.
            </p>

            <h2>12. Contact us</h2>
            <p>
              If you have questions about these Terms, please contact us at{" "}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
