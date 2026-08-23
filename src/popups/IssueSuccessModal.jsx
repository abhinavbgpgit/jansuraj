import React from "react";

function IssueSuccessModal({ onReportAnother, onDashboard }) {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <span className="text-3xl text-green-600">✓</span>
        </div>

        <div className="mt-4 text-center">
          <h2 className="text-xl font-bold text-slate-800">
            आपका इशू सबमिट हो गया!
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            आपकी समस्या सफलतापूर्वक दर्ज कर ली गई है।
          </p>

          <p className="mt-1 text-sm text-slate-500">
            आप एक और समस्या दर्ज कर सकते हैं या डैशबोर्ड पर जा सकते हैं।
          </p>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onReportAnother}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            एक और समस्या डालें
          </button>

          <button
            type="button"
            onClick={onDashboard}
            className="flex-1 rounded-xl bg-sky-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
          >
            डैशबोर्ड जाएँ
          </button>
        </div>
      </div>
    </div>
  );
}

export default IssueSuccessModal;
