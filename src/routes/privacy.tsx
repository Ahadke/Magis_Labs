import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: "Privacy Policy — Magis Labs" },
      {
        name: "description",
        content: "Privacy policy for Magis Labs Co.",
      },
    ],
  }),
});

function PrivacyPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[720px] px-6 pb-20 pt-32 md:px-8">
        <Reveal>
          <PageHeroHeading>Privacy Policy</PageHeroHeading>
        </Reveal>
        <Reveal>
          <p className="mt-6 text-[15px] leading-[1.75] text-black/60">
            This page will outline how Magis Labs collects, uses, and protects
            your information. For questions, contact{" "}
            <a
              href="mailto:connect@themagislabs.com"
              className="text-[#8C2860] hover:underline"
            >
              connect@themagislabs.com
            </a>
            .
          </p>
        </Reveal>
      </main>
      <SiteFooter />
    </div>
  );
}
