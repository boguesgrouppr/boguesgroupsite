"use client";

import { useMemo, useState } from "react";
import CaseStudyCard from "@/components/case-studies/CaseStudyCard";
import {
  CASE_STUDY_TABS,
  type CaseStudy,
  type CaseStudyCategory,
} from "@/lib/case-studies-shared";

type TabId = "all" | CaseStudyCategory;

interface CaseStudiesClientProps {
  caseStudies: CaseStudy[];
}

export default function CaseStudiesClient({
  caseStudies,
}: CaseStudiesClientProps) {
  const [activeTab, setActiveTab] = useState<TabId>("all");

  const filtered = useMemo(() => {
    if (activeTab === "all") return caseStudies;
    return caseStudies.filter((study) =>
      study.categories.includes(activeTab)
    );
  }, [activeTab, caseStudies]);

  const showHospitalityComingSoon =
    activeTab === "hospitality" && filtered.length === 0;

  return (
    <>
      <div className="-mx-6 mb-10 overflow-x-auto px-6 pb-1 sm:mx-0 sm:px-0">
        <div
          className="flex min-w-max gap-2 sm:min-w-0 sm:flex-wrap sm:justify-center sm:gap-3"
          role="tablist"
          aria-label="Filter case studies by category"
        >
          {CASE_STUDY_TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={activeTab === tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 sm:px-5 sm:py-2.5 ${
                activeTab === tab.id
                  ? "bg-[#075E8B] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {showHospitalityComingSoon ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
          <p className="font-heading text-2xl font-bold text-[#075E8B]">
            Coming Soon
          </p>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            Hospitality case studies are on the way. Check back soon for stories
            from our work in sports and entertainment hospitality.
          </p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-20 text-center">
          <p className="font-heading text-xl font-bold text-[#075E8B]">
            No case studies yet
          </p>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            We&apos;re adding new stories soon. Try another category or check
            back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((study) => (
            <CaseStudyCard key={study.id} study={study} />
          ))}
        </div>
      )}
    </>
  );
}
