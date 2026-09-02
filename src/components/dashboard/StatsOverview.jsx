import React from "react";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/overview
// {
//   success: true,
//   stats: {
//     totalIssues, resolved, inProgress, pending,
//     districtsCovered, wardsCovered
//   }
// }
// ==========================================

const CARDS = [
  { key: "totalIssues", label: "कुल दर्ज समस्याएं", icon: "📋", accent: "text-[#176B4D]" },
  { key: "resolved", label: "समाधान हुई", icon: "✅", accent: "text-emerald-600" },
  { key: "inProgress", label: "कार्रवाई जारी", icon: "🛠️", accent: "text-amber-600" },
  { key: "pending", label: "लंबित", icon: "⏳", accent: "text-rose-600" },
  { key: "districtsCovered", label: "ज़िले शामिल", icon: "🗺️", accent: "text-sky-600" },
  { key: "wardsCovered", label: "वार्ड शामिल", icon: "📍", accent: "text-blue-600" },
];

function formatNumber(value) {
  if (typeof value !== "number") return "—";
  return value.toLocaleString("hi-IN");
}

export default function StatsOverview() {
  const { data, loading, error } = useDashboardData("/api/dashboard/overview");
  const stats = data?.stats;

  const resolutionRate =
    stats && stats.totalIssues > 0
      ? Math.round((stats.resolved / stats.totalIssues) * 100)
      : null;

  return (
    <section className="rounded-[24px] border border-[#E5E0D5] bg-white p-5 shadow-[0_12px_28px_rgba(23,35,29,.05)] sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-extrabold text-[#17231D] sm:text-xl">
          📊 बिहार का समग्र स्नैपशॉट
        </h2>
        <p className="mt-1 text-sm text-[#6B766F]">
          5 सेकंड में पूरे बिहार की स्थिति समझिए
        </p>
      </div>

      {loading ? (
        <DashboardSkeleton rows={2} />
      ) : error || !stats ? (
        <DashboardEmptyState message="बिहार-स्तरीय आंकड़े दिखाने के लिए यह dashboard API अभी backend में उपलब्ध नहीं है।" />
      ) : (
        <>
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {CARDS.map((card) => (
              <div
                key={card.key}
                className="rounded-2xl border border-[#E5E0D5] bg-[#FBF8F1] p-4"
              >
                <div className={`text-xl ${card.accent}`}>{card.icon}</div>
                <div className="mt-2 text-2xl font-extrabold text-[#17231D]">
                  {formatNumber(stats[card.key])}
                </div>
                <div className="mt-0.5 text-xs font-medium text-[#6B766F]">
                  {card.label}
                </div>
              </div>
            ))}
          </div>

          {resolutionRate !== null && (
            <div className="mt-4 flex items-center justify-between rounded-2xl bg-[#0F4D38] px-5 py-4 text-white">
              <div>
                <div className="text-2xl font-extrabold">
                  {resolutionRate}%
                </div>
                <div className="text-xs text-white/70">रिज़ॉल्यूशन रेट</div>
              </div>

              <div className="h-2 w-1/2 max-w-[240px] overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-[#F59E0B]"
                  style={{ width: `${resolutionRate}%` }}
                />
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
