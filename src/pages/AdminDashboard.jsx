import React from 'react'

import { useLanguage } from "../i18n";

export default function AdminDashboard(){
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t("Admin Dashboard")}</h1>
      <p className="mt-1 text-sm text-slate-600">{t("Member & issue management tools (placeholder).")}</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-4">{t("Analytics & Charts")}</div>
        <div className="rounded-2xl border p-4">{t("Member Management Table")}</div>
      </div>
    </div>
  )
}
