import React from "react";
import { useLanguage } from "../i18n";

function IssueSuccessModal({ onReportAnother, onDashboard }) {
  const { t } = useLanguage();
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            {t("Your issue has been submitted!")}
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {t("Your issue was recorded successfully.")}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {t("You can report another issue or go to the dashboard.")}
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReportAnother}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {t("Report Another")}
          </button>

          <button
            type="button"
            onClick={onDashboard}
            className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            {t("Go to Dashboard")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueSuccessModal;
