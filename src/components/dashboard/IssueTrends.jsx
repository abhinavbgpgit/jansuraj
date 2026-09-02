import React, { useState } from "react";
import DashboardSection from "./DashboardSection";
import useDashboardData from "./useDashboardData";
import DashboardSkeleton from "./DashboardSkeleton";
import DashboardEmptyState from "./DashboardEmptyState";

// ==========================================
// EXPECTED API CONTRACT
// GET /api/dashboard/trends?period=30d
// (period: 7d | 30d | 6m | 1y)
// {
//   success: true,
//   trend: [ { label, reported, resolved } ]
// }
// ==========================================

const PERIODS = [
  { key: "7d", label: "7 दिन" },
  { key: "30d", label: "30 दिन" },
  { key: "6m", label: "6 महीने" },
  { key: "1y", label: "1 साल" },
];

const CHART_WIDTH = 640;
const CHART_HEIGHT = 200;

function buildPoints(values, max) {
  if (values.length === 0) return "";

  return values
    .map((value, index) => {
      const x =
        values.length === 1
          ? 0
          : (index / (values.length - 1)) * CHART_WIDTH;
      const y = CHART_HEIGHT - (max === 0 ? 0 : (value / max) * CHART_HEIGHT);
      return `${x},${y}`;
    })
    .join(" ");
}

export default function IssueTrends() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error } = useDashboardData(
    "/api/dashboard/trends",
    { period }
  );

  const trend = data?.trend || [];
  const max = Math.max(
    ...trend.map((t) => Math.max(t.reported || 0, t.resolved || 0)),
    1
  );

  return (
    <DashboardSection
      icon="📈"
      title="समस्या ट्रेंड"
      subtitle="दर्ज बनाम समाधान — क्या समस्याएं बढ़ रही हैं या घट रही हैं?"
      right={
        <div className="flex gap-1 rounded-full border border-[#E5E0D5] bg-[#FBF8F1] p-1">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              type="button"
              onClick={() => setPeriod(p.key)}
              className={`rounded-full px-3 py-1 text-xs font-semibold transition-all ${
                period === p.key
                  ? "bg-[#176B4D] text-white"
                  : "text-[#6B766F] hover:text-[#176B4D]"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      }
    >
      {loading ? (
        <DashboardSkeleton rows={3} />
      ) : error || trend.length === 0 ? (
        <DashboardEmptyState message="समय के साथ समस्याओं का ट्रेंड अभी उपलब्ध नहीं है।" />
      ) : (
        <div>
          <div className="mb-3 flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[#176B4D]">
              <span className="h-2 w-2 rounded-full bg-[#176B4D]" /> दर्ज
              समस्याएं
            </span>
            <span className="flex items-center gap-1.5 text-sky-600">
              <span className="h-2 w-2 rounded-full bg-sky-600" /> समाधान हुई
            </span>
          </div>

          <svg
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
            className="h-48 w-full"
            preserveAspectRatio="none"
          >
            <polyline
              points={buildPoints(
                trend.map((t) => t.reported || 0),
                max
              )}
              fill="none"
              stroke="#176B4D"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points={buildPoints(
                trend.map((t) => t.resolved || 0),
                max
              )}
              fill="none"
              stroke="#0284C7"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div className="mt-2 flex justify-between text-[10px] text-[#6B766F]">
            {trend.map((t, i) => (
              <span
                key={i}
                className={
                  i === 0 || i === trend.length - 1
                    ? ""
                    : "hidden sm:inline"
                }
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>
      )}
    </DashboardSection>
  );
}
