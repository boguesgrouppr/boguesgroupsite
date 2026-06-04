"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { SPEAKER_BOOKING_URL } from "@/lib/speaker-booking";

type SportType = "NBA" | "NFL" | "Speaker";

type Speaker = {
  name: string;
  image: string;
  bio: string;
  funFact: string;
  sport: SportType;
};

const speakers: Speaker[] = [
  {
    name: "Vince Carter",
    image: "https://boguesgroup.com/wp-content/uploads/2025/09/Vince-Carter-Profile.jpg",
    bio: "Hall of Famer and retired NBA player. Carter played for the Toronto Raptors, New Jersey Nets, Orlando Magic, Phoenix Suns, Dallas Mavericks, Memphis Grizzlies, Sacramento Kings, and Atlanta Hawks. From Daytona Beach, Florida.",
    funFact:
      "22 NBA seasons - the longest career ever for an NBA shooting guard/small forward.",
    sport: "NBA",
  },
  {
    name: "Charles Oakley",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Charles-Oakley-New.jpg",
    bio: "Former NBA player for the Chicago Bulls, New York Knicks, Toronto Raptors, Washington Wizards, and Houston Rockets. From Cleveland, Ohio.",
    funFact: "19 NBA seasons.",
    sport: "NBA",
  },
  {
    name: "Muggsy Bogues",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Muggsy-Bogues-New.jpg",
    bio: "Retired NBA veteran and ambassador for the Charlotte Hornets and the NBA. Played for Washington, Charlotte, Golden State, and Toronto. From Baltimore, Maryland.",
    funFact: "Appeared in the movie Space Jam.",
    sport: "NBA",
  },
  {
    name: "Baron Davis",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Baron-Davis-New.jpg",
    bio: "Former professional basketball player and studio analyst for NBA on TNT. Two-time NBA All-Star. From South Central California.",
    funFact: "Wore no. 85 to honor his grandparents.",
    sport: "NBA",
  },
  {
    name: "Sonya Curry",
    image:
      "https://boguesgroup.com/wp-content/uploads/2024/05/Screen-Shot-2023-03-13-at-3.53.57-AM-e1695491422447.jpg",
    bio: "Entrepreneur, educator, author, and speaker. Founder of Christian Montessori School of Lake Norman and active community advocate.",
    funFact: "Grandmother to six grandchildren and a strong community builder.",
    sport: "Speaker",
  },
  {
    name: "Seth Curry",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Sth-Curry-New.jpg",
    bio: "Current NBA player and brother of Stephen Curry. From Charlotte, North Carolina.",
    funFact: "Named to the All-NBA Summer League First Team in 2015.",
    sport: "NBA",
  },
  {
    name: "Larry Johnson",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/larry-johnson-New.jpg",
    bio: "Retired NBA veteran known as Grandmama. Played for the Charlotte Hornets and New York Knicks. From Dallas, Texas.",
    funFact: "#1 overall pick in the 1991 NBA Draft.",
    sport: "NBA",
  },
  {
    name: "Rex Chapman",
    image: "https://boguesgroup.com/wp-content/uploads/2025/09/Larry-Johnson.jpg",
    bio: "Retired NBA player, broadcaster, and philanthropist. Best known for his Charlotte Hornets era. From Bowling Green, Kentucky.",
    funFact: "Host of The Rex Chapman Show.",
    sport: "NBA",
  },
  {
    name: "Alonzo Mourning",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Alonzo-Mourning-New.jpg",
    bio: "Seven-time NBA All-Star and two-time NBA Defensive Player of the Year. From Chesapeake, Virginia.",
    funFact: "Drafted 2nd overall in 1992.",
    sport: "NBA",
  },
  {
    name: "Shaurice Mullins",
    image: "https://boguesgroup.com/wp-content/uploads/2025/09/ShauriceMullinsheadshot-scaled.jpg",
    bio: "Executive coach, entrepreneur, and disaster recovery leader focused on resilience and leadership.",
    funFact: "Known for turning obstacles into opportunities.",
    sport: "Speaker",
  },
  {
    name: "Steve Smith",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Steve-Smith-New.jpg",
    bio: "Retired NFL veteran and current ESPN analyst. Played for the Carolina Panthers and Baltimore Ravens.",
    funFact: "Ranks among NFL all-purpose yard leaders.",
    sport: "NFL",
  },
  {
    name: "Roman Harper",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Roman-Harper-New.jpg",
    bio: "Retired NFL player and Super Bowl champion with the New Orleans Saints.",
    funFact: "Member of Omega Psi Phi Fraternity, Inc.",
    sport: "NFL",
  },
  {
    name: "Harvey Grant",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Harvey-Grant-New.jpg",
    bio: "Retired NBA veteran and twin brother of Horace Grant. From Augusta, Georgia.",
    funFact: "Twin brothers Harvey and Horace were born on Independence Day.",
    sport: "NBA",
  },
  {
    name: "Charles Johnson",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Charles-Johnson-New.jpg",
    bio: "Retired NFL player with a long Carolina Panthers career and active community foundation work.",
    funFact: "Three-sport athlete in high school.",
    sport: "NFL",
  },
  {
    name: "Anthony Morrow",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Anthony-Marrow-New.jpg",
    bio: "Former NBA player and founder of Anthony Morrow Charities in Charlotte.",
    funFact: "Founded the Own Sense of Style clothing brand.",
    sport: "NBA",
  },
  {
    name: "James Johnson",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/James-Johnson-New.jpg",
    bio: "NBA veteran with extensive regular season and playoff experience.",
    funFact: "Said he would want to be a UFC fighter if not in basketball.",
    sport: "NBA",
  },
  {
    name: "Walt Aikens",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Walt-Aikens-New.jpg",
    bio: "Former NFL defensive back from Charlotte, North Carolina.",
    funFact: "Played both basketball and football at Liberty University.",
    sport: "NFL",
  },
  {
    name: "Bruce Bowen",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Bruce-Bowen-New.jpg",
    bio: "Three-time NBA champion and elite defender known for his Spurs era.",
    funFact: "Jersey #12 was retired by the Spurs.",
    sport: "NBA",
  },
  {
    name: "Usama Young",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Usama-Young-New.jpg",
    bio: "Retired NFL player and Super Bowl champion with the New Orleans Saints.",
    funFact: "Founded the Believe in U Youth Foundation.",
    sport: "NFL",
  },
  {
    name: "Horace Grant",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Horace-Grant-New.jpg",
    bio: "Four-time NBA champion and retired veteran forward. From Augusta, Georgia.",
    funFact: "Served as NBA Goodwill Ambassador.",
    sport: "NBA",
  },
  {
    name: "Ron Harper",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Ron-Harper-New.jpg",
    bio: "Five-time NBA champion and former guard for the Bulls, Lakers, Clippers, and Cavaliers.",
    funFact: "Supporter of The Stuttering Foundation.",
    sport: "NBA",
  },
  {
    name: 'Kenny "The Jet" Smith',
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Kenny-The-Jet-Smith-New.jpg",
    bio: "Two-time NBA champion and longtime analyst on NBA on TNT.",
    funFact: "Also works as a producer and actor.",
    sport: "NBA",
  },
  {
    name: "Clark Kellogg",
    image: "https://boguesgroup.com/wp-content/uploads/2024/05/Clark-Kellogg-New.jpg",
    bio: "Former NBA player and lead college basketball analyst for CBS Sports.",
    funFact: "Featured as an NBA 2K commentator since NBA 2K9.",
    sport: "NBA",
  },
];

