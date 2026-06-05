import NavLink from "@/components/NavLink";

interface HeroProps {
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  backgroundClass?: string;
  compact?: boolean;
}

export default function Hero({
  title,
  subtitle,
  ctaText,
  ctaHref,
  backgroundClass,
  compact = false,
}: HeroProps) {
  return (
    <section
      className={`relative overflow-hidden ${compact ? "py-14 sm:py-20 md:py-24" : "py-20 sm:py-28 md:py-36 lg:py-44"} px-5 sm:px-6`}
      style={{
        background: backgroundClass
          ? undefined
          : "linear-gradient(165deg, #021f2e 0%, #042f45 20%, #075E8B 50%, #1a82b5 85%, #4da6d4 100%)",
      }}
    >
      {/* Subtle pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Gold accent line */}
        <div className="mx-auto mb-6 h-1 w-20 rounded-full bg-[#D4AF38]" />

        <h1 className="font-heading text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl lg:text-7xl leading-[1.1]">
          {title}
        </h1>

        {subtitle && (
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/75 sm:text-lg md:text-xl sm:mt-8">
            {subtitle}
          </p>
        )}

        {ctaText && ctaHref && (
          <div className="mt-8 sm:mt-12">
            {ctaHref.startsWith("http") ? (
              <a
                href={ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03] sm:px-10 sm:py-5 sm:text-lg whitespace-nowrap"
              >
                {ctaText}
              </a>
            ) : (
              <NavLink
                href={ctaHref}
                className="inline-block rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:bg-[#e5c256] hover:shadow-xl hover:scale-[1.03] sm:px-10 sm:py-5 sm:text-lg whitespace-nowrap"
              >
                {ctaText}
              </NavLink>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
