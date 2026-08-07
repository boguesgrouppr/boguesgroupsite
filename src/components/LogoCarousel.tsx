"use client";

import Image from "next/image";
import NavLink from "@/components/NavLink";

type ClientLogo = {
  src: string;
  alt: string;
  href?: string;
  width: number;
  height: number;
};

const clients: ClientLogo[] = [
  { src: "/logos/yelp-logo.png", alt: "Yelp", href: "/case-studies/yelp-crown-town-neighborhood-showdown", width: 1200, height: 484 },
  { src: "/logos/muggsy.png", alt: "Muggsy Bogues", href: "/case-studies/muggsy-bogues-family-foundation", width: 500, height: 108 },
  { src: "/logos/microsoft.png", alt: "Microsoft", href: "/case-studies/microsoft-youthspark-ai", width: 216, height: 46 },
  { src: "/logos/abc-board.png", alt: "Mecklenburg County ABC Board", href: "/case-studies/mecklenburg-county-abc-board", width: 458, height: 350 },
  { src: "/logos/frankies.png", alt: "Frankie's Fun Park", href: "/case-studies/frankies-amusement-park", width: 200, height: 200 },
  { src: "/logos/communities-in-schools.png", alt: "Communities In Schools", href: "/case-studies/communities-in-schools-charlotte-mecklenburg", width: 200, height: 200 },
  { src: "/logos/Kraft.PNG", alt: "Kraft", href: "/case-studies/kraft", width: 3840, height: 2160 },
  { src: "/logos/american_express.PNG", alt: "American Express", width: 225, height: 224 },
  { src: "/logos/capital_one.PNG", alt: "Capital One", width: 4096, height: 4096 },
  { src: "/logos/charlotte_crown.PNG", alt: "Charlotte Crown", width: 319, height: 313 },
  { src: "/logos/charlotte_hornets.JPG", alt: "Charlotte Hornets", width: 228, height: 221 },
  { src: "/logos/crva.PNG", alt: "CRVA", width: 512, height: 266 },
  { src: "/logos/toronto_raptors.PNG", alt: "Toronto Raptors", width: 225, height: 225 },
];

const ITEM_WIDTH = 240;
const SET_WIDTH = ITEM_WIDTH * clients.length;

// 3 copies: guarantees full coverage on any screen width with seamless loop
const repeated = [...clients, ...clients, ...clients];

export default function LogoCarousel() {
  return (
    <>
      <style>{`
        @keyframes logo-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${SET_WIDTH}px); }
        }
      `}</style>
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-16 z-10 bg-gradient-to-l from-white to-transparent" />

        <div
          className="flex items-center"
          style={{
            width: `${ITEM_WIDTH * repeated.length}px`,
            animation: `logo-scroll 20s linear infinite`,
          }}
        >
          {repeated.map((client, i) => {
            const className =
              "flex-shrink-0 flex items-center justify-center transition-transform duration-300 hover:scale-110";
            const style = { width: `${ITEM_WIDTH}px`, padding: "0 40px" };
            const img = (
              <Image
                src={client.src}
                alt={client.alt}
                width={client.width}
                height={client.height}
                className="h-12 w-full object-contain md:h-14"
                sizes="240px"
                loading="lazy"
              />
            );

            return client.href ? (
              <NavLink key={`${client.alt}-${i}`} href={client.href} className={className} style={style}>
                {img}
              </NavLink>
            ) : (
              <div key={`${client.alt}-${i}`} className={className} style={style}>
                {img}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
