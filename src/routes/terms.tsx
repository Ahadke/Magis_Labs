import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { PageHeroHeading, Reveal } from "@/components/site-kit";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: "Terms & Conditions — Magis Labs" },
      {
        name: "description",
        content: "Terms and conditions for Magis Labs Co.",
      },
    ],
  }),
});

function TermsPage() {
  return (
    <div className="min-h-screen">
      <SiteNav />
      <main className="mx-auto max-w-[720px] px-6 pb-20 pt-32 md:px-8">
        <Reveal>
          <PageHeroHeading>Terms &amp; Conditions</PageHeroHeading>
        </Reveal>
        <Reveal>
          <p className="mt-6 text-[15px] leading-[1.75] text-black/60">
            This page will outline the terms governing use of Magis Labs services
            and website. For questions, contact{" "}
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
