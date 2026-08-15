import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { z } from "zod";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { CalEmbed } from "@/components/cal-embed";
import {
  Accent,
  Reveal,
  NewsletterForm,
  PageHeroHeading,
  SectionHeading,
  ELDERBERRY,
  TWILIGHT,
} from "@/components/site-kit";
import {
  ArrowUpRight,
  Check,
  FileText,
  Linkedin,
  Mail,
  UploadCloud,
  X,
} from "lucide-react";
import logoBonsai from "@/assets/logo-bonsai-gradient-bg.png";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: "Contact — Where Great Partnerships Begin | Magis Labs" },
      {
        name: "description",
        content:
          "Book a strategy call, email us, or connect on LinkedIn. Subscribe for insights on healthcare AI, storytelling and growth — or apply to build with Magis Labs.",
      },
      { property: "og:title", content: "Where Great Partnerships Begin" },
      {
        property: "og:description",
        content:
          "Book a strategy call with Magis Labs, subscribe for healthcare AI insights, or apply to join the studio.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const EMAIL = "connect@themagislabs.com";
const RECRUITING = "hr@themagislabs.com";
const LINKEDIN = "https://www.linkedin.com/showcase/the-magis-labs/";

function ContactPage() {
  return (
    <div className="contact-page min-h-screen">
      <SiteNav />

      {/* 1 — HERO */}
      <section className="px-6 pt-[86px] md:px-10 md:pt-[112px]">
        <div className="mx-auto max-w-[1240px]">
          <Reveal>
            <PageHeroHeading className="max-w-[14ch]">
              Talk to our <Accent>Team</Accent>.
            </PageHeroHeading>
          </Reveal>
          <Reveal delay={90}>
            <p className="mt-7 max-w-[46ch] text-[17px] leading-[1.75] text-black/50">
              Tell us where you're headed and we'll take it from there.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 2 — BOOKING + CONTACT */}
      <section
        id="book"
        className="mt-2 scroll-mt-24 px-6 py-8 md:mt-3 md:px-10 md:py-10"
      >
        <div className="mx-auto grid max-w-[1320px] gap-4 lg:grid-cols-[1fr_340px]">
          <Reveal>
            <article className="grain-card flex h-full flex-col rounded-none p-3 md:p-4">
              <SectionHeading className="px-4 pb-0 pt-2 text-[1.8rem] md:text-[2.1rem]">
                Book a <Accent>Call</Accent>
              </SectionHeading>
              <div className="mt-2 rounded-none bg-white/85">
                <CalEmbed />
              </div>
            </article>
          </Reveal>

          <div className="grid content-start gap-4">
            <Reveal delay={80}>
              <SideCard
                icon={<Mail className="h-6 w-6" strokeWidth={1.5} />}
                circle={ELDERBERRY}
                title="Email"
                body={EMAIL}
                cta="Write to Us"
                href={`mailto:${EMAIL}`}
                accent={ELDERBERRY}
              />
            </Reveal>
            <Reveal delay={150}>
              <SideCard
                icon={<Linkedin className="h-6 w-6" strokeWidth={1.5} />}
                circle="#3f3f46"
                title="LinkedIn"
                body="Studio updates and new work."
                cta="Follow"
                href={LINKEDIN}
                external
                accent="#3f3f46"
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 — NEWSLETTER */}
      <section id="newsletter" className="scroll-mt-24 px-6 py-10 md:px-10 md:py-14">
        <div className="grain-card mx-auto w-full max-w-[1320px] rounded-none px-8 py-10 md:px-14 md:py-14">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between md:gap-12">
            <div className="min-w-0 flex-1 text-left md:max-w-[560px]">
              <Reveal>
                <SectionHeading>
                  Worth <Accent>Reading</Accent>.
                </SectionHeading>
                <p className="mt-5 max-w-[38ch] text-[16px] leading-[1.75] text-black/50">
                  Subscribe to Magis Labs for notes on healthcare, AI and the craft
                  of building.
                </p>
              </Reveal>
              <Reveal delay={90} className="mt-8">
                <NewsletterForm whiteSurface />
              </Reveal>
            </div>

            <Reveal delay={140} className="w-full shrink-0 md:w-auto md:max-w-[420px]">
              <PubCard
                href="https://magislabs.substack.com/subscribe"
                label="Magis Labs Newsletter"
                img={logoBonsai}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* 4 — CAREERS */}
      <section id="join" className="scroll-mt-24 px-6 py-10 md:px-10 md:py-14">
        <div className="grain-card mx-auto w-full max-w-[1320px] rounded-none px-8 py-10 md:px-14 md:py-14">
          <Reveal>
            <div className="max-w-2xl">
              <SectionHeading>
                Careers with <Accent>Magis Labs</Accent>.
              </SectionHeading>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-[1.75] text-black/50">
                Join the studio and help healthcare brands tell stories that
                build trust. Send your application to{" "}
                <a
                  href={`mailto:${RECRUITING}`}
                  className="font-medium text-[#8C2860] hover:underline"
                >
                  {RECRUITING}
                </a>
                .
              </p>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <div className="mt-9">
              <ApplicationForm />
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}


