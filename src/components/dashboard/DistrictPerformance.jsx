import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/district-performance?limit=10
// {
//   success: true,
//   districts: [
//     { district, total, resolved, resolutionRate, avgResolutionDays }
//   ]
// }
// ==========================================

export default function DistrictPerformance() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/district-performance",
    { limit: 10 }
  );

  const districts = data?.districts || [];

  return (
    <DashboardSection
      icon="🏆"
      title="ज़िला प्रदर्शन"
      subtitle="समस्या कहाँ सबसे ज़्यादा है, और जवाब सबसे अच्छा कहाँ है — दोनों अलग सवाल हैं"
    >
      {loading ? (
        <DashboardSkeleton rows={5} />
      ) : error || districts.length === 0 ? (
        <DashboardEmptyState message="ज़िला प्रदर्शन स्कोर अभी उपलब्ध नहीं है।" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-left text-xs uppercase tracking-wide text-[#6B766F]">
                <th className="py-2 pr-3">ज़िला</th>
                <th className="px-3 py-2 text-right">समस्याएं</th>
                <th className="px-3 py-2 text-right">समाधान</th>
                <th className="px-3 py-2 text-right">रिज़ॉल्यूशन</th>
                <th className="py-2 pl-3 text-right">औसत समाधान समय</th>
              </tr>
            </thead>
            <tbody>
              {districts.map((d) => (
                <tr
                  key={d.district}
                  className="border-b border-[#F1EEE4] last:border-0"
                >
                  <td className="py-2.5 pr-3 font-semibold text-[#17231D]">
                    {d.district}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[#17231D]">
                    {d.total?.toLocaleString("hi-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-600">
                    {d.resolved?.toLocaleString("hi-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right font-semibold text-[#176B4D]">
                    {d.resolutionRate}%
                  </td>
                  <td className="py-2.5 pl-3 text-right text-sky-600">
                    {d.avgResolutionDays} दिन
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardSection>
  );
}
