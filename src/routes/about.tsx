import { createFileRoute } from "@tanstack/react-router";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { LoopVideo, Reveal } from "@/components/site-kit";
import aboutTopVideo from "@/assets/about-top-video.mp4";
import topPortrait from "@/assets/about-top-portrait.png";
import topVideoPoster from "@/assets/about-top-portrait.png";
import valueImage01 from "@/assets/about-value-01.png";
import valueImage02 from "@/assets/about-value-02.png";
import valueImage03 from "@/assets/about-value-03.png";
import futureVideo from "@/assets/about-future-video.mp4";
import midVideo from "@/assets/about-mid-video.mp4";

export const Route = createFileRoute("/about")({
  component: AboutPage,
  head: () => ({
    meta: [
      { title: "About — Magis Labs" },
      {
        name: "description",
        content:
          "Magis Labs pairs strategy, design, and applied AI to help healthcare businesses look as good as the work they do, and grow because of it.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const PROCESS_STAGES = [
  {
    num: "01",
    title: "Story",
    body: "Find the plain-language version of what you do, even when the science isn't simple.",
  },
  {
    num: "02",
    title: "Design",
    body: "Turn that story into a brand and a website people actually trust on sight.",
  },
  {
    num: "03",
    title: "Technology",
    body: "Wire in the AI and automation that make the experience run, not just look good.",
  },
  {
    num: "04",
    title: "Growth",
    body: "Put it in front of the right people, consistently, not just once at launch.",
  },
] as const;

const VALUES = [
  {
    num: "01",
    title: "Earn the trust first.",
    body: "Healthcare decisions are high-stakes. We design and market like someone's choosing a provider for a parent, not clicking add to cart.",
    image: valueImage01,
  },
  {
    num: "02",
    title: "Translate, don't dumb down.",
    body: "Complex care and complex technology stay accurate. We just make them legible to the people who need to understand them.",
    image: valueImage02,
  },
  {
    num: "03",
    title: "Stay in it after launch.",
    body: "A campaign that stops the day it ships isn't a system. We build things that keep working, and keep showing up, months later.",
    image: valueImage03,
  },
] as const;

function AboutDivider() {
  return <div className="pp-divider" aria-hidden />;
}

function AboutTopMedia() {
  return (
    <section className="ab-top-media" aria-label="About Magis Labs media">
      <div className="ab-top-media__row">
        <Reveal className="ab-top-media__video-wrap">
          <LoopVideo
            src={aboutTopVideo}
            poster={topVideoPoster}
            className="ab-top-media__video ab-ken-burns"
          />
          <div className="ab-top-media__grain" aria-hidden />
        </Reveal>

        <Reveal delay={120} className="ab-top-media__image-wrap">
          <img
            src={topPortrait}
            alt=""
            loading="eager"
            className="ab-top-media__image"
          />
          <div className="ab-top-media__grain" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}

function AboutIntro() {
  return (
    <section className="ab-intro">
      <div className="ab-section-shell ab-container">
        <p className="ab-eyebrow ab-section-shell__eyebrow">About Magis Labs</p>
        <div className="ab-section-shell__editorial">
          <Reveal>
            <h1 className="ab-section-headline font-display">
              <span className="ab-section-headline__lead">Great care</span> deserves
              a story worth telling.
            </h1>
            <p className="ab-intro__lead">
              Magis Labs pairs strategy, design, and applied AI to help healthcare
              businesses look as good as the work they do, and grow because of it.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutWhy() {
  return (
    <section id="why-started" className="ab-why">
      <div className="ab-section-shell ab-container">
        <p className="ab-eyebrow ab-section-shell__eyebrow">Why We Started</p>

        <div className="ab-section-shell__editorial">
          <div className="ab-why__split">
            <div className="ab-why__copy">
              <Reveal>
                <h2 className="ab-section-headline font-display">
                  The best clinics don&apos;t always look like it online.
                </h2>
              </Reveal>

              <Reveal delay={100}>
                <div className="ab-why__body">
                  <p>
                    Most healthcare marketing was built for retail or SaaS, not for
                    the way people actually choose a doctor, a clinic, or a care
                    facility. The result: strong practices with weak websites,
                    complex products no one can explain, and founders doing marketing
                    themselves between patient visits.
                  </p>
                  <p>
                    Magis Labs exists to close that gap. We combine storytelling,
                    design, and AI into one team instead of three vendors, so
                    healthcare businesses can look, sound, and operate like the
                    leaders they already are.
                  </p>
                </div>
              </Reveal>
            </div>

            <Reveal delay={80} className="ab-why__video-wrap">
              <LoopVideo src={midVideo} className="ab-why__video" />
              <div className="ab-why__video-grain" aria-hidden />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutProcess() {
  return (
    <section id="how-we-work" className="ab-process">
      <div className="ab-container ab-process__head">
        <Reveal>
          <p className="ab-eyebrow">How We Work</p>
          <h2 className="ab-process__title font-display">From story to system.</h2>
          <p className="ab-process__lead">
            One team across creative, technology, and growth, so nothing gets
            lost in translation between departments.
          </p>
        </Reveal>
      </div>

      <div className="ab-process__grid ab-container">
        {PROCESS_STAGES.map((stage) => (
          <article key={stage.num} className="ab-process__card ab-grain-surface">
            <span className="ab-process__num">{stage.num}</span>
            <h3 className="ab-process__stage-title font-display">{stage.title}</h3>
            <p className="ab-process__stage-body">{stage.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function AboutValues() {
  return (
    <section id="values" className="ab-values">
      <div className="ab-container ab-values__inner">
        <Reveal>
          <h2 className="ab-values__headline font-display">Our Values</h2>
        </Reveal>

        <div className="ab-values__list">
          {VALUES.map((value) => (
            <article key={value.num} className="ab-values__column">
              <img
                src={value.image}
                alt=""
                loading="lazy"
                className="ab-values__image"
              />
              <div className="ab-values__card ab-grain-surface">
                <span className="ab-values__num">{value.num}</span>
                <h3 className="ab-values__title font-display">{value.title}</h3>
                <p className="ab-values__body">{value.body}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function AboutFuture() {
  return (
    <section id="journey" className="ab-future">
      <div className="ab-container ab-future__grid">
        <Reveal className="ab-future__copy">
          <p className="ab-eyebrow">Where We&apos;re Going</p>
          <h2 className="ab-future__headline font-display">
            Better care, and a better life around it.
          </h2>
          <p className="ab-future__lead">
            We&apos;re building Magis Labs for a future where families find the
            right care faster, providers communicate with clarity, and
            technology quietly supports a healthier day-to-day — not gets in the
            way of it.
          </p>
        </Reveal>

        <Reveal delay={80} className="ab-future__video-wrap">
          <LoopVideo
            src={futureVideo}
            className="ab-future__video ab-ken-burns"
          />
          <div className="ab-future__video-grain" aria-hidden />
        </Reveal>
      </div>
    </section>
  );
}

function AboutPage() {
  return (
    <div className="ab-page">
      <SiteNav />
      <AboutTopMedia />
      <AboutIntro />
      <AboutDivider />
      <AboutWhy />
      <AboutDivider />
      <AboutProcess />
      <AboutValues />
      <AboutFuture />
      <SiteFooter />
    </div>
  );
}
