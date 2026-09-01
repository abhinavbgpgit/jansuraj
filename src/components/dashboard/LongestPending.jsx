import React from "react";
import { Link } from "react-router-dom";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/longest-pending?limit=10
// {
//   success: true,
//   issues: [
//     { _id, category, district, ward, reportedAt, daysPending, status }
//   ]
// }
// ==========================================

export default function LongestPending() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/longest-pending",
    { limit: 10 }
  );

  const issues = data?.issues || [];

  return (
    <DashboardSection
      icon="⏱️"
      title="सबसे लंबे समय से लंबित समस्याएं"
      subtitle="जनता के प्रति जवाबदेही — इन्हें सबसे पहले देखा जाना चाहिए"
    >
      {loading ? (
        <DashboardSkeleton rows={4} />
      ) : error || issues.length === 0 ? (
        <DashboardEmptyState message="सबसे पुरानी लंबित समस्याओं की सूची अभी उपलब्ध नहीं है।" />
      ) : (
        <div className="space-y-2.5">
          {issues.map((issue) => (
            <Link
              key={issue._id}
              to={`/issues/${issue._id}`}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[#E5E0D5] bg-[#FBF8F1] p-3.5 transition hover:border-rose-300 hover:bg-rose-50/40"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-[#17231D]">
                  {issue.category || "समस्या"}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#6B766F]">
                  वार्ड {issue.ward} • {issue.district}
                </p>
              </div>

              <span className="shrink-0 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-extrabold text-rose-700">
                {issue.daysPending} दिन लंबित
              </span>
            </Link>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
