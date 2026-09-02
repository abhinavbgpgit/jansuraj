import React from "react";

// ==========================================
// Generic pulsing skeleton bars — data load
// hone tak dikhta hai.
// ==========================================
export default function DashboardSkeleton({ rows = 3 }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, index) => (
        <div
          key={index}
          className="h-12 rounded-xl bg-[#F1EEE4]"
          style={{ opacity: 1 - index * 0.15 }}
        />
      ))}
    </div>
  );
}
