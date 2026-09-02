import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/hotspots?limit=10
// {
//   success: true,
//   hotspots: [
//     { district, ward, area, total, topCategory }
//   ]
// }
// Note: Bihar ke real ward/district geo-boundaries
// abhi project me nahi hain, isliye map ki jagah
// list-based hotspot cards use ho rahe hain.
// (Bihar → District → Ward drill-down concept)
// ==========================================

export default function IssueHotspots() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/hotspots",
    { limit: 10 }
  );

  const hotspots = data?.hotspots || [];
  const maxTotal = Math.max(...hotspots.map((h) => h.total || 0), 1);

  return (
    <DashboardSection
      icon="🔥"
      title="बिहार में समस्या हॉटस्पॉट"
      subtitle="बिहार → ज़िला → वार्ड — सबसे ज़्यादा समस्याओं वाले इलाके"
    >
      {loading ? (
        <DashboardSkeleton rows={4} />
      ) : error || hotspots.length === 0 ? (
        <DashboardEmptyState message="हॉटस्पॉट डेटा अभी उपलब्ध नहीं है।" />
      ) : (
        <div className="space-y-2.5">
          {hotspots.map((h, index) => (
            <div
              key={`${h.district}-${h.ward}`}
              className="flex items-center gap-3 rounded-2xl border border-[#E5E0D5] bg-[#FBF8F1] p-3.5"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#EEF6F1] text-sm font-extrabold text-[#176B4D]">
                {index + 1}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-[#17231D]">
                  {h.district} → वार्ड {h.ward}
                  {h.area ? ` (${h.area})` : ""}
                </p>

                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-[#E8E4D8]">
                  <div
                    className="h-full rounded-full bg-blue-600"
                    style={{ width: `${(h.total / maxTotal) * 100}%` }}
                  />
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-sm font-extrabold text-[#17231D]">
                  {h.total?.toLocaleString("hi-IN")}
                </p>
                <p className="text-[10px] text-[#6B766F]">
                  {h.topCategory || "—"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
