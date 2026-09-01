import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/critical
// {
//   success: true,
//   critical: { critical, high, medium, low }
// }
// Severity, affected-people count, issue age aur
// pending-duration ke aadhar par backend ye index
// calculate karega.
// ==========================================

const LEVELS = [
  { key: "critical", label: "गंभीर", dot: "🔴", ring: "border-rose-200 bg-rose-50 text-rose-700" },
  { key: "high", label: "उच्च", dot: "🟠", ring: "border-amber-200 bg-amber-50 text-amber-700" },
  { key: "medium", label: "मध्यम", dot: "🟡", ring: "border-yellow-200 bg-yellow-50 text-yellow-700" },
  { key: "low", label: "सामान्य", dot: "🟢", ring: "border-emerald-200 bg-emerald-50 text-emerald-700" },
];

export default function CriticalIssues() {
  const { data, loading, error } = useDashboardData("/api/dashboard/critical");
  const critical = data?.critical;

  return (
    <DashboardSection
      icon="🚨"
      title="सबसे गंभीर समस्याएं"
      subtitle="सिर्फ़ रिपोर्ट की संख्या नहीं — गंभीरता, प्रभावित लोग और लंबित समय के आधार पर"
    >
      {loading ? (
        <DashboardSkeleton rows={2} />
      ) : error || !critical ? (
        <DashboardEmptyState message="Critical Issue Index अभी backend में गणना नहीं हो रहा है।" />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LEVELS.map((level) => (
            <div
              key={level.key}
              className={`rounded-2xl border p-4 text-center ${level.ring}`}
            >
              <div className="text-lg">{level.dot}</div>
              <div className="mt-1 text-2xl font-extrabold">
                {(critical[level.key] ?? 0).toLocaleString("hi-IN")}
              </div>
              <div className="mt-0.5 text-xs font-semibold">
                {level.label}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
