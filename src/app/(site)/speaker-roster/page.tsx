import Hero from "@/components/Hero";
import SpeakerRosterClient from "./SpeakerRosterClient";

export const metadata = {
  title: "Speaker Roster - Bogues Group",
  description:
    "Browse the Bogues Group roster of experienced speakers available for events, panels, and keynotes across North Carolina.",
  openGraph: {
    title: "Speaker Roster - Bogues Group",
    description:
      "Browse the Bogues Group roster of experienced speakers available for events, panels, and keynotes.",
    type: "website",
    siteName: "Bogues Group",
    url: "/speaker-roster",
  },
  twitter: {
    card: "summary_large_image",
    title: "Speaker Roster - Bogues Group",
    description:
      "Browse the Bogues Group roster of experienced speakers available for events, panels, and keynotes.",
  },
};

export default function SpeakerRosterPage() {
  return (
    <>
      <Hero
        title="Speaker Roster"
        subtitle="Experienced voices for your next event"
      />
      <SpeakerRosterClient />
    </>
  );
}
