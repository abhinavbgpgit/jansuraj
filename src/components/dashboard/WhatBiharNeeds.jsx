import React from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/top-concerns?limit=5
// {
//   success: true,
//   concerns: [ { category, percentage } ]
// }
// Raw analytics ko normal user ke liye
// human-readable insight me badalta hai.
// ==========================================

const RANK_BADGES = ["🥇", "🥈", "🥉", "4️⃣", "5️⃣"];

export default function WhatBiharNeeds() {
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/top-concerns",
    { limit: 5 }
  );

  const concerns = data?.concerns || [];

  return (
    <DashboardSection
      icon="💡"
      title="बिहार को सबसे ज़्यादा किसकी ज़रूरत है"
      subtitle="सारे आंकड़ों का सार — 5 सबसे बड़ी चिंताएं"
    >
      {loading ? (
        <DashboardSkeleton rows={3} />
      ) : error || concerns.length === 0 ? (
        <DashboardEmptyState message="यह सारांश अभी तैयार नहीं हो पाया है।" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {concerns.map((c, index) => (
            <div
              key={c.category}
              className="rounded-2xl border border-[#E5E0D5] bg-gradient-to-b from-[#EEF6F1] to-white p-4 text-center"
            >
              <div className="text-2xl">{RANK_BADGES[index] || "•"}</div>
              <div className="mt-2 text-xl font-extrabold text-[#176B4D]">
                {c.percentage}%
              </div>
              <div className="mt-1 text-xs font-semibold text-[#17231D]">
                {c.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardSection>
  );
}
