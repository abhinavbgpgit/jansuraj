import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/wards?limit=10
// {
//   success: true,
//   wards: [
//     { ward, district, area, total, pending, resolved, topCategory }
//   ]
// }
// ==========================================

export default function TopWards() {
  const { data, loading, error } = useDashboardData("/api/dashboard/wards", {
    limit: 10,
  });

  const wards = data?.wards || [];

  return (
    <DashboardSection
      icon="📍"
      title="टॉप 10 वार्ड"
      subtitle="ज़िला + वार्ड दोनों — ताकि एक जैसे वार्ड नंबर में कन्फ़्यूज़न न हो"
    >
      {loading ? (
        <DashboardSkeleton rows={4} />
      ) : error || wards.length === 0 ? (
        <DashboardEmptyState message="वार्ड-स्तरीय आंकड़े अभी उपलब्ध नहीं हैं।" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {wards.map((w, index) => (
            <div
              key={`${w.district}-${w.ward}`}
              className="rounded-2xl border border-[#E5E0D5] bg-[#FBF8F1] p-4"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-extrabold text-[#17231D]">
                    #{index + 1} वार्ड {w.ward}
                  </p>
                  <p className="mt-0.5 text-xs text-[#6B766F]">
                    {w.area ? `${w.area}, ` : ""}
                    {w.district}
                  </p>
                </div>

                <span className="shrink-0 rounded-full bg-sky-50 px-2.5 py-1 text-[10px] font-bold text-sky-700">
                  {w.topCategory || "—"}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                <div className="rounded-xl bg-white p-2">
                  <div className="text-base font-extrabold text-[#17231D]">
                    {w.total?.toLocaleString("hi-IN")}
                  </div>
                  <div className="text-[10px] text-[#6B766F]">कुल</div>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <div className="text-base font-extrabold text-rose-600">
                    {w.pending?.toLocaleString("hi-IN")}
                  </div>
                  <div className="text-[10px] text-[#6B766F]">लंबित</div>
                </div>
                <div className="rounded-xl bg-white p-2">
                  <div className="text-base font-extrabold text-emerald-600">
                    {w.resolved?.toLocaleString("hi-IN")}
                  </div>
                  <div className="text-[10px] text-[#6B766F]">समाधान</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
