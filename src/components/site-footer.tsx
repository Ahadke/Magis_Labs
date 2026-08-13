import { Link } from "@tanstack/react-router";
import { Linkedin, Mail } from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";

const EMAIL = "connect@themagislabs.com";
const LINKEDIN = "https://www.linkedin.com/showcase/the-magis-labs/";

const COLUMN_ONE_LINKS = [
  { label: "About", to: "/about" as const },
  { label: "Vision", to: "/" as const, hash: "vision" as const },
  { label: "Solutions", to: "/" as const, hash: "capabilities" as const },
] as const;

const COLUMN_TWO_LINKS = [
  { label: "Testimonials", to: "/our-work" as const },
  { label: "Plans", to: "/pricing" as const },
  { label: "Newsletter", to: "/contact" as const, hash: "newsletter" as const },
] as const;

const CONNECT_LINKS = [
  { label: "Contact", to: "/contact" as const },
  { label: "Careers", to: "/contact" as const, hash: "join" as const },
  { label: "Book a Call", to: "/contact" as const, hash: "book" as const },
] as const;

function FooterLinkList({
  links,
}: {
  links: readonly {
    label: string;
    to: "/" | "/about" | "/our-work" | "/pricing" | "/contact";
    hash?: "vision" | "focus" | "capabilities" | "newsletter" | "join" | "book";
  }[];
}) {
  return (
    <ul className="mt-3 space-y-2">
      {links.map((link) => (
        <li key={link.label}>
          <Link
            to={link.to}
            {...(link.hash ? { hash: link.hash } : {})}
            className="text-[14px] text-white/72 transition-colors hover:text-white"
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: readonly {
    label: string;
    to: "/" | "/about" | "/our-work" | "/pricing" | "/contact";
    hash?: "vision" | "focus" | "capabilities" | "newsletter" | "join" | "book";
  }[];
}) {
  return (
    <div>
      <p className="font-display text-[15px] font-medium tracking-[-0.01em] text-white/78">
        {title}
      </p>
      <FooterLinkList links={links} />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer relative bg-black text-white">
      <div className="mx-auto max-w-[1500px] px-6 py-10 md:px-10 md:py-12">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1.1fr)_1fr_1fr_1fr] lg:gap-8 xl:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <img
                src={logoBonsai}
                alt="Magis Labs"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="font-display text-[19px] font-bold tracking-tight">
                <span style={{ color: "#B86A9A" }}>Magis</span>
                <span className="text-white">Labs</span>
              </span>
            </Link>
            <p className="mt-3 max-w-[26ch] text-[13.5px] leading-[1.65] text-white/58">
              Storytelling, technology and growth for healthcare.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <a
                href={`mailto:${EMAIL}`}
                className="inline-flex items-center gap-1.5 text-[13px] text-white/72 transition-colors hover:text-white"
              >
                <Mail className="h-3.5 w-3.5 text-[#B86A9A]" />
                {EMAIL}
              </a>
              <a
                href={LINKEDIN}
                target="_blank"
                rel="noreferrer"
                aria-label="Magis Labs on LinkedIn"
                className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/14 text-white/72 transition-colors hover:border-white/28 hover:text-white"
              >
                <Linkedin className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <FooterColumn title="Explore" links={COLUMN_ONE_LINKS} />
          <FooterColumn title="Discover" links={COLUMN_TWO_LINKS} />
          <FooterColumn title="Connect" links={CONNECT_LINKS} />
        </div>

        <div className="site-footer__legal mt-8 border-t border-white/10 pt-5">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[11.5px] text-white/52">
              <span>© {new Date().getFullYear()} Magis Labs Co. All rights reserved.</span>
              <span aria-hidden className="hidden sm:inline text-white/22">
                ·
              </span>
              <Link
                to="/privacy"
                className="text-white/72 transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <span aria-hidden className="text-white/22">
                ·
              </span>
              <Link
                to="/terms"
                className="text-white/72 transition-colors hover:text-white"
              >
                Terms &amp; Conditions
              </Link>
            </div>
            <p className="font-display text-[12.5px] italic tracking-[0.02em] text-white/42">
              Built for better care
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
