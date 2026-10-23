"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import Image from "next/image";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import Hero from "@/components/Hero";

// Strategy-call link from the previous page, minus its stale ?month=2025-12 param.
const CALENDLY_URL =
  "https://calendly.com/info-2p0/15-min-roundtable-discussion";
// TODO: swap for the lead form once decided; Calendly is the interim destination.
const APPLY_URL = CALENDLY_URL;
const LEAF_IMAGE = "/media/2026/cannabis-leaves.jpg";
const OVERVIEW_IMAGE = "/media/2026/collective.jpg";
const OVERVIEW_ASPECT = "aspect-[8.5/11]";

interface Challenge {
  title: string;
  description: string;
  paths: string[];
}

interface Step {
  title: string;
  description: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface ReceiveBlock {
  title: string;
  description: string;
  items: string[];
}

interface CollectiveGrowContent {
  intro: string[];
  introEmphasis: string;
  whyExists: {
    eyebrow: string;
    intro: string;
    closing: string;
    challenges: Challenge[];
  };
  approach: { eyebrow: string; title: string; body: string[] };
  receive: { individual: ReceiveBlock; collective: ReceiveBlock };
  collaboration: {
    eyebrow: string;
    intro: string;
    benefits: string[];
    closing: string;
    closingEmphasis: string;
  };
  whoFor: { intro: string; lead: string; participants: string[] };
  experience: { eyebrow: string; steps: Step[] };
  whyMatters: { lead: string; belief: string; body: string };
  faqs: Faq[];
  finalCta: { title: string; subtitle: string; body: string };
}

const content: CollectiveGrowContent = {
  intro: [
    "A collaborative public relations and education initiative designed to help cannabis brands increase visibility, educate consumers, and build trust through shared storytelling.",
    "The cannabis industry faces unique challenges. Advertising restrictions, evolving regulations, limited media opportunities, and widespread misinformation make it difficult for even the strongest brands to tell their stories.",
  ],
  introEmphasis: "Collective Grow was created to change that.",
  whyExists: {
    eyebrow: "Stronger together than alone.",
    intro:
      "Cannabis businesses aren’t just competing for customers, they’re navigating an industry with barriers that most businesses never face.",
    closing:
      "Rather than tackling these challenges independently, Collective Grow creates opportunities that benefit everyone involved.",
    challenges: [
      {
        title: "Marketing Restrictions",
        description:
          "Advertising limitations make it difficult to reach new audiences.",
        paths: [
          "M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z",
          "m4.9 4.9 14.2 14.2",
        ],
      },
      {
        title: "Limited Earned Media",
        description:
          "Many traditional media outlets remain hesitant to cover cannabis businesses.",
        paths: [
          "M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2",
          "M18 14h-8",
          "M15 18h-5",
          "M10 6h8v4h-8V6Z",
        ],
      },
      {
        title: "Consumer Education",
        description:
          "Misconceptions and misinformation continue to create barriers to trust.",
        paths: [
          "M12 2a10 10 0 1 0 0 20 10 10 0 1 0 0-20z",
          "M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3",
          "M12 17h.01",
        ],
      },
      {
        title: "Regulatory Complexity",
        description:
          "Constantly changing regulations require thoughtful, compliant communications.",
        paths: [
          "m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
          "m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z",
          "M7 21h10",
          "M12 3v18",
          "M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2",
        ],
      },
      {
        title: "Platform Limitations",
        description:
          "Social media restrictions can reduce visibility overnight.",
        paths: [
          "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
        ],
      },
    ],
  },
  approach: {
    eyebrow: "Individual brands. Collective impact.",
    title: "A Different Approach to Cannabis Communications",
    body: [
      "Collective Grow combines customized public relations support with collaborative industry campaigns.",
      "Every participating brand receives strategic communications tailored to its own business while also benefiting from co-branded initiatives that educate consumers and elevate the industry.",
      "This means greater visibility, stronger credibility, and opportunities that would be difficult to achieve independently.",
    ],
  },
  receive: {
    individual: {
      title: "Individual Brand Support",
      description:
        "Every participating organization receives customized communications support designed around its specific goals.",
      items: [
        "Strategic public relations planning",
        "Customized messaging",
        "Press releases and media outreach",
        "Educational storytelling",
        "Local and regional media opportunities",
        "Consumer education campaigns",
      ],
    },
    collective: {
      title: "Collective Visibility",
      description:
        "Together, participating brands gain access to larger initiatives that expand awareness across the industry.",
      items: [
        "Shared public relations campaigns",
        "Co-branded educational initiatives",
        "Industry-wide media opportunities",
        "Collaborative thought leadership",
        "Community education campaigns",
        "Shared promotional opportunities",
      ],
    },
  },
  collaboration: {
    eyebrow: "The power of collective storytelling.",
    intro:
      "When responsible cannabis businesses work together, everyone benefits.",
    benefits: [
      "Consumers receive better education.",
      "Communities gain greater understanding.",
      "Businesses build strong credibility.",
      "The industry moves forward together.",
    ],
    closing: "Collective Grow isn’t about replacing your individual brand.",
    closingEmphasis: "It’s about strengthening it through collaboration.",
  },
  whoFor: {
    intro:
      "Collective Grow was built for organizations committed to responsible growth and consumer education.",
    lead: "Ideal participants include:",
    participants: [
      "Dispensaries",
      "Cannabis brands",
      "Infused product manufacturers",
      "Delivery services",
      "Cannabis technology companies",
      "Ancillary businesses",
      "Industry organizations",
    ],
  },
  experience: {
    eyebrow: "What participation looks like.",
    steps: [
      {
        title: "Discover",
        description:
          "Meet with our team to discuss your goals and determine whether Collective Grow is the right fit.",
      },
      {
        title: "Build",
        description:
          "Develop your individual communications strategy while preparing for collaborative campaigns.",
      },
      {
        title: "Activate",
        description:
          "Launch customized PR initiatives alongside shared educational campaigns designed to expand industry visibility.",
      },
      {
        title: "Grow",
        description:
          "Measure results, strengthen your reputation, and continue building momentum through ongoing collaboration.",
      },
    ],
  },
  whyMatters: {
    lead: "Collective Grow was created with a simple belief:",
    belief:
      "The future of the cannabis industry depends on education, transparency, and collaboration.",
    body: "By investing in shared communications efforts, participating brands aren’t simply promoting themselves. They’re helping shape public understanding and strengthen the industry for everyone.",
  },
  faqs: [
    {
      question: "Is Collective Grow only for dispensaries?",
      answer:
        "No. The program welcomes dispensaries, cannabis brands, infused product manufacturers, ancillary businesses, technology companies, and other organizations supporting the cannabis industry.",
    },
    {
      question: "How is Collective Grow different from hiring a PR agency?",
      answer:
        "Every participating organization receives individualized communications support while also benefiting from collaborative campaigns that increase visibility and strengthen the broader cannabis industry.",
    },
    {
      question: "Is everything compliant?",
      answer:
        "Yes. Communications strategies are developed with regulatory considerations in mind and prioritize education, transparency, and responsible messaging.",
    },
    {
      question: "How long does the program last?",
      answer:
        "Collective Grow operates as a nine-month collaborative initiative designed to create sustained visibility and measurable impact.",
    },
  ],
  finalCta: {
    title: "Join the Collective",
    subtitle: "Help shape the future of cannabis communications.",
    body: "Whether you’re looking to increase visibility, educate consumers, strengthen your reputation, or become part of a larger movement, Collective Grow was built to help responsible cannabis brands grow together.",
  },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: content.faqs.map(({ question, answer }) => ({
    "@type": "Question",
    name: question,
    acceptedAnswer: { "@type": "Answer", text: answer },
  })),
};

const NAVY_GRADIENT = "bg-[linear-gradient(135deg,#021f2e_0%,#0a3a52_100%)]";
const CTA_PRIMARY =
  "inline-block rounded-lg bg-gold px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03] active:scale-[0.98]";
const CTA_OUTLINE_DARK =
  "inline-block rounded-lg border border-navy/30 px-8 py-4 text-base font-bold text-navy transition-all duration-200 hover:border-navy hover:bg-navy/5 active:scale-[0.98]";
const CTA_OUTLINE_LIGHT =
  "inline-block rounded-lg border border-white/30 px-8 py-4 text-base font-bold text-white transition-all duration-200 hover:border-white/70 hover:bg-white/10 active:scale-[0.98]";

function ImageLightbox({
  src,
  alt,
  onClose,
}: {
  src: string;
  alt: string;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    const onKey = (event: { key: string }) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Collective Grow program overview"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close overview"
        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl font-bold text-navy shadow-lg transition-transform hover:scale-110"
      >
        ×
      </button>
      <motion.div
        className="max-h-[90vh] w-[min(92vw,900px)] overflow-y-auto rounded-xl bg-white shadow-2xl"
        initial={{ scale: 0.96, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.96, opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={`relative w-full ${OVERVIEW_ASPECT}`}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes="(max-width: 900px) 92vw, 900px"
            className="object-contain"
          />
        </div>
      </motion.div>OVERVIEW_IMAGE
    </motion.div>
  );
}

function ProgramOverview() {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  const alt =
    "One-page overview of The Collective Grow: why it exists, what brands gain, who it is built for, and next steps.";

  return (
    <div className="mt-20 grid items-center gap-10 md:grid-cols-[0.8fr_1.2fr]">
      <Reveal>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="View the full program overview"
          className="group relative block w-full overflow-hidden rounded-2xl border border-gold/30 bg-white shadow-lg transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-2xl"
        >
          <div className={`relative w-full ${OVERVIEW_ASPECT}`}>
            <Image
              src={OVERVIEW_IMAGE}
              alt={alt}
              fill
              loading="eager"
              // sizes="(max-width: 768px) 100vw, 40vw"
              className="object-contain"
            />
          </div>
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-navy/90 py-3 text-sm font-bold text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            Click to enlarge
          </span>
        </button>
      </Reveal>

      <Reveal delay={0.1}>
        <p className="text-sm font-semibold uppercase tracking-wider text-[#075E8B]">
          Take it with you
        </p>
        <h2 className="mt-2 font-heading text-2xl font-bold text-navy md:text-3xl">
          The Program at a Glance
        </h2>
        <div
          className="mt-4 h-1 w-16 rounded-full bg-gold"
          aria-hidden="true"
        />
        <p className="mt-6 max-w-xl leading-relaxed text-body">
          A one-page summary of how Collective Grow works: why it exists, what
          brands gain, who it&rsquo;s built for, and what to do next.
        </p>
        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className={CTA_PRIMARY}
          >
            View full overview
          </button>
          <a
            href={OVERVIEW_IMAGE}
            target="_blank"
            rel="noopener noreferrer"
            className={CTA_OUTLINE_DARK}
          >
            Open image in new tab
          </a>
        </div>
      </Reveal>

      <AnimatePresence>
        {open && (
          <ImageLightbox src={OVERVIEW_IMAGE} alt={alt} onClose={close} />
        )}
      </AnimatePresence>
    </div>
  );
}

function StrokeIcon({
  paths,
  className = "h-6 w-6",
}: {
  paths: string[];
  className?: string;
}) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d) => (
        <path key={d} d={d} />
      ))}
    </svg>
  );
}

