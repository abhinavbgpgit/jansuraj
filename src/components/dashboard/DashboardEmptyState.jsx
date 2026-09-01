import React from "react";

// ==========================================
// Jab backend endpoint abhi maujood nahi hai
// ya data khaali hai, tab ye dikhta hai —
// fake/mock number dikhane ki jagah.
// ==========================================
export default function DashboardEmptyState({
  icon = "📊",
  message = "यह जानकारी जल्द उपलब्ध होगी।",
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#E5E0D5] bg-[#FBF8F1] p-8 text-center">
      <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#EEF6F1] text-lg text-[#176B4D]">
        {icon}
      </div>

      <p className="text-sm font-semibold text-[#17231D]">
        डेटा अभी उपलब्ध नहीं है
      </p>

      <p className="mt-1 text-xs leading-5 text-[#6B766F]">{message}</p>
    </div>
  );
}
