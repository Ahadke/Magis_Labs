import { createFileRoute, Link } from "@tanstack/react-router";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { Accent, LoopVideo, PageHeroHeading, SectionHeading } from "@/components/site-kit";
import pricingVideoProduction from "@/assets/pricing-video-production.mp4";
import growthMarketing from "@/assets/growth-marketing.png";
import solutionsConsulting from "@/assets/solutions-consulting.png";
import solutionsBranding from "@/assets/solutions-branding.png";
import designUiux from "@/assets/design-uiux.png";
import solutionsAiTech from "@/assets/solutions-ai-tech.png";
import aiAutomation from "@/assets/ai-automation.png";
import seoImg from "@/assets/what-we-do-seo.png";
import workCampus from "@/assets/work-campus-aerial.jpg";
import { PRICING_FAQS } from "@/data/pricing-faq";

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
  head: () => ({
    meta: [
      { title: "Pricing — Transparent Healthcare Growth Services | Magis Labs" },
      {
        name: "description",
        content:
          "Transparent pricing for healthcare video production, performance marketing, UI/UX design, AI automation and growth consulting.",
      },
      { property: "og:title", content: "Pricing — Magis Labs" },
      {
        property: "og:description",
        content:
          "Choose the service you need or book a strategy call for a tailored healthcare growth solution.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const TABS = [
  { id: "video", label: "Video & Content" },
  { id: "growth", label: "Growth & Marketing" },
  { id: "brand", label: "Brand & Digital" },
  { id: "ai", label: "AI & Technology" },
  { id: "consulting", label: "Strategy" },
  { id: "drone", label: "Drone" },
];

const VIDEO_CARDS = [
  {
    id: "launch-videos",
    featured: true,
    span3: true,
    name: "Launch Videos",
    price: "$10,000",
    description:
      "End-to-end launch storytelling for new products, services, clinics, and healthcare brands.",
    listLabel: "Includes",
    splitItems: true,
    items: [
      "Creative strategy",
      "Scripting",
      "Storyboarding",
      "Production",
      "Editing",
      "Motion graphics",
      "Multi-platform deliverables",
    ],
    cta: "Get a Quote",
  },
  {
    id: "explainer-videos",
    name: "Explainer & Product Demo Videos",
    price: "$1,500",
    description:
      "Turn complex healthcare products, services, and technology into clear, engaging stories.",
    listLabel: "Ideal for",
    items: [
      "Healthcare software",
      "AI products",
      "Medical devices",
      "Patient education",
      "New services",
    ],
    cta: "Get Started",
  },
  {
    id: "founder-stories",
    name: "Founder & Brand Stories",
    price: "$2,500",
    description:
      "Tell the story behind your company through interviews, storytelling, cinematic editing, and social-ready content.",
    listLabel: "Includes",
    items: [
      "Founder interview",
      "Story development",
      "Cinematic editing",
      "Social media versions",
    ],
  },
  {
    id: "testimonials",
    name: "Testimonials",
    price: "$500",
    unit: "/ video",
    listLabel: "Perfect for",
    items: [
      "Patient stories",
      "Customer success stories",
      "Team interviews",
      "Partner stories",
    ],
  },
  {
    id: "social-content",
    name: "Social Content & Video Editing",
    price: "$3,000",
    unit: "/ month",
    listLabel: "Includes",
    items: [
      "Editing",
      "Captions",
      "Motion graphics",
      "Content repurposing",
      "Platform optimization",
    ],
  },
  {
    id: "cinematic-films",
    name: "Cinematic Brand Films",
    price: "$5,000",
    description:
      "Premium films for healthcare brands, clinics, facilities, campaigns, and organizations.",
  },
  {
    id: "podcast",
    name: "Podcast Production",
    price: "$500",
    unit: "/ episode",
    listLabel: "Includes",
    items: [
      "Audio and video editing",
      "Captions",
      "Short-form content repurposing",
    ],
  },
];

type SearchItem = {
  id: string;
  title: string;
  section: string;
  keywords: string;
};

const SERVICE_SEARCH: SearchItem[] = [
  ...VIDEO_CARDS.map((card) => ({
    id: card.id,
    title: card.name,
    section: "Video & Content",
    keywords: [card.description, ...(card.items ?? []), "video film content production"].filter(Boolean).join(" "),
  })),
  {
    id: "growth-marketing",
    title: "Growth Marketing",
    section: "Growth & Marketing",
    keywords:
      "paid media ads advertising ppc facebook instagram google ads lead generation campaign conversion patient acquisition performance reporting",
  },
  {
    id: "seo-geo-aeo",
    title: "SEO, GEO & AEO",
    section: "Growth & Marketing",
    keywords:
      "search engine optimization google ranking organic local search visibility discovery answer engine generative engine content optimization healthcare seo",
  },
  {
    id: "branding",
    title: "Branding & Identity",
    section: "Brand & Digital",
    keywords:
      "brand identity logo visual identity messaging brand guidelines look and feel naming distinctive trusted healthcare brand",
  },
  {
    id: "uiux",
    title: "UI/UX & Website Design",
    section: "Brand & Digital",
    keywords:
      "website web design app interface ux strategy ui design responsive design systems prototypes conversion landing page",
  },
  {
    id: "ai-automation",
    title: "AI Automation",
    section: "AI & Technology",
    keywords:
      "automate workflows crm lead management communication newsletters chatbot assistants custom automations operations",
  },
  {
    id: "custom-ai",
    title: "Custom AI & Technology",
    section: "AI & Technology",
    keywords:
      "integrate ai intelligent workflows digital products emerging technology software custom build healthtech",
  },
  {
    id: "growth-consulting",
    title: "Healthcare Growth Consulting",
    section: "Strategy",
    keywords:
      "strategy advisory go-to-market growth planning product launches positioning content strategy technology adoption scale clinic",
  },
  {
    id: "drone-videography",
    title: "Drone Videography",
    section: "Drone",
    keywords:
      "aerial photography campus tours facility showcases promotional videos uav flyover real estate senior living wellness",
  },
];

const RELATED_GROUPS = [
  [
    "video",
    "videos",
    "film",
    "films",
    "filming",
    "cinematic",
    "editing",
    "edit",
    "content",
    "podcast",
    "testimonial",
    "testimonials",
    "explainer",
    "demo",
    "production",
    "story",
    "stories",
    "social",
    "reels",
    "shorts",
  ],
  [
    "seo",
    "search",
    "google",
    "organic",
    "ranking",
    "rankings",
    "geo",
    "aeo",
    "local",
    "visibility",
    "discovery",
  ],
  [
    "marketing",
    "ads",
    "advertising",
    "paid",
    "ppc",
    "growth",
    "leads",
    "acquisition",
    "campaign",
    "campaigns",
    "patients",
  ],
  [
    "brand",
    "branding",
    "identity",
    "logo",
    "logos",
    "messaging",
    "guidelines",
    "visual",
  ],
  [
    "website",
    "websites",
    "web",
    "ui",
    "ux",
    "uiux",
    "design",
    "prototype",
    "prototypes",
    "app",
    "interface",
  ],
  [
    "ai",
    "automation",
    "automate",
    "chatbot",
    "assistant",
    "assistants",
    "workflow",
    "workflows",
    "crm",
    "tech",
    "technology",
  ],
  [
    "consulting",
    "consultant",
    "strategy",
    "advisory",
    "advisor",
    "gtm",
    "planning",
    "positioning",
  ],
  [
    "drone",
    "drones",
    "aerial",
    "campus",
    "facility",
    "flyover",
    "uav",
    "photography",
  ],
];

function normalizeSearch(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function expandQuery(query: string) {
  const tokens = normalizeSearch(query).split(" ").filter(Boolean);
  const expanded = new Set(tokens);
  for (const token of tokens) {
    for (const group of RELATED_GROUPS) {
      if (group.some((term) => term === token || term.startsWith(token) || token.startsWith(term))) {
        for (const term of group) expanded.add(term);
      }
    }
  }
  return [...expanded];
}

function scoreSearchItem(item: SearchItem, query: string) {
  const normalizedQuery = normalizeSearch(query);
  if (!normalizedQuery) return 0;

  const title = normalizeSearch(item.title);
  const haystack = normalizeSearch(`${item.title} ${item.section} ${item.keywords}`);
  let score = 0;

  if (title.includes(normalizedQuery)) score += 90;
  if (title.startsWith(normalizedQuery)) score += 40;
  if (haystack.includes(normalizedQuery)) score += 55;

  for (const term of expandQuery(query)) {
    if (haystack.includes(term)) score += term === normalizedQuery ? 14 : 7;
  }

  return score;
}

function scrollToSearchTarget(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  el.classList.add("pp-card--search-hit");
  window.setTimeout(() => el.classList.remove("pp-card--search-hit"), 1800);
}

function SolutionsSearch() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];
    return SERVICE_SEARCH.map((item) => ({ item, score: scoreSearchItem(item, trimmed) }))
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
      .slice(0, 8)
      .map((entry) => entry.item);
  }, [query]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const goTo = (id: string) => {
    scrollToSearchTarget(id);
    setOpen(false);
  };

  return (
    <div className="pp-search" ref={rootRef}>
      <Search className="pp-search__icon" aria-hidden />
      <input
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(event) => {
          if (event.key === "Escape") {
            setOpen(false);
            event.currentTarget.blur();
            return;
          }
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((index) => Math.min(index + 1, Math.max(results.length - 1, 0)));
            return;
          }
          if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((index) => Math.max(index - 1, 0));
            return;
          }
          if (event.key === "Enter" && results[activeIndex]) {
            event.preventDefault();
            goTo(results[activeIndex].id);
          }
        }}
        placeholder="Search solutions"
        aria-label="Search solutions"
        autoComplete="off"
        spellCheck={false}
      />
      {query ? (
        <button
          type="button"
          className="pp-search__clear"
          aria-label="Clear search"
          onClick={() => {
            setQuery("");
            setOpen(false);
          }}
        >
          <X />
        </button>
      ) : null}
      {open && query.trim() ? (
        <div className="pp-search__results" role="listbox">
          {results.length === 0 ? (
            <p className="pp-search__empty">No matching solutions</p>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="option"
                aria-selected={index === activeIndex}
                className={`pp-search__result ${index === activeIndex ? "is-active" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => goTo(item.id)}
              >
                <span className="pp-search__result-title">{item.title}</span>
                <span className="pp-search__result-section">{item.section}</span>
              </button>
            ))
          )}
        </div>
      ) : null}
    </div>
  );
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <div className="pp-section-head">
      <SectionHeading as="h2" className="pp-serif text-[clamp(32px,4vw,52px)]">
        {children}
      </SectionHeading>
    </div>
  );
}

function PricingPage() {
  const [activeTab, setActiveTab] = useState("video");
  const tabsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sectionIds = TABS.map((t) => t.id);
    const subnavOffset = 132;

    const updateActiveTab = () => {
      let active = sectionIds[0];

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= subnavOffset) {
          active = id;
        }
      }

      setActiveTab(active);
    };

    updateActiveTab();
    window.addEventListener("scroll", updateActiveTab, { passive: true });
    window.addEventListener("resize", updateActiveTab);

    return () => {
      window.removeEventListener("scroll", updateActiveTab);
      window.removeEventListener("resize", updateActiveTab);
    };
  }, []);

  useEffect(() => {
    const tabs = tabsRef.current;
    if (!tabs) return;
    const activeButton = tabs.querySelector<HTMLButtonElement>(".pp-tab.is-active");
    activeButton?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeTab]);

  return (
    <div className="pp-page min-h-screen">
      <SiteNav />

      <nav className="pp-subnav" aria-label="Pricing sections">
        <div className="pp-subnav__inner">
          <div className="pp-tabs" ref={tabsRef}>
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`pp-tab ${activeTab === tab.id ? "is-active" : ""}`}
                onClick={() => {
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <SolutionsSearch />
        </div>
      </nav>

      <header className="pp-hero">
        <PageHeroHeading className="pp-serif mx-auto max-w-[16ch] text-center">
          Choose the right <Accent>plan</Accent> for you
        </PageHeroHeading>
        <p>
          <span className="pp-hero-line">
            Flexible solutions for healthcare businesses, clinics, and startups at
            every stage of growth.
          </span>
          <span className="pp-hero-line">
            Choose a service or talk with us about a custom engagement.
          </span>
        </p>
      </header>

      <section className="pp-section" id="video">
        <SectionTitle>
          Video & <Accent>Content</Accent>
        </SectionTitle>
        <div className="pp-grid">
          <div className="pp-bento-video">
            <LoopVideo
              src={pricingVideoProduction}
              className="h-full w-full object-cover"
            />
          </div>
          <PricingCard {...VIDEO_CARDS[0]} />
          <PricingCard {...VIDEO_CARDS[1]} />
          {VIDEO_CARDS.slice(2).map((card) => (
            <PricingCard key={card.name} {...card} />
          ))}
        </div>
      </section>

      <div className="pp-divider" />

      <section className="pp-section pp-section--stacked">
        <div className="pp-service-group" id="growth">
          <SectionTitle>
            Growth & <Accent>Marketing</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              id="growth-marketing"
              name="Growth Marketing"
              price="$5,000"
              unit="/ month"
              image={growthMarketing}
              imageAlt="Marketing team analyzing performance data and campaign charts"
              imagePosition="right"
              imageCrop="bottom"
              description="Build a scalable patient or customer acquisition engine."
              listLabel="Includes"
              items={[
                "Paid media",
                "Lead generation",
                "Campaign strategy",
                "Conversion optimization",
                "Performance reporting",
              ]}
              cta="Book a Strategy Call"
            />
            <PricingCard
              full
              id="seo-geo-aeo"
              name="SEO, GEO & AEO"
              price="$2,500"
              unit="/ month"
              image={seoImg}
              imageAlt="Search analytics and optimization dashboard"
              imagePosition="left"
              description="Increase your visibility across traditional search, local search, and AI-powered discovery."
              listLabel="Includes"
              items={[
                "Healthcare SEO",
                "Local search optimization",
                "AEO & GEO strategy",
                "Content optimization",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="brand">
          <SectionTitle>
            Brand & Digital <Accent>Experience</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              id="branding"
              name="Branding & Identity"
              price="$5,000"
              image={solutionsBranding}
              imageAlt="Healthcare professional in clinical setting"
              imagePosition="left"
              imageCrop="face"
              description="Build a distinctive, trusted healthcare brand with strategy, visual identity, messaging, and brand guidelines."
              cta="Get a Quote"
            />
            <PricingCard
              full
              id="uiux"
              name="UI/UX & Website Design"
              price="$10,000"
              image={designUiux}
              imageAlt="Designer reviewing UI layouts and visual references on a laptop"
              imagePosition="right"
              listLabel="Includes"
              items={[
                "UX strategy",
                "UI design",
                "Responsive experiences",
                "Design systems",
                "Prototypes",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="ai">
          <SectionTitle>
            AI & <Accent>Technology</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              id="ai-automation"
              name="AI Automation"
              price="$5,000"
              image={aiAutomation}
              imageAlt="Person using a smartphone for automated business workflows"
              imagePosition="right"
              imageCrop="bottom"
              description="Automate repetitive workflows and build smarter healthcare operations."
              listLabel="Solutions can include"
              items={[
                "CRM automation",
                "Lead management",
                "Communication workflows",
                "Newsletters",
                "AI assistants",
                "Custom automations",
              ]}
              cta="Get a Quote"
            />
            <PricingCard
              full
              id="custom-ai"
              name="Custom AI & Technology"
              price="Custom"
              image={solutionsAiTech}
              imageAlt="Human hand reaching toward robotic hand"
              imagePosition="left"
              description="For healthcare businesses and startups looking to integrate AI, intelligent workflows, digital products, or emerging technologies into their operations."
              cta="Talk to Us"
            />
          </div>
        </div>

        <div className="pp-service-group" id="consulting">
          <SectionTitle>
            Strategy & <Accent>Consulting</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              id="growth-consulting"
              name="Healthcare Growth Consulting"
              price="$5,000"
              image={solutionsConsulting}
              imageAlt="Medical clinic exterior sign at night"
              imagePosition="left"
              imageFocus="left"
              description="Strategic support for clinics, healthcare businesses, and founders looking to launch, grow, or scale."
              listLabel="Services can include"
              items={[
                "Go-to-market strategy",
                "Growth planning",
                "Product launches",
                "Positioning",
                "Content strategy",
                "Technology adoption",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>

        <div className="pp-service-group" id="drone">
          <SectionTitle>
            Drone & Facility <Accent>Marketing</Accent>
          </SectionTitle>
          <div className="pp-grid">
            <PricingCard
              full
              id="drone-videography"
              name="Drone Videography"
              price="$2,500"
              image={workCampus}
              imageAlt="Aerial view of a healthcare campus"
              imagePosition="right"
              description="Cinematic aerial content for clinics, healthcare campuses, senior living communities, wellness facilities, and healthcare real estate."
              listLabel="Includes"
              items={[
                "Facility showcases",
                "Campus tours",
                "Aerial photography",
                "Promotional videos",
              ]}
              cta="Get a Quote"
            />
          </div>
        </div>
      </section>

      <section className="pp-section pp-discovery">
        <div className="grain-card pp-discovery__panel">
          <div className="pp-discovery__copy">
            <SectionHeading as="h2" className="pp-serif text-[clamp(28px,3.5vw,44px)]">
              Building Something <Accent>Bigger</Accent>?
            </SectionHeading>
            <p>
              From launching a clinic to scaling a healthcare startup, integrating
              AI, or creating a complete digital growth system, we build solutions
              around your goals.
            </p>
          </div>
          <Link to="/contact" hash="book" className="pp-btn pp-btn-primary pp-discovery__cta">
            Book a Discovery Call
            <ArrowIcon />
          </Link>
        </div>
      </section>

      <section className="pp-section" id="faq">
        <FaqList
          items={PRICING_FAQS}
          heading={
            <SectionHeading as="h2" className="pp-serif text-[clamp(32px,4vw,52px)]">
              Frequently Asked <Accent>Questions</Accent>
            </SectionHeading>
          }
        />
      </section>

      <SiteFooter />
    </div>
  );
}

type CardProps = {
  id?: string;
  featured?: boolean;
  span3?: boolean;
  span4?: boolean;
  full?: boolean;
  compact?: boolean;
  tag?: string;
  name: string;
  price: string;
  unit?: string;
  subtitle?: string;
  description?: string;
  listLabel?: string;
  items?: string[];
  splitItems?: boolean;
  cta?: string;
  image?: string;
  imageAlt?: string;
  imagePosition?: "left" | "right";
  imageCrop?: "top" | "bottom" | "face";
  imageFocus?: "left" | "right";
  imageZoom?: "out" | "soft";
};

function PricingCard({
  id,
  featured,
  span3,
  span4,
  full,
  compact,
  tag,
  name,
  price,
  unit,
  subtitle,
  description,
  listLabel,
  items,
  splitItems,
  cta,
  image,
  imageAlt = "",
  imagePosition = "left",
  imageCrop,
  imageFocus,
  imageZoom,
}: CardProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const card = ref.current;
    if (!card) return;

    const revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            card.classList.add("pp-in");
            revealObserver.unobserve(card);
          }
        }
      },
      { threshold: 0.12 },
    );
    revealObserver.observe(card);
    return () => revealObserver.disconnect();
  }, []);

  const listItems = items ?? [];
  const splitAt = Math.ceil(listItems.length / 2);

  const content = (
    <>
      {tag && <span className="pp-card-tag">{tag}</span>}
      <div className="pp-card-name pp-serif">{name}</div>

      {subtitle && <p className="pp-card-subtitle">{subtitle}</p>}

      <div className="pp-card-price-row">
        <span className="pp-card-label">Starting at</span>
        <span className="pp-card-price">{price}</span>
        {unit && <span className="pp-card-unit">{unit}</span>}
      </div>

      {description && <p className="pp-card-desc">{description}</p>}

      {listItems.length > 0 && listLabel && (
        <>
          <p className="pp-list-label">{listLabel}</p>
          {splitItems ? (
            <div className="pp-list-columns">
              <ul className="pp-list">
                {listItems.slice(0, splitAt).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <ul className="pp-list">
                {listItems.slice(splitAt).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : (
            <ul className="pp-list">
              {listItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
        </>
      )}

      {cta && (
        <Link to="/contact" hash="book" className="pp-card-cta">
          {cta}
          <ArrowIcon />
        </Link>
      )}
    </>
  );

  return (
    <article
      ref={ref}
      id={id}
      className={[
        "pp-card",
        span3 ? "pp-span-3" : "",
        span4 ? "pp-span-4" : "",
        full ? "pp-full" : "",
        compact ? "pp-card--compact" : "",
        featured ? "pp-featured" : "",
        image ? "pp-card--with-image" : "",
        image && imagePosition === "right" ? "pp-card--image-right" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ scrollMarginTop: 140 }}
    >
      {image && (
        <div
          className={[
            "pp-card-media",
            imageCrop === "top" ? "pp-card-media--crop-top" : "",
            imageCrop === "bottom" ? "pp-card-media--crop-bottom" : "",
            imageCrop === "face" ? "pp-card-media--crop-face" : "",
            imageFocus === "right" ? "pp-card-media--focus-right" : "",
            imageFocus === "left" ? "pp-card-media--focus-left" : "",
            imageZoom === "out" ? "pp-card-media--zoom-out" : "",
            imageZoom === "soft" ? "pp-card-media--zoom-out pp-card-media--zoom-soft" : "",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <img src={image} alt={imageAlt} loading="lazy" />
        </div>
      )}

      {image ? <div className="pp-card-body">{content}</div> : content}
    </article>
  );
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FaqList({
  items,
  heading,
}: {
  items: { q: string; a: string }[];
  heading: ReactNode;
}) {
  const [openIndices, setOpenIndices] = useState<Set<number>>(() => new Set());
  const allOpen = openIndices.size === items.length && items.length > 0;

  const toggleOne = (index: number) => {
    setOpenIndices((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const toggleAll = () => {
    setOpenIndices(allOpen ? new Set() : new Set(items.map((_, index) => index)));
  };

  return (
    <div>
      <div className="pp-faq-head">
        {heading}
        <button type="button" className="pp-faq-expand-all" onClick={toggleAll}>
          {allOpen ? "Collapse all" : "Expand all"}
        </button>
      </div>
      {items.map((item, i) => (
        <FaqItem
          key={item.q}
          q={item.q}
          a={item.a}
          open={openIndices.has(i)}
          onToggle={() => toggleOne(i)}
        />
      ))}
    </div>
  );
}

function FaqItem({
  q,
  a,
  open,
  onToggle,
}: {
  q: string;
  a: string;
  open: boolean;
  onToggle: () => void;
}) {
  const answerRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (answerRef.current) {
      setHeight(open ? answerRef.current.scrollHeight : 0);
    }
  }, [open, a]);

  return (
    <div className={`pp-faq-item ${open ? "is-open" : ""}`}>
      <button type="button" className="pp-faq-q" aria-expanded={open} onClick={onToggle}>
        <span className="pp-faq-q-text">{q}</span>
        <span className="pp-faq-icon" />
      </button>
      <div ref={answerRef} className="pp-faq-a" style={{ maxHeight: height }}>
        <p>{a}</p>
      </div>
    </div>
  );
}