/* ------------------------------- Small bits ------------------------------- */

function PubCard({
  href,
  label,
  img,
}: {
  href: string;
  label: string;
  img: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="surface-card surface-card--lift group flex w-full max-w-[420px] items-center gap-4 rounded-none p-4"
    >
      <img
        src={img}
        alt="Magis Labs logo"
        loading="lazy"
        width={512}
        height={512}
        className="h-14 w-14 shrink-0 rounded-full object-cover"
      />
      <span className="flex min-w-0 flex-col gap-1">
        <span
          className="font-display text-[1.05rem] leading-tight tracking-[-0.02em]"
          style={{ color: ELDERBERRY }}
        >
          {label}
        </span>
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/40 transition-colors group-hover:text-black/70">
          Subscribe
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </span>
      </span>
    </a>
  );
}


function SideCard({
  icon,
  circle,
  title,
  body,
  cta,
  href,
  external,
  accent,
}: {
  icon: React.ReactNode;
  circle: string;
  title: string;
  body: string;
  cta: string;
  href: string;
  external?: boolean;
  accent: string;
}) {
  return (
    <article className="grain-card grain-card--lift flex h-full flex-col rounded-none p-7 md:p-8">
      <div className="flex items-center gap-4">
        <span
          className="inline-flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-white"
          style={{ background: circle, boxShadow: `0 22px 44px -24px ${circle}` }}
        >
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-display text-[1.5rem] leading-tight tracking-[-0.03em] text-black">
            {title}
          </h3>
          <p className="mt-1 truncate text-[14.5px] leading-[1.6] text-black/50">
            {body}
          </p>
        </div>
      </div>

      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
        className="group mt-6 inline-flex items-center justify-center gap-2 self-start rounded-none px-7 py-3.5 text-[13px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px]"
        style={{ background: accent, boxShadow: `0 20px 44px -26px ${accent}` }}
      >
        {cta}
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </article>
  );

}

/* ------------------------------ Application ------------------------------ */

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  linkedin: z.string().trim().max(300).optional().or(z.literal("")),
  portfolio: z.string().trim().max(300).optional().or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(20, "Tell us a little more — at least a couple of sentences.")
    .max(2000),
});

const FIELDS = [
  { name: "name", label: "Full Name", placeholder: "Jane Doe", type: "text", required: true },
  { name: "email", label: "Email Address", placeholder: "jane@email.com", type: "email", required: true },
  { name: "linkedin", label: "LinkedIn Profile", placeholder: "linkedin.com/in/…", type: "url", required: false },
  { name: "portfolio", label: "Portfolio Website", placeholder: "yourwork.com", type: "url", required: false },
] as const;

type FieldName = (typeof FIELDS)[number]["name"] | "message";

const inputClass =
  "mt-3 w-full rounded-none border border-black/[0.08] bg-white px-5 py-4 text-[15.5px] text-black outline-none transition-all duration-300 placeholder:text-black/25 focus:border-[#8C2860] focus:shadow-[0_0_0_4px_rgba(140,40,96,0.09)]";

const labelClass =
  "block text-[11px] font-semibold uppercase tracking-[0.24em] text-black/40";

