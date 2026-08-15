import { createFileRoute, Link } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUpRight, ChevronDown } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { AudienceArcCarousel, type AudienceArcItem } from "@/components/audience-arc-carousel";
import { Reveal } from "@/components/site-kit";
import heroClip02 from "@/assets/hero-clip-02.mp4";
import heroClip03 from "@/assets/hero-clip-03.mp4";
import heroClip04 from "@/assets/hero-clip-04.mp4";
import heroClip05 from "@/assets/hero-clip-05.mp4";
import heroClip06 from "@/assets/hero-clip-06.mp4";
import heroClip07 from "@/assets/hero-clip-07.mp4";
import heroClip08 from "@/assets/hero-clip-08.mp4";
import whoWeServe01 from "@/assets/who-we-serve-01.mp4";
import whoWeServe02 from "@/assets/who-we-serve-02.mp4";
import whoWeServe03 from "@/assets/who-we-serve-03.mp4";
import whoWeServe04 from "@/assets/who-we-serve-04.mp4";
import whoWeServe05 from "@/assets/who-we-serve-05.mp4";
import whoWeServe06 from "@/assets/who-we-serve-06.mp4";
import homeBandMicroscopy from "@/assets/home-band-microscopy.png";

export const Route = createFileRoute("/")({
  component: HomePage,
  head: () => ({
    meta: [
      { title: "Magis Labs — Healthcare Growth Partner" },
      {
        name: "description",
        content:
          "Magis Labs is an end-to-end healthcare growth partner. Branding, content, AI, marketing, and technology for clinics, care organizations, and healthtech.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const HERO_CLIPS = [
  heroClip04, // ambulance person walking — always first
  heroClip02,
  heroClip03,
  heroClip05,
  heroClip06,
  heroClip07,
  heroClip08,
] as const;

const CLIP_DURATION = 2.8;

const AUDIENCES: readonly AudienceArcItem[] = [
  {
    title: "Private & Specialty Practices",
    line: "Solo clinics to multi-site specialty groups.",
    media: { type: "video", src: whoWeServe01 },
    to: "/pricing",
    hash: "consulting",
  },
  {
    title: "Wellness & Longevity Clinics",
    line: "Preventive care and performance medicine.",
    media: { type: "video", src: whoWeServe02 },
    to: "/pricing",
    hash: "consulting",
  },
  {
    title: "Senior Living & Care Organizations",
    line: "Communities, campuses, and campus care.",
    media: { type: "video", src: whoWeServe03 },
    to: "/pricing",
    hash: "consulting",
  },
  {
    title: "Home Care & Hospice",
    line: "In-home support and end-of-life care.",
    media: { type: "video", src: whoWeServe04 },
    to: "/pricing",
    hash: "consulting",
  },
  {
    title: "Healthcare Technology & Startups",
    line: "Platforms, apps, and health innovation.",
    media: { type: "video", src: whoWeServe05 },
    to: "/pricing",
    hash: "ai",
  },
  {
    title: "Medical Devices & Digital Health",
    line: "Devices, diagnostics, and digital tools.",
    media: { type: "video", src: whoWeServe06 },
    to: "/pricing",
    hash: "ai",
  },
];

const SERVICE_PILLS = [
  "Video & AI Content Creation",
  "Growth Strategy & Marketing",
  "UI/UX & Brand Experience",
  "AI Integration & Automation",
  "AEO, GEO & SEO",
  "Drone & Facility Marketing",
  "Cinematic Video Production",
] as const;

function HomePage() {
  return (
    <div className="hp-page">
      <SiteNav />
      <Hero />
      <div className="hp-story-scroll">
        <div className="hp-mid-band" aria-hidden>
          <img
            src={homeBandMicroscopy}
            alt="Pink-stained microscopy of biological cells"
            className="hp-mid-band__img"
          />
        </div>
        <div className="hp-story-scroll__content">
          <WhyWeExist />
          <div className="hp-story-gap" aria-hidden />
          <WhoWeServe />
        </div>
      </div>
      <Vision />
      <CapabilitiesTeaser />
      <ClosingCta />
      <SiteFooter />
    </div>
  );
}

function StrategyCallButton({ className = "" }: { className?: string }) {
  return (
    <Link to="/contact" hash="book" className={`hp-cta-btn ${className}`}>
      Book an AI Strategy Call
    </Link>
  );
}

function SectionIndex({ value }: { value: string }) {
  return <span className="hp-index">{value}</span>;
}

/* ——— HERO ——— */

function HeroVideoSequence() {
  const refA = useRef<HTMLVideoElement>(null);
  const refB = useRef<HTMLVideoElement>(null);
  const [clipIndex, setClipIndex] = useState(0);
  const [activeLayer, setActiveLayer] = useState<"a" | "b">("a");
  const switchingRef = useRef(false);

  const getActiveRef = useCallback(() => (activeLayer === "a" ? refA : refB), [activeLayer]);
  const getInactiveRef = useCallback(() => (activeLayer === "a" ? refB : refA), [activeLayer]);

  useEffect(() => {
    const first = refA.current;
    const second = refB.current;
    if (!first) return;
    first.src = HERO_CLIPS[0];
    first.load();
    void first.play().catch(() => {});
    if (second) {
      second.removeAttribute("src");
      second.load();
    }
    setClipIndex(0);
    setActiveLayer("a");
  }, []);

  const advanceClip = useCallback(() => {
    if (switchingRef.current) return;
    switchingRef.current = true;
    const nextIndex = (clipIndex + 1) % HERO_CLIPS.length;
    const inactive = getInactiveRef().current;
    if (!inactive) {
      switchingRef.current = false;
      return;
    }
    inactive.src = HERO_CLIPS[nextIndex];
    const onReady = () => {
      void inactive.play().catch(() => {});
      setActiveLayer((l) => (l === "a" ? "b" : "a"));
      setClipIndex(nextIndex);
      switchingRef.current = false;
      inactive.removeEventListener("canplay", onReady);
    };
    inactive.addEventListener("canplay", onReady);
    inactive.load();
  }, [clipIndex, getInactiveRef]);

  useEffect(() => {
    const active = getActiveRef().current;
    if (!active) return;
    const onTimeUpdate = () => {
      if (active.currentTime >= CLIP_DURATION) advanceClip();
    };
    active.addEventListener("timeupdate", onTimeUpdate);
    return () => active.removeEventListener("timeupdate", onTimeUpdate);
  }, [activeLayer, advanceClip, getActiveRef]);

  return (
    <div className="hp-hero__video-stack" aria-hidden>
      <video
        ref={refA}
        src={HERO_CLIPS[0]}
        className={`hp-hero__video ${activeLayer === "a" ? "is-active" : ""}`}
        muted
        playsInline
        preload="auto"
      />
      <video
        ref={refB}
        className={`hp-hero__video ${activeLayer === "b" ? "is-active" : ""}`}
        muted
        playsInline
        preload="metadata"
      />
      <div className="hp-hero__vignette" />
    </div>
  );
}

function Hero() {
  return (
    <section className="hp-hero">
      <HeroVideoSequence />
      <div className="hp-hero__overlay" aria-hidden />
      <div className="hp-container hp-hero__content">
        <Reveal>
          <SectionIndex value="Magis Labs" />
          <h1 className="hp-hero__headline font-display">
            <span className="hp-hero__headline-line">Crafting the future of</span>
            <span className="hp-hero__headline-line">modern healthcare</span>
          </h1>
          <p className="hp-hero__subhead">
            Branding, content, AI, and growth for every kind of modern healthcare organization.
          </p>
          <StrategyCallButton className="hp-hero__cta" />
        </Reveal>
      </div>
      <a href="#why" className="hp-hero__scroll" aria-label="Scroll">
        <span className="hp-hero__scroll-line" />
        <ChevronDown className="hp-hero__scroll-icon" strokeWidth={1.5} />
      </a>
    </section>
  );
}

/* ——— WHY ——— */

function WhyWeExist() {
  return (
    <section id="why" className="hp-why">
      <div className="hp-container hp-why__inner">
        <Reveal>
          <SectionIndex value="01 — Why We Exist" />
          <h2 className="hp-why__title font-display">One partner for brand and growth.</h2>
          <p className="hp-why__statement">
            Magis Labs exists to help healthcare organizations grow without losing the care that
            made them matter. Healthcare professionals spend their careers improving lives.
            Somewhere along the way, marketing, technology, and digital experiences became a second
            job they never signed up for — a patchwork of freelancers, agencies, and software that
            don&apos;t talk to each other. We started Magis Labs to change that. One team across
            strategy, creative, and AI, so clinics, senior living, home care, and healthtech
            companies can build a brand people trust, reach the patients who need them, and scale
            toward the future of modern healthcare with the same care they bring to the people they
            treat.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ——— WHO WE SERVE ——— */

function WhoWeServe() {
  return (
    <section id="focus" className="hp-audience-section">
      <div className="hp-container">
        <Reveal>
          <SectionIndex value="02 — Who We Serve" />
          <h2 className="hp-audience-section__title font-display">
            Built for every corner of healthcare.
          </h2>
          <p className="hp-audience-section__intro">
            From private practices and longevity clinics to senior living, home care, and healthcare
            technology, we build brand, growth, and digital experiences around the work you already
            do.
          </p>
        </Reveal>
      </div>
      <AudienceArcCarousel items={AUDIENCES} />
    </section>
  );
}

/* ——— WHAT WE DO (TEASER) ——— */

function CapabilitiesTeaser() {
  const pills = [...SERVICE_PILLS, ...SERVICE_PILLS];

  return (
    <section id="capabilities" className="hp-capabilities">
      <div className="hp-container hp-capabilities__head">
        <Reveal>
          <SectionIndex value="04 — What We Do" />
          <h2 className="hp-capabilities__title font-display">What we do, end to end.</h2>
          <p className="hp-capabilities__intro">
            Magis Labs brings branding, cinematic content, performance marketing, and AI-powered
            technology into one practice. From the first film to the last automation, we build the
            systems that help healthcare organizations show up, get found, and keep growing.
          </p>
        </Reveal>
      </div>

      <div className="hp-marquee">
        <div className="hp-marquee__track">
          {pills.map((label, i) => (
            <span key={`${label}-${i}`} className="hp-marquee-pill">
              {label}
            </span>
          ))}
        </div>
      </div>

      <div className="hp-container hp-capabilities__foot">
        <Reveal>
          <Link to="/pricing" className="hp-cta-btn hp-capabilities__cta">
            See the full breakdown of what we offer
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}

/* ——— VISION ——— */

function Vision() {
  return (
    <section id="vision" className="hp-vision">
      <div className="hp-container hp-vision__inner">
        <Reveal>
          <SectionIndex value="03 — Vision" />
          <h2 className="hp-vision__title font-display">Our Vision</h2>
          <p className="hp-vision__text">
            We envision a future of modern healthcare where organizations build, innovate, and scale
            effortlessly. Where a clinic can adopt AI without hiring a technical team, where a
            founder can tell a complicated story in a way anyone understands, and where growth
            doesn&apos;t come at the cost of the care itself. From smarter clinics today to the
            digital tools that will define healthcare a decade from now, we want to be the partner
            that gets organizations there.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function ClosingCta() {
  return (
    <section className="hp-close">
      <div className="hp-close__bg" aria-hidden>
        <span className="hp-close__blob hp-close__blob--a" />
        <span className="hp-close__blob hp-close__blob--b" />
        <span className="hp-close__blob hp-close__blob--c" />
      </div>
      <div className="hp-container hp-close__inner">
        <Reveal>
          <p className="hp-close__copy font-display">Ready to grow your healthcare business?</p>
          <StrategyCallButton />
        </Reveal>
      </div>
    </section>
  );
}
