import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Accent, PageHeroHeading, Reveal, SolidButton } from "@/components/site-kit";

export const Route = createFileRoute("/resources")({
  component: ResourcesPage,
  head: () => ({
    meta: [
      { title: "Resources — Coming Soon | Magis Labs" },
      {
        name: "description",
        content:
          "Healthcare research, editorial insights, and practical resources from Magis Labs — coming soon.",
      },
      { property: "og:title", content: "Resources — Magis Labs" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

function ResourcesPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />

      <section className="flex min-h-[60vh] items-center px-6 py-16 md:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal>
            <PageHeroHeading>
              Resources <Accent>Coming Soon</Accent>
            </PageHeroHeading>
            <p className="mx-auto mt-7 max-w-[42ch] text-[17px] leading-[1.75] text-black/55">
              We&apos;re building a library of healthcare growth insights,
              research, and practical guides. Check back soon — or subscribe on
              our contact page in the meantime.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <SolidButton to="/contact" hash="newsletter">
                Join Newsletter
              </SolidButton>
              <Link
                to="/"
                className="rounded-full border border-black/[0.1] px-6 py-3.5 text-[13px] font-semibold text-black/70 transition-colors hover:border-black/20 hover:text-black"
              >
                Back to Home
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