const sportBadgeStyles: Record<SportType, string> = {
  NBA: "bg-purple-100 text-purple-800",
  NFL: "bg-blue-100 text-blue-800",
  Speaker: "bg-emerald-100 text-emerald-800",
};

const localImageBySpeaker: Record<string, string> = {
  "Vince Carter": "/logos/Vine Carter.jpg",
  "Rex Chapman": "/logos/Rex Chapman.jpg",
  "Shaurice Mullins": "/logos/Shaurice Mullins.jpg",
};

function normalizeImagePath(speakerName: string, imageUrl: string) {
  if (localImageBySpeaker[speakerName]) {
    return localImageBySpeaker[speakerName];
  }

  if (!imageUrl) {
    return "https://boguesgroup.com/media/2024/05/Charles-Oakley-New.jpg";
  }

  const uploadsPrefix = "https://boguesgroup.com/wp-content/uploads/";
  if (imageUrl.startsWith(uploadsPrefix)) {
    return `https://boguesgroup.com/media/${imageUrl.slice(uploadsPrefix.length)}`;
  }

  const mediaPrefix = "https://boguesgroup.com/media/";
  if (imageUrl.startsWith(mediaPrefix)) {
    return imageUrl;
  }

  return imageUrl;
}

export default function SpeakerRosterClient() {
  const [activeFilter, setActiveFilter] = useState<"All" | SportType>("All");
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);

  const filters: Array<"All" | SportType> = ["All", "NBA", "NFL", "Speaker"];

  const filteredSpeakers = useMemo(() => {
    if (activeFilter === "All") return speakers;
    return speakers.filter((speaker) => speaker.sport === activeFilter);
  }, [activeFilter]);

  return (
    <>
      <section className="bg-gray-50 py-10">
        <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#075E8B]">{speakers.length}+</p>
            <p className="mt-1 text-sm text-gray-500">Featured speakers</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#075E8B]">Nationwide</p>
            <p className="mt-1 text-sm text-gray-500">Availability for events</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-sm">
            <p className="text-2xl font-bold text-[#075E8B]">Custom</p>
            <p className="mt-1 text-sm text-gray-500">Topics for your audience</p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14 md:py-20">
        <div className="mb-9 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#D4AF38]">
            Featured talent
          </p>
          <h2 className="font-heading text-3xl font-bold text-[#075E8B] sm:text-4xl md:text-5xl">
            Meet our full roster
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-gray-600 sm:text-lg">
            Browse by sport category and select any speaker to view more details.
          </p>
        </div>

        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {filters.map((filter) => (
            <button
              key={filter}
              type="button"
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                activeFilter === filter
                  ? "bg-[#075E8B] text-white"
                  : "border border-gray-300 bg-white text-gray-700 hover:border-[#075E8B] hover:text-[#075E8B]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredSpeakers.map((speaker) => {
            const isOpen = activeSpeaker === speaker.name;
            return (
              <article
                key={speaker.name}
                className="flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="relative aspect-[4/5]">
                  <Image
                    src={normalizeImagePath(speaker.name, speaker.image)}
                    alt={speaker.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p
                      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${sportBadgeStyles[speaker.sport]}`}
                    >
                      {speaker.sport}
                    </p>
                    <h3 className="mt-2 font-heading text-2xl font-bold text-white">
                      {speaker.name}
                    </h3>
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <p className="text-sm leading-relaxed text-gray-600">
                    {isOpen ? speaker.bio : `${speaker.bio.slice(0, 180)}...`}
                  </p>

                  <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm text-gray-700">
                    <span className="font-semibold text-[#075E8B]">Fun Fact:</span>{" "}
                    {speaker.funFact}
                  </div>

                  <div className="mt-auto pt-6 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSpeaker(isOpen ? null : speaker.name)}
                      className="inline-flex items-center justify-center rounded-lg border border-[#075E8B] px-4 py-2 text-sm font-bold text-[#075E8B] transition-colors hover:bg-[#075E8B] hover:text-white"
                    >
                      {isOpen ? "Show Less" : "Read More"}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section
        className="py-16 md:py-20"
        style={{
          background:
            "linear-gradient(165deg, #021f2e 0%, #042f45 30%, #075E8B 70%, #1a82b5 100%)",
        }}
      >
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="font-heading text-3xl font-bold leading-tight text-white sm:text-4xl">
            Ready to book a speaker for your next event?
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Share your event goals and audience. Our team will help match the right
            speaker and coordinate next steps.
          </p>
          <a
            href={SPEAKER_BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-lg bg-[#D4AF38] px-8 py-4 text-base font-bold text-[#021f2e] shadow-lg transition-all duration-200 hover:scale-[1.02] hover:bg-[#e5c256]"
          >
            Click Here to Submit a Booking Request
          </a>
        </div>
      </section>
    </>
  );
}