function ApplicationForm() {
  const [values, setValues] = useState<Record<FieldName, string>>({
    name: "",
    email: "",
    linkedin: "",
    portfolio: "",
    message: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function set(field: FieldName, value: string) {
    setValues((v) => ({ ...v, [field]: value }));
  }

  function accept(f: File | undefined | null) {
    if (!f) return;
    if (f.type !== "application/pdf") {
      setError("Resumes must be a PDF file.");
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError("Please keep the PDF under 10MB.");
      return;
    }
    setError("");
    setFile(f);
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check the form.");
      return;
    }
    if (!file) {
      setError("Please upload your resume as a PDF.");
      return;
    }
    const d = parsed.data;
    const subject = `${d.name} | Application for Magis Labs`;
    const body = [
      `Applicant Name: ${d.name}`,
      `Email Address: ${d.email}`,
      `LinkedIn: ${d.linkedin || "—"}`,
      `Portfolio: ${d.portfolio || "—"}`,
      `Resume: ${file.name} (attached)`,
      "",
      "Why Magis Labs:",
      d.message,
    ].join("\n");
    window.location.href = `mailto:${RECRUITING}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setError("");
    setSent(true);
  }

  if (sent) {
    return (
      <div className="surface-card flex min-h-[320px] flex-col items-center justify-center rounded-none bg-white p-9 text-center md:p-14">
        <span
          className="inline-flex h-14 w-14 items-center justify-center rounded-full text-white"
          style={{ background: ELDERBERRY }}
        >
          <Check className="h-6 w-6" />
        </span>
        <h3 className="mt-6 font-display text-[2rem] leading-tight tracking-[-0.03em] text-black md:text-[2.4rem]">
          Application received.
        </h3>
        <p className="mt-3 max-w-[40ch] text-[15.5px] leading-[1.75] text-black/50">
          We'll be in touch if there's a fit.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="surface-card rounded-none bg-white p-7 md:p-12"
      noValidate
    >
      <div className="grid gap-6 sm:grid-cols-2">

        {FIELDS.map((f) => (
          <label key={f.name}>
            <span className={labelClass}>
              {f.label}
              {f.required ? (
                <span style={{ color: ELDERBERRY }}> *</span>
              ) : (
                <span className="text-black/25"> (optional)</span>
              )}
            </span>
            <input
              type={f.type}
              value={values[f.name]}
              onChange={(e) => set(f.name, e.target.value)}
              placeholder={f.placeholder}
              className={inputClass}
            />
          </label>
        ))}

        {/* Resume upload */}
        <div className="sm:col-span-2">
          <span className={labelClass}>
            Resume<span style={{ color: ELDERBERRY }}> *</span>
          </span>
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => accept(e.target.files?.[0])}
          />
          {file ? (
            <div
              className="mt-3 flex items-center gap-4 rounded-none px-5 py-4"
              style={{
                background: "rgba(140,40,96),0.06)",
                border: "1px solid rgba(140,40,96),0.20)",
              }}
            >
              <FileText
                className="h-5 w-5 shrink-0"
                style={{ color: ELDERBERRY }}
              />
              <span className="flex-1 truncate text-[15px] text-black/70">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="rounded-full p-1.5 text-black/40 transition-colors hover:bg-black/[0.05] hover:text-black/70"
                aria-label="Remove resume"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                accept(e.dataTransfer.files?.[0]);
              }}
              className="mt-3 flex w-full flex-col items-center justify-center rounded-none px-6 py-11 text-center transition-all duration-300"
              style={{
                border: `1.5px dashed ${dragging ? ELDERBERRY : "rgba(140,40,96),0.28)"}`,
                background: dragging
                  ? "rgba(140,40,96,0.05)"
                  : "rgba(140,40,96),0.025)",
              }}
            >
              <UploadCloud
                className="h-7 w-7"
                strokeWidth={1.4}
                style={{ color: TWILIGHT }}
              />
              <span className="mt-4 text-[15.5px] text-black/65">
                Drag & drop your resume, or{" "}
                <span style={{ color: ELDERBERRY }} className="font-semibold">
                  browse
                </span>
              </span>
              <span className="mt-1.5 text-[12.5px] tracking-wide text-black/35">
                PDF only · max 10MB
              </span>
            </button>
          )}
        </div>

        <label className="sm:col-span-2">
          <span className={labelClass}>
            Why would you like to work with Magis Labs?
            <span style={{ color: ELDERBERRY }}> *</span>
          </span>
          <textarea
            value={values.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            placeholder="Tell us what you'd build here."
            className={`${inputClass} resize-none leading-[1.7]`}
          />
        </label>
      </div>

      {error && <p className="mt-6 text-[13.5px] text-red-600">{error}</p>}

      <button
        type="submit"
        className="mt-10 inline-flex w-full items-center justify-center gap-2 rounded-none px-9 py-5 text-[14px] font-semibold tracking-wide text-white transition-all duration-500 hover:-translate-y-[2px]"
        style={{
          background: ELDERBERRY,
          boxShadow: "0 26px 56px -24px rgba(140,40,96,0.65)",
        }}
      >
        Submit Application
      </button>
    </form>
  );
}
