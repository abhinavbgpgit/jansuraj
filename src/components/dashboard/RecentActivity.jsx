import React from "react";
import { Link } from "react-router-dom";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/recent
// {
//   success: true,
//   reported: [ { _id, category, ward, district, minutesAgo } ],
//   resolved: [ { _id, category, ward, district, resolvedInDays } ]
// }
// ==========================================

function ActivityCard({ icon, title, accent, items, emptyMessage, renderMeta }) {
  return (
    <section className="rounded-[24px] border border-[#E5E0D5] bg-white p-5 shadow-[0_12px_28px_rgba(23,35,29,.05)] sm:p-6">
      <h3 className="flex items-center gap-2 text-base font-extrabold text-[#17231D]">
        <span>{icon}</span> {title}
      </h3>

      {items.length === 0 ? (
        <div className="mt-4">
          <DashboardEmptyState message={emptyMessage} />
        </div>
      ) : (
        <div className="mt-4 space-y-2.5">
          {items.map((item) => (
            <Link
              key={item._id}
              to={`/issues/${item._id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-[#E5E0D5] bg-[#FBF8F1] px-3.5 py-2.5 transition hover:border-[#176B4D]/30"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#17231D]">
                  {item.category || "समस्या"}
                </p>
                <p className="mt-0.5 truncate text-xs text-[#6B766F]">
                  वार्ड {item.ward} • {item.district}
                </p>
              </div>

              <span className={`shrink-0 text-xs font-semibold ${accent}`}>
                {renderMeta(item)}
              </span>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

export default function RecentActivity() {
  const { data, loading, error } = useDashboardData("/api/dashboard/recent");

  const reported = data?.reported || [];
  const resolved = data?.resolved || [];

  if (loading) {
    return (
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[#E5E0D5] bg-white p-5 sm:p-6">
          <DashboardSkeleton rows={4} />
        </div>
        <div className="rounded-[24px] border border-[#E5E0D5] bg-white p-5 sm:p-6">
          <DashboardSkeleton rows={4} />
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ActivityCard
        icon="🆕"
        title="हाल ही में दर्ज हुई"
        accent="text-amber-600"
        items={error ? [] : reported}
        emptyMessage="हाल की रिपोर्ट की गई समस्याएं अभी उपलब्ध नहीं हैं।"
        renderMeta={(item) => `${item.minutesAgo} मिनट पहले`}
      />

      <ActivityCard
        icon="✅"
        title="हाल ही में समाधान हुई"
        accent="text-emerald-600"
        items={error ? [] : resolved}
        emptyMessage="हाल में समाधान हुई समस्याएं अभी उपलब्ध नहीं हैं।"
        renderMeta={(item) => `${item.resolvedInDays} दिन में हल`}
      />
    </div>
  );
}
