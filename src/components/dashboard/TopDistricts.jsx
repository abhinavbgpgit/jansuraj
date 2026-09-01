import React, { useMemo, useState } from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/districts?limit=20
// {
//   success: true,
//   districts: [
//     { district, total, resolved, pending, resolutionRate }
//   ]
// }
// Ek hi fetch se 4 perspectives client-side sort
// karke dikhaye jaate hain (extra API calls nahi lagti).
// ==========================================

const PERSPECTIVES = [
  { key: "mostReported", label: "सबसे ज़्यादा रिपोर्ट", sort: (a, b) => b.total - a.total },
  { key: "mostUnresolved", label: "सबसे ज़्यादा लंबित", sort: (a, b) => b.pending - a.pending },
  { key: "highestResolution", label: "सबसे बेहतर समाधान", sort: (a, b) => b.resolutionRate - a.resolutionRate },
  { key: "lowestResolution", label: "सबसे कमज़ोर समाधान", sort: (a, b) => a.resolutionRate - b.resolutionRate },
];

export default function TopDistricts() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/districts",
    { limit: 20 }
  );

  const [perspective, setPerspective] = useState(PERSPECTIVES[0].key);

  const districts = data?.districts;

  const sorted = useMemo(() => {
    const active = PERSPECTIVES.find((p) => p.key === perspective);
    return [...(districts || [])].sort(active.sort).slice(0, 10);
  }, [districts, perspective]);

  return (
    <DashboardSection
      icon="🏙️"
      title="टॉप 10 ज़िले"
      subtitle="ज़िले के अनुसार समस्याओं की स्थिति"
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {PERSPECTIVES.map((p) => (
          <button
            key={p.key}
            type="button"
            onClick={() => setPerspective(p.key)}
            className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-all ${
              perspective === p.key
                ? "border-[#176B4D] bg-[#176B4D] text-white"
                : "border-[#E5E0D5] bg-white text-[#6B766F] hover:border-[#176B4D]"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading ? (
        <DashboardSkeleton rows={5} />
      ) : error || sorted.length === 0 ? (
        <DashboardEmptyState message="ज़िला-स्तरीय आंकड़े अभी उपलब्ध नहीं हैं।" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] border-collapse text-sm">
            <thead>
              <tr className="border-b border-[#E5E0D5] text-left text-xs uppercase tracking-wide text-[#6B766F]">
                <th className="py-2 pr-3">ज़िला</th>
                <th className="px-3 py-2 text-right">कुल</th>
                <th className="px-3 py-2 text-right">समाधान</th>
                <th className="px-3 py-2 text-right">लंबित</th>
                <th className="py-2 pl-3 text-right">रिज़ॉल्यूशन %</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((d, index) => (
                <tr
                  key={d.district}
                  className="border-b border-[#F1EEE4] last:border-0"
                >
                  <td className="py-2.5 pr-3 font-semibold text-[#17231D]">
                    {index + 1}. {d.district}
                  </td>
                  <td className="px-3 py-2.5 text-right text-[#17231D]">
                    {d.total?.toLocaleString("hi-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-emerald-600">
                    {d.resolved?.toLocaleString("hi-IN")}
                  </td>
                  <td className="px-3 py-2.5 text-right text-rose-600">
                    {d.pending?.toLocaleString("hi-IN")}
                  </td>
                  <td className="py-2.5 pl-3 text-right font-semibold text-[#176B4D]">
                    {d.resolutionRate}%
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