function CheckIcon({ className = "h-5 w-5" }: { className?: string }) {
  return <StrokeIcon paths={["M5 13l4 4L19 7"]} className={className} />;
}

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  light = false,
}: {
  eyebrow?: string;
  title: string;
  light?: boolean;
}) {
  return (
    <Reveal>
      {eyebrow && (
        <p
          className={`text-sm font-semibold uppercase tracking-wider ${light ? "text-gold" : "text-[#075E8B]"}`}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={`mt-2 font-heading text-2xl font-bold md:text-3xl ${light ? "text-white" : "text-navy"}`}
      >
        {title}
      </h2>
      <div className="mt-4 h-1 w-16 rounded-full bg-gold" aria-hidden="true" />
    </Reveal>
  );
}

function ChallengeCard({
  challenge,
  index,
}: {
  challenge: Challenge;
  index: number;
}) {
  return (
    <Reveal delay={index * 0.08} className="h-full">
      <div className="group h-full rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:-translate-y-2 hover:border-gold hover:shadow-xl">
        <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/15 text-gold transition-colors duration-300 group-hover:bg-gold group-hover:text-[#021f2e]">
          <StrokeIcon paths={challenge.paths} className="h-6 w-6" />
        </span>
        <h3 className="mt-4 font-heading text-lg font-bold text-navy">
          {challenge.title}
        </h3>
        <p className="mt-2 leading-relaxed text-body">
          {challenge.description}
        </p>
      </div>
    </Reveal>
  );
}

function ApproachVisual() {
  return (
    <div className="flex items-center justify-center py-4" aria-hidden="true">
      <div className="flex h-44 w-44 items-center justify-center rounded-full border-2 border-gold/50 bg-gold/10 text-center font-heading text-sm font-bold text-navy transition-transform duration-300 hover:scale-105 sm:h-52 sm:w-52">
        Individual
        <br />
        brands
      </div>
      <div className="-ml-10 flex h-44 w-44 items-center justify-center rounded-full border-2 border-navy/40 bg-navy/10 text-center font-heading text-sm font-bold text-navy transition-transform duration-300 hover:scale-105 sm:h-52 sm:w-52">
        Collective
        <br />
        impact
      </div>
    </div>
  );
}

type ReceiveKey = "individual" | "collective";

function ReceiveTabs({ blocks }: { blocks: Record<ReceiveKey, ReceiveBlock> }) {
  const [active, setActive] = useState<ReceiveKey>("individual");
  const keys: ReceiveKey[] = ["individual", "collective"];
  const block = blocks[active];

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
      setActive((current) =>
        current === "individual" ? "collective" : "individual",
      );
    }
  };

  return (
    <div className="mt-8">
      <div
        role="tablist"
        aria-label="What you'll receive"
        onKeyDown={onKeyDown}
        className="inline-flex rounded-xl bg-gray-100 p-1"
      >
        {keys.map((key) => (
          <button
            key={key}
            id={`receive-tab-${key}`}
            role="tab"
            type="button"
            aria-selected={active === key}
            aria-controls="receive-panel"
            tabIndex={active === key ? 0 : -1}
            onClick={() => setActive(key)}
            className={`rounded-lg px-5 py-3 text-sm font-bold transition-all duration-200 sm:px-6 ${
              active === key
                ? "bg-navy text-white shadow-md"
                : "text-navy hover:bg-white"
            }`}
          >
            {blocks[key].title}
          </button>
        ))}
      </div>

      <div
        id="receive-panel"
        role="tabpanel"
        aria-labelledby={`receive-tab-${active}`}
        className="mt-6 rounded-2xl border border-gold/20 bg-[#f8f6f0] p-6 md:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="max-w-2xl leading-relaxed text-body">
              {block.description}
            </p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2">
              {block.items.map((item, index) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="flex items-start gap-3 rounded-xl bg-white p-4 text-body shadow-sm"
                >
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gold text-[#021f2e]">
                    <CheckIcon className="h-4 w-4" />
                  </span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function CollectiveNetwork({
  nodes,
  active,
  onActive,
}: {
  nodes: string[];
  active: number | null;
  onActive: (index: number | null) => void;
}) {
  const cx = 320;
  const cy = 210;
  const rx = 190;
  const ry = 135;
  const round = (value: number) => Math.round(value * 10) / 10;

  const points = nodes.map((label, index) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / nodes.length;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const anchor: "start" | "middle" | "end" =
      cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
    return {
      label,
      anchor,
      x: round(cx + rx * cos),
      y: round(cy + ry * sin),
      lx: round(cx + (rx + 22) * cos),
      ly: round(cy + (ry + 22) * sin + 4),
    };
  });

  return (
    <svg
      viewBox="0 0 640 420"
      className="h-auto w-full"
      role="img"
      aria-label="Participating organization types connected through Collective Grow"
    >
      {points.map((point, index) => (
        <line
          key={`line-${point.label}`}
          x1={cx}
          y1={cy}
          x2={point.x}
          y2={point.y}
          strokeWidth={active === index ? 3 : 1.5}
          className={`transition-all duration-300 ${active === index ? "stroke-gold" : "stroke-gray-300"}`}
        />
      ))}
      <circle cx={cx} cy={cy} r={50} className="fill-navy" />
      <text
        x={cx}
        y={cy - 2}
        textAnchor="middle"
        className="fill-white text-[15px] font-bold"
      >
        Collective
      </text>
      <text
        x={cx}
        y={cy + 16}
        textAnchor="middle"
        className="fill-gold text-[15px] font-bold"
      >
        Grow
      </text>
      {points.map((point, index) => (
        <g
          key={point.label}
          onMouseEnter={() => onActive(index)}
          onMouseLeave={() => onActive(null)}
          className="cursor-pointer"
        >
          <circle
            cx={point.x}
            cy={point.y}
            r={active === index ? 14 : 10}
            strokeWidth={2.5}
            className={`transition-all duration-300 ${
              active === index
                ? "fill-gold stroke-gold"
                : "fill-white stroke-navy"
            }`}
          />
          <text
            x={point.lx}
            y={point.ly}
            textAnchor={point.anchor}
            className={`text-[14px] transition-all duration-300 ${
              active === index ? "fill-navy font-bold" : "fill-navy font-medium"
            }`}
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
}

function WhoFor({ data }: { data: CollectiveGrowContent["whoFor"] }) {
  const [active, setActive] = useState<number | null>(null);

  return (
    <div className="mt-16 grid items-center gap-10 md:grid-cols-[1fr_1.1fr]">
      <div>
        <SectionHeading title="Who It's For" />
        <p className="mt-6 leading-relaxed text-body">{data.intro}</p>
        <p className="mt-6 font-semibold text-navy">{data.lead}</p>
        <ul className="mt-4 flex flex-wrap gap-3">
          {data.participants.map((participant, index) => (
            <li
              key={participant}
              onMouseEnter={() => setActive(index)}
              onMouseLeave={() => setActive(null)}
              className={`cursor-default rounded-full px-4 py-2 text-sm font-bold transition-all duration-200 ${
                active === index
                  ? "-translate-y-0.5 bg-navy text-white shadow-md"
                  : "bg-gold/15 text-navy"
              }`}
            >
              {participant}
            </li>
          ))}
        </ul>
      </div>
      <Reveal className="hidden md:block">
        <CollectiveNetwork
          nodes={data.participants}
          active={active}
          onActive={setActive}
        />
      </Reveal>
    </div>
  );
}

function JourneyStepper({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const count = steps.length;
  const last = count - 1;
  const current = steps[active];
  const inset = `${50 / count}%`;

  return (
    <div className="mt-10">
      <div className="relative">
        <div
          className="absolute top-[18px] h-1 rounded-full bg-gray-200"
          style={{ left: inset, right: inset }}
        >
          <motion.div
            className="h-full rounded-full bg-gold"
            initial={false}
            animate={{ width: `${(active / last) * 100}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
        <ol
          className="relative grid"
          style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
        >
          {steps.map((step, index) => (
            <li key={step.title} className="flex flex-col items-center">
              <button
                type="button"
                onClick={() => setActive(index)}
                aria-current={index === active ? "step" : undefined}
                aria-label={`Step ${index + 1}: ${step.title}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full font-heading text-base font-bold transition-all duration-300 ${
                  index === active
                    ? "scale-110 bg-gold text-[#021f2e] ring-4 ring-gold/30"
                    : index < active
                      ? "bg-navy text-white"
                      : "border-2 border-gray-300 bg-white text-gray-500 hover:border-gold"
                }`}
              >
                {index < active ? <CheckIcon className="h-5 w-5" /> : index + 1}
              </button>
              <span
                className={`mt-3 text-xs font-semibold transition-colors duration-300 sm:text-sm ${
                  index === active ? "text-navy" : "text-gray-500"
                }`}
              >
                {step.title}
              </span>
            </li>
          ))}
        </ol>
      </div>

      <div
        aria-live="polite"
        className="mt-8 rounded-2xl border border-gold/20 bg-[#f8f6f0] p-6 md:p-8"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-[#075E8B]">
              Step {active + 1} of {count}
            </p>
            <h3 className="mt-2 font-heading text-2xl font-bold text-navy">
              {current.title}
            </h3>
            <p className="mt-3 max-w-2xl leading-relaxed text-body">
              {current.description}
            </p>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActive((value) => Math.max(0, value - 1))}
            disabled={active === 0}
            className="rounded-lg border border-navy/30 px-5 py-2.5 text-sm font-bold text-navy transition-all hover:bg-navy/5 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Back
          </button>
          {active < last ? (
            <button
              type="button"
              onClick={() => setActive((value) => Math.min(last, value + 1))}
              className="rounded-lg bg-navy px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-navy/90"
            >
              Next step
            </button>
          ) : (
            <a
              href={CALENDLY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${CTA_PRIMARY} !px-5 !py-2.5 !text-sm`}
            >
              Schedule a Strategy Call
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

function FaqAccordion({ faqs }: { faqs: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mt-8 space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = open === index;
        const buttonId = `faq-button-${index}`;
        const panelId = `faq-panel-${index}`;
        return (
          <div
            key={faq.question}
            className={`rounded-2xl border transition-colors duration-300 ${
              isOpen
                ? "border-gold bg-[#f8f6f0]"
                : "border-gray-200 bg-white hover:border-gold/60"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : index)}
                className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left font-heading text-lg font-bold text-navy"
              >
                {faq.question}
                <motion.span
                  aria-hidden="true"
                  animate={{ rotate: isOpen ? 45 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold/25 text-xl leading-none text-navy"
                >
                  +
                </motion.span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <p className="px-6 pb-5 leading-relaxed text-body">
                    {faq.answer}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default function CannabisFundContent() {
  const {
    whyExists,
    approach,
    receive,
    collaboration,
    whoFor,
    experience,
    whyMatters,
    faqs,
    finalCta,
  } = content;

  return (
    <MotionConfig reducedMotion="user">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <Hero
        title="The Collective Grow"
        subtitle="Raising Standards. Restoring Access. Reinvesting in the Cannabis Industry."
      />

      <section className="mx-auto max-w-6xl px-6 py-16">
        {/* Intro */}
        <div className="grid items-center gap-10 lg:grid-cols-[1.3fr_0.7fr]">
          <Reveal>
            {content.intro.map((paragraph, index) => (
              <p
                key={paragraph}
                className={`leading-relaxed ${index === 0 ? "text-lg text-navy" : "mt-4 text-body"}`}
              >
                {paragraph}
              </p>
            ))}
            <p className="mt-4 text-lg font-bold text-navy">
              {content.introEmphasis}
            </p>
            <p className="mt-4 leading-relaxed text-body">
              By bringing cannabis businesses together through collaborative
              public relations, educational campaigns, and co-branded visibility
              opportunities, we help participating brands amplify their voices
              while strengthening the industry as a whole.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#join" className={CTA_PRIMARY}>
                Join the Collective
              </a>
              <a
                href={CALENDLY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={CTA_OUTLINE_DARK}
              >
                Schedule a Strategy Call
              </a>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="group relative overflow-hidden rounded-2xl shadow-xl">
              <div className="relative aspect-[4/3] w-full lg:aspect-[4/5]">
                <Image
                  src={LEAF_IMAGE}
                  alt="Cannabis leaves growing in natural light"
                  fill
                  sizes="(max-width: 1024px) 100vw, 35vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div
                className="absolute inset-0 bg-gradient-to-t from-[#021f2e]/90 via-[#021f2e]/30 to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <p className="text-sm font-semibold uppercase tracking-wider text-gold">
                  Nine-month initiative
                </p>
                <p className="mt-2 font-heading text-2xl font-bold">
                  Individual support. Shared campaigns.
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Customized communications for your brand, plus collaborative
                  campaigns that elevate the industry.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Why Collective Grow Exists */}
        <div className="mt-20">
          <SectionHeading
            eyebrow={whyExists.eyebrow}
            title="Why Collective Grow Exists"
          />
          <p className="mt-6 max-w-3xl leading-relaxed text-body">
            {whyExists.intro}
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyExists.challenges.map((challenge, index) => (
              <ChallengeCard
                key={challenge.title}
                challenge={challenge}
                index={index}
              />
            ))}
          </div>
          <Reveal>
            <p className="mt-8 max-w-3xl font-medium text-navy">
              {whyExists.closing}
            </p>
          </Reveal>
        </div>

        {/* Approach */}
        <Reveal className="mt-20">
          <div className="grid items-center gap-8 rounded-2xl border border-gold/20 bg-[#f8f6f0] p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-[#075E8B]">
                {approach.eyebrow}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-navy md:text-3xl">
                {approach.title}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-body">
                {approach.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
            <ApproachVisual />
          </div>
        </Reveal>

        {/* What You'll Receive */}
        <div className="mt-20">
          <SectionHeading title="What You’ll Receive" />
          <ReceiveTabs blocks={receive} />
        </div>

        {/* Why Collaboration Works */}
        <Reveal className="mt-20">
          <div
            className={`relative overflow-hidden rounded-2xl ${NAVY_GRADIENT} p-8 text-white md:p-10`}
          >
            <div
              className="absolute -bottom-16 -left-10 h-48 w-48 rounded-full bg-gold/15 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-wider text-gold">
                {collaboration.eyebrow}
              </p>
              <h2 className="mt-2 font-heading text-2xl font-bold text-white md:text-3xl">
                Why Collaboration Works
              </h2>
              <p className="mt-4 max-w-3xl text-white/75">
                {collaboration.intro}
              </p>
              <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                {collaboration.benefits.map((benefit, index) => (
                  <motion.li
                    key={benefit}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="flex items-center gap-3 rounded-xl border border-white/15 bg-white/5 p-5 font-medium transition-colors duration-200 hover:border-gold/60 hover:bg-white/10"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold text-[#021f2e]">
                      <CheckIcon className="h-4 w-4" />
                    </span>
                    {benefit}
                  </motion.li>
                ))}
              </ul>
              <p className="mt-8 max-w-3xl text-lg">
                {collaboration.closing}{" "}
                <span className="font-semibold text-gold">
                  {collaboration.closingEmphasis}
                </span>
              </p>
            </div>
          </div>
        </Reveal>

        {/* Who It's For */}
        <WhoFor data={whoFor} />

        {/* Experience */}
        <div className="mt-20">
          <SectionHeading
            eyebrow={experience.eyebrow}
            title="The Collective Grow Experience"
          />
          <JourneyStepper steps={experience.steps} />
        </div>

        <ProgramOverview />

        {/* Why It Matters */}
        <Reveal className="mt-20">
          <div className="rounded-2xl border border-gold/20 bg-[#f8f6f0] p-8 text-center md:p-12">
            <h2 className="font-heading text-2xl font-bold text-navy md:text-3xl">
              Why It Matters
            </h2>
            <p className="mt-4 text-body">{whyMatters.lead}</p>
            <p className="mx-auto mt-3 max-w-2xl font-heading text-xl font-bold text-navy md:text-2xl">
              {whyMatters.belief}
            </p>
            <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-body">
              {whyMatters.body}
            </p>
          </div>
        </Reveal>

        {/* FAQ */}
        <div className="mt-20">
          <SectionHeading title="Frequently Asked Questions" />
          <FaqAccordion faqs={faqs} />
        </div>

        {/* Final CTA */}
        <Reveal className="mt-20">
          <div
            id="join"
            className={`relative scroll-mt-24 overflow-hidden rounded-2xl ${NAVY_GRADIENT} p-8 text-white md:p-12`}
          >
            <div
              className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gold/20 blur-3xl"
              aria-hidden="true"
            />
            <div className="relative">
              <h2 className="text-center font-heading text-2xl font-bold text-white md:text-3xl">
                {finalCta.title}
              </h2>
              <p className="mt-3 text-center text-lg font-semibold text-gold">
                {finalCta.subtitle}
              </p>
              <p className="mx-auto mt-4 max-w-2xl text-center text-white/75">
                {finalCta.body}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-4 text-center sm:flex-row">
                <a
                  href={CALENDLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_PRIMARY}
                >
                  Schedule a Strategy Call
                </a>
                <a
                  href={APPLY_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={CTA_OUTLINE_LIGHT}
                >
                  Apply to Join
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </MotionConfig>
  );
}
