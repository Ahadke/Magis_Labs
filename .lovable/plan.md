This is a large architectural change. Here's the plan before I start editing 1500+ lines.

## Navigation (sticky, transparent → glass on scroll)

Rebuild the top nav with these items only:
- Home (`/`)
- About (`/about`)
- Solutions ▼ (hover dropdown → AI, Marketing, Creative, Production, Digital Experiences — all anchor into `/solutions`)
- Resources ▼ (hover dropdown → Research, Blogs, Case Studies, Newsletter, FAQ — anchors into `/resources`)
- Pricing (`/pricing`)
- Contact (`/contact`)

Primary CTA pill: **Book an AI Strategy Call** → `/contact#calendly`.

Behavior: fully transparent over the hero, morphs into a white/blur glass bar after 24px scroll. Same nav renders on every route for consistency.

## Homepage (`/`) — one long editorial scroll

Rebuilt section order, replacing the current bento sprawl:

1. **Hero** — keep existing cinematic looping video + "Grow. Scale. *Innovate* with AI for Eldercare." with the two CTAs.
2. **Who We Help** — Industries (Assisted Living, Home Care, Hospice, Funeral Homes, Longevity) as an editorial list next to an interactive-feeling 3D globe (animated SVG globe with rotating meridians + pulsing location nodes; no heavy libs).
3. **Challenges We Solve** — pain points *before* solutions (stagnant occupancy, fragmented tech, invisible online, staffing strain, no data story). Editorial 2-col list, large serif numerals.
4. **Solutions** — AI, Marketing, Creative, Production, Digital Experiences. Five minimal cards, one line each, anchored so nav dropdown deep-links here.
5. **Why Magis Labs** — three pillars: Human-first AI, Boutique consulting, Long-term partnerships. Large type, minimal.
6. **Vision** — vertical roadmap timeline: Today → AI Consulting → Growth → Automation → AR & VR → Medical Education → Future Intelligent Healthcare. Animated dashed spine with pulsing nodes.
7. **Newsletter** — existing subscribe form, editorial layout.
8. **Contact** — Calendly embed link, WhatsApp, Email as three minimal tiles.
9. **Footer** — brand, nav, socials, legal line.

Removed from home: current AboutBento, IndustriesBento, ChallengesBento, AIServicesBento, MarketingBento, GrowthBento, ResultsBento, CommunityBento, FounderBento, FinalCTA. Their content is either promoted into the new sections above or moved to `/about` / `/solutions`.

## Other routes

- **`/about`** (exists) — trim to: Our Story, Mission, Approach, Partners. Reuse existing hero + origin sections; add a Partners strip.
- **`/solutions`** (new, single long page) — sections stacked by category with the same editorial rhythm: AI Consulting, Marketing, Creative, Production, Digital Experiences. Each section: large heading, short intent line, 3–4 capability bullets, one visual accent.
- **`/pricing`** (new, standalone) — three tiers (Advisory, Growth Partnership, Enterprise Engagement) as minimal cards on white, with a "Custom engagements" note and CTA to book a call.
- **`/contact`** (new, standalone) — Calendly link/embed, WhatsApp, Newsletter (reuses subscribe fn), Partnerships email.
- **`/resources`** (new, standalone) — anchored sections Research / Blogs / Case Studies / Newsletter / FAQ. Placeholder editorial cards + FAQ accordion; nav dropdown deep-links to anchors.

## Design system (unchanged tokens, tightened usage)

- White-first background across all routes.
- Cormorant display, Manrope body (already set).
- Brand colors preserved: Twilight `#9B4A80`, Manicure `#8C2860`, Forest `#3F5D4E`, Beige `#F6D9C4`, Dust pink `#E2C7D0`.
- Minimal card style: 1px `--border`, `rounded-3xl`, no heavy shadows. Kill remaining bento-lift heaviness.
- Animations: `animate-fade-up` on scroll section entry, existing `hero-cine`, new dashed-path draw for the Vision timeline, slow globe rotation.
- Consistent section rhythm: `py-28` desktop / `py-20` mobile, `max-w-[1400px]` container, editorial 12-col grid.

## Technical details

- New files: `src/routes/solutions.tsx`, `src/routes/pricing.tsx`, `src/routes/contact.tsx`, `src/routes/resources.tsx`. Each gets its own `head()` metadata (unique title/description/OG).
- Extract `Nav` and `Footer` into `src/components/site-nav.tsx` and `src/components/site-footer.tsx` so every route shares them.
- Rewrite `src/routes/index.tsx` to the new 9-section flow. Old bento components deleted from this file (some reused by `/solutions`).
- New components: `Globe3D` (animated SVG), `ChallengesList`, `SolutionsGrid`, `WhyList`, `VisionTimeline`, `ContactTiles`.
- Keep existing newsletter server function and MCP tool.
- Nav dropdowns: pure CSS hover + focus-within, no extra libs.
- Verify build after implementation.

## Out of scope for this turn

- Real Calendly embed script (link out instead — user can drop the embed later).
- Case study content (structural placeholders only).
- Blog CMS (placeholder cards).

Reply "go" and I'll implement. If you want a section reshuffled or Solutions/Resources merged, tell me now.