import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/categories?limit=10
// {
//   success: true,
//   categories: [
//     { category, reported, resolved, pending, resolutionRate }
//   ]
// }
// ==========================================

const BAR_COLORS = [
  "bg-[#176B4D]",
  "bg-sky-600",
  "bg-[#F59E0B]",
  "bg-emerald-600",
  "bg-blue-600",
];

export default function TopCategories() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/categories",
    { limit: 10 }
  );

  const categories = data?.categories || [];
  const maxReported = Math.max(...categories.map((c) => c.reported || 0), 1);

  return (
    <DashboardSection
      icon="🏷️"
      title="बिहार में सबसे ज़्यादा किस तरह की समस्याएं?"
      subtitle="श्रेणी के अनुसार दर्ज, समाधान और लंबित समस्याएं"
    >
      {loading ? (
        <DashboardSkeleton rows={5} />
      ) : error || categories.length === 0 ? (
        <DashboardEmptyState message="समस्या-श्रेणी के अनुसार आंकड़े अभी उपलब्ध नहीं हैं।" />
      ) : (
        <div className="space-y-3">
          {categories.map((cat, index) => (
            <div
              key={cat.category}
              className="rounded-2xl border border-[#E5E0D5] bg-[#FBF8F1] p-3.5"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-[#17231D]">
                  {index + 1}. {cat.category}
                </span>

                <span className="text-xs font-semibold text-[#6B766F]">
                  {cat.reported?.toLocaleString("hi-IN")} रिपोर्ट
                </span>
              </div>

              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-[#E8E4D8]">
                <div
                  className={`h-full rounded-full ${
                    BAR_COLORS[index % BAR_COLORS.length]
                  }`}
                  style={{
                    width: `${((cat.reported || 0) / maxReported) * 100}%`,
                  }}
                />
              </div>

              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#6B766F]">
                <span>
                  ✅ समाधान:{" "}
                  <strong className="text-[#17231D]">
                    {cat.resolved?.toLocaleString("hi-IN") ?? "—"}
                  </strong>
                </span>
                <span>
                  ⏳ लंबित:{" "}
                  <strong className="text-[#17231D]">
                    {cat.pending?.toLocaleString("hi-IN") ?? "—"}
                  </strong>
                </span>
                <span>
                  📈 रिज़ॉल्यूशन:{" "}
                  <strong className="text-[#17231D]">
                    {cat.resolutionRate ?? "—"}%
                  </strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
