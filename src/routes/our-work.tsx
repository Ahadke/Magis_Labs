import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import {
  Accent,
  Eyebrow,
  Reveal,
} from "@/components/site-kit";
import webRandeepImg from "@/assets/work-web-randeep-wadhawan.png";
import webNikhilImg from "@/assets/work-web-nikhil-mahajan.png";
import webSpanishImg from "@/assets/work-web-spanish-center-dubai.png";
import webEnvisionImg from "@/assets/work-web-envision-lasik.png";

export const Route = createFileRoute("/our-work")({
  component: OurWorkPage,
  head: () => ({
    meta: [
      { title: "Our Work - Testimonials & Client Stories | Magis Labs" },
      {
        name: "description",
        content:
          "Client testimonials and proven results from healthcare clinics, practices, and organizations we've helped grow.",
      },
      { property: "og:title", content: "Our Work - Magis Labs" },
      {
        property: "og:description",
        content:
          "Case studies in Instagram growth, clinic websites and client reviews from Magis Labs.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const HERO_STATS = [
  { value: "20+", label: "Clients helped" },
  { value: "+48%", label: "Avg follower growth" },
  { value: "1.9×", label: "Avg engagement lift" },
  { value: "4.7/5", label: "Client rating" },
] as const;

const IG_CASES = [
  {
    initials: "SH",
    name: "Smile Hair Clinic",
    field: "Istanbul, Türkiye · Hair transplant",
    followers: "820K",
    posts: "787",
    engagement: "1.8%",
    growthFrom: "718K",
    growthTo: "820K",
    growthPeriod: "6 months",
    growthPct: "+14%",
    quote:
      "At our size, big jumps aren't realistic. Steady growth, cleaner visuals, and fewer random posts - that's what we wanted.",
  },
  {
    initials: "SC",
    name: "Spanish Center Dubai",
    field: "Dubai, UAE · Laser eye & cosmetic",
    followers: "54K",
    posts: "1,781",
    engagement: "2.4%",
    growthFrom: "41K",
    growthTo: "54K",
    growthPeriod: "8 months",
    growthPct: "+32%",
    quote:
      "Our feed used to feel scattered. Now patients save posts and message us with specific questions - the front desk notices it.",
  },
  {
    initials: "NG",
    name: "Dr Neil Galletly",
    field: "Dubai, UAE · Gastroenterologist & Hepatologist",
    followers: "8.1K",
    posts: "462",
    engagement: "2.1%",
    growthFrom: "4.2K",
    growthTo: "8.1K",
    growthPeriod: "5 months",
    growthPct: "+93%",
    quote:
      "We started getting DMs from patients who'd already watched a few Reels before they booked. That wasn't happening six months ago.",
  },
  {
    initials: "KD",
    name: "Dr Kavya Dendukuri",
    field: "Gastroenterologist & Hepatologist",
    followers: "66K",
    posts: "359",
    engagement: "3.1%",
    growthFrom: "54K",
    growthTo: "66K",
    growthPeriod: "4 months",
    growthPct: "+22%",
    quote:
      "The content finally sounds like me in clinic - plain language, no jargon. My team doesn't have to rewrite captions anymore.",
  },
  {
    initials: "NM",
    name: "Dr Nikhil Mahajan",
    field: "Gastroenterologist & Liver Doctor",
    followers: "22K",
    posts: "121",
    engagement: "2.6%",
    growthFrom: "15K",
    growthTo: "22K",
    growthPeriod: "7 months",
    growthPct: "+47%",
    quote:
      "People mention specific posts when they call. Small thing, but it tells me they're actually reading before they visit.",
  },
] as const;

const WEB_CASES = [
  {
    url: "spanishcenterdubai.com",
    image: webSpanishImg,
    tag: "Website · Multi-clinic site",
    name: "Spanish Center Dubai",
    field: "Laser eye, cosmetic & wellness · Dubai",
    quote:
      "One site now serves every department instead of five outdated microsites.",
    metrics: [
      { value: "+95%", label: "WhatsApp inquiry clicks" },
      { value: "4.9/5", label: "Client rating" },
      { value: "8 wks", label: "Build time" },
    ],
  },
  {
    url: "randeepwadhawan.com",
    image: webRandeepImg,
    tag: "Website · Specialist rebrand",
    name: "Dr Randeep Wadhawan",
    field: "GI, Bariatric & Metabolic Surgeon · New Delhi",
    quote:
      "The new site explains robotic surgery in plain language - patients come in already reassured.",
    metrics: [
      { value: "+170%", label: "Consult form submits" },
      { value: "2.8×", label: "Time on site" },
      { value: "6 wks", label: "Build time" },
    ],
  },
  {
    url: "drnikhilmahajan.getmy.clinic",
    image: webNikhilImg,
    tag: "Website · Clinic booking site",
    name: "Dr Nikhil Mahajan",
    field: "Gastroenterologist & Liver Doctor · Jammu",
    quote:
      "Online bookings replaced most of our phone-tag scheduling within the first month.",
    metrics: [
      { value: "+140%", label: "Appointment bookings" },
      { value: "-38%", label: "Bounce rate" },
      { value: "5 wks", label: "Build time" },
    ],
  },
  {
    url: "envisionlasikcentre.com",
    image: webEnvisionImg,
    tag: "Website · New build",
    name: "Envision LASIK Centre",
    field: "Laser vision correction · Hyderabad",
    quote:
      "We went from a static brochure page to a site that pre-qualifies patients before they call.",
    metrics: [
      { value: "+210%", label: "Consultation requests" },
      { value: "3.4×", label: "Pages per visit" },
      { value: "5 wks", label: "Build time" },
    ],
  },
] as const;

type IgCase = (typeof IG_CASES)[number];

function ringOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  const half = total / 2;
  if (diff > half) diff -= total;
  if (diff < -half) diff += total;
  return diff;
}

function IgCard({
  item,
  offset,
  onSelect,
}: {
  item: IgCase;
  offset: -1 | 0 | 1;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const slotClass =
    offset === 0 ? "is-center" : offset === -1 ? "is-left" : "is-right";

  return (
    <article
      className={`ow-ig-card ow-case-card grain-card grain-card--lift ow-ig-carousel-card ${slotClass}`}
      onClick={isActive ? undefined : onSelect}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
      }
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : `View ${item.name}`}
      aria-hidden={false}
    >
      <div className="ow-ig-top">
        <div className="ow-ig-head">
          <div className="ow-ig-avatar">
            <span>{item.initials}</span>
          </div>
          <div className="ow-ig-id">
            <div className="ow-ig-name">{item.name}</div>
            <div className="ow-ig-field">{item.field}</div>
          </div>
        </div>
      </div>
      <div className="ow-ig-metrics">
        <div>
          <strong>{item.followers}</strong>
          <span>Followers</span>
        </div>
        <div>
          <strong>{item.posts}</strong>
          <span>Posts</span>
        </div>
        <div>
          <strong>{item.engagement}</strong>
          <span>Engagement</span>
        </div>
      </div>
      <div className="ow-ig-growth">
        <div className="ow-ig-growth-row">
          <div className="ow-ig-growth-nums">
            {item.growthFrom} → <b>{item.growthTo}</b> in {item.growthPeriod}
          </div>
          <div className="ow-ig-growth-pill">{item.growthPct}</div>
        </div>
      </div>
      <div className="ow-ig-quote">
        <p>&ldquo;{item.quote}&rdquo;</p>
      </div>
    </article>
  );
}

type WebCase = (typeof WEB_CASES)[number];

function WebCard({
  item,
  offset,
  onSelect,
}: {
  item: WebCase;
  offset: -1 | 0 | 1;
  onSelect: () => void;
}) {
  const isActive = offset === 0;
  const slotClass =
    offset === 0 ? "is-center" : offset === -1 ? "is-left" : "is-right";

  return (
    <article
      className={`ow-web-card ow-case-card grain-card grain-card--lift ow-web-carousel-card ${slotClass}`}
      onClick={isActive ? undefined : onSelect}
      onKeyDown={
        isActive
          ? undefined
          : (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelect();
              }
            }
      }
      role={isActive ? undefined : "button"}
      tabIndex={isActive ? -1 : 0}
      aria-label={isActive ? undefined : `View ${item.name}`}
      aria-hidden={false}
    >
      <div className="ow-browser-bar">
        <span className="ow-dot" />
        <span className="ow-dot" />
        <span className="ow-dot" />
        <div className="ow-addr">{item.url}</div>
      </div>
      <img
        className="ow-web-photo"
        src={item.image}
        alt={`${item.name} website homepage`}
        loading="lazy"
      />
      <div className="ow-web-body">
        <div className="ow-web-tag">{item.tag}</div>
        <div className="ow-web-name">{item.name}</div>
        <div className="ow-web-field">{item.field}</div>
        <p className="ow-web-quote">&ldquo;{item.quote}&rdquo;</p>
        <div className="ow-web-metrics">
          {item.metrics.map((m) => (
            <div key={m.label}>
              <strong>{m.value}</strong>
              <span>{m.label}</span>
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function WebCarousel({
  items,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: {
  items: readonly WebCase[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="ow-web-carousel">
      <div className="ow-web-carousel-shell">
        <button
          type="button"
          className="ow-web-carousel-side-btn"
          aria-label="Previous website case"
          onClick={onPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="ow-web-carousel-stage" aria-live="polite">
          {items.map((item, index) => {
            const offset = ringOffset(index, activeIndex, items.length);
            if (offset < -1 || offset > 1) return null;
            return (
              <WebCard
                key={item.url}
                item={item}
                offset={offset as -1 | 0 | 1}
                onSelect={() => onSelect(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="ow-web-carousel-side-btn"
          aria-label="Next website case"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="ow-web-carousel-dots" role="tablist" aria-label="Website case studies">
        {items.map((item, index) => (
          <button
            key={item.url}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={item.name}
            className={`ow-web-carousel-dot${index === activeIndex ? " is-active" : ""}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}

function IgCarousel({
  items,
  activeIndex,
  onPrev,
  onNext,
  onSelect,
}: {
  items: readonly IgCase[];
  activeIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="ow-ig-carousel">
      <div className="ow-ig-carousel-shell">
        <button
          type="button"
          className="ow-ig-carousel-side-btn"
          aria-label="Previous Instagram case"
          onClick={onPrev}
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <div className="ow-ig-carousel-stage" aria-live="polite">
          {items.map((item, index) => {
            const offset = ringOffset(index, activeIndex, items.length);
            if (offset < -1 || offset > 1) return null;
            return (
              <IgCard
                key={item.name}
                item={item}
                offset={offset as -1 | 0 | 1}
                onSelect={() => onSelect(index)}
              />
            );
          })}
        </div>

        <button
          type="button"
          className="ow-ig-carousel-side-btn"
          aria-label="Next Instagram case"
          onClick={onNext}
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
      <div className="ow-ig-carousel-dots" role="tablist" aria-label="Instagram case studies">
        {items.map((item, index) => (
          <button
            key={item.name}
            type="button"
            role="tab"
            aria-selected={index === activeIndex}
            aria-label={item.name}
            className={`ow-ig-carousel-dot${index === activeIndex ? " is-active" : ""}`}
            onClick={() => onSelect(index)}
          />
        ))}
      </div>
    </div>
  );
}

function OurWorkPage() {
  const [igActive, setIgActive] = useState(0);
  const [webActive, setWebActive] = useState(0);

  const igPrev = () =>
    setIgActive((i) => (i - 1 + IG_CASES.length) % IG_CASES.length);
  const igNext = () => setIgActive((i) => (i + 1) % IG_CASES.length);
  const webPrev = () =>
    setWebActive((i) => (i - 1 + WEB_CASES.length) % WEB_CASES.length);
  const webNext = () => setWebActive((i) => (i + 1) % WEB_CASES.length);

  return (
    <div className="ow-page min-h-screen">
      <SiteNav />

      <section className="ow-page-head">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <Reveal>
            <h1>
              Testimonials & <Accent>client work</Accent>.
            </h1>
          </Reveal>
        </div>
      </section>

      <div className="ow-stats-band">
        <div className="ow-stats-band-track">
          {[...HERO_STATS, ...HERO_STATS].map((stat, i) => (
            <div key={`${stat.label}-${i}`} className="ow-stats-band-item">
              <span className="ow-stats-band-value">{stat.value}</span>
              <span className="ow-stats-band-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <section className="ow-section" id="instagram">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <div className="ow-carousel-head">
            <div className="ow-section-head">
              <Reveal>
                <Eyebrow>Testimonials</Eyebrow>
              </Reveal>
              <Reveal>
                <h2>
                  Feeds that now <Accent>convert</Accent>, not just scroll.
                </h2>
              </Reveal>
              <Reveal>
                <p className="ow-section-desc">
                  Before-and-after follower counts and engagement rate for five
                  medical & aesthetic accounts we manage the visual identity for.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <IgCarousel
          items={IG_CASES}
          activeIndex={igActive}
          onPrev={igPrev}
          onNext={igNext}
          onSelect={setIgActive}
        />
      </section>

      <section className="ow-section" id="websites">
        <div className="mx-auto max-w-[1260px] px-6 md:px-8">
          <div className="ow-carousel-head">
            <div className="ow-section-head">
              <Reveal>
                <Eyebrow>Clients</Eyebrow>
              </Reveal>
              <Reveal>
                <h2>
                  Sites that <Accent>answer</Accent> before the phone even rings.
                </h2>
              </Reveal>
              <Reveal>
                <p className="ow-section-desc">
                  Consultation and inquiry lift for four clinic and specialist
                  websites we designed and built.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        <WebCarousel
          items={WEB_CASES}
          activeIndex={webActive}
          onPrev={webPrev}
          onNext={webNext}
          onSelect={setWebActive}
        />
      </section>

      <section className="ow-cta" id="cta">
        <div className="ow-cta-content">
          <Reveal>
            <h2>
              Your practice deserves
              <br />a proof stack like this.
            </h2>
          </Reveal>
          <Reveal>
            <p>
              Tell us where things stand - we&apos;ll show you what a launch could look
              like, with the numbers to back it.
            </p>
          </Reveal>
          <Reveal delay={110}>
            <div className="ow-cta-actions">
              <Link to="/contact" hash="book" className="ow-cta-btn">
                Start a project
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
