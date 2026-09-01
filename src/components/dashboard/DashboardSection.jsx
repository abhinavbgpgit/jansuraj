import React from "react";
import { Link } from "react-router-dom";

// ==========================================
// Shared card shell for every dashboard section.
// Title + subtitle + optional "See All" link,
// baaki sab section apna content children ke
// through pass karte hain.
// ==========================================
export default function DashboardSection({
  icon,
  title,
  subtitle,
  seeAllTo,
  right,
  children,
}) {
  return (
    <section className="rounded-[24px] border border-[#E5E0D5] bg-white p-5 shadow-[0_12px_28px_rgba(23,35,29,.05)] sm:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-[#17231D] sm:text-xl">
            {icon && <span>{icon}</span>}
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-sm text-[#6B766F]">{subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {right}

          {seeAllTo && (
            <Link
              to={seeAllTo}
              className="text-xs font-extrabold text-[#176B4D] transition-colors hover:text-[#D97706]"
            >
              सभी देखें →
            </Link>
          )}
        </div>
      </div>

      {children}
    </section>
  );
}
