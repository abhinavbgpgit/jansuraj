import React from 'react'

import { useLanguage } from "../i18n";

export default function Events(){
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t("Events")}</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border p-4">{t("Community Meeting - Patna")}</div>
        <div className="rounded-xl border p-4">{t("Volunteer Drive - Gaya")}</div>
      </div>
    </div>
  )
}
