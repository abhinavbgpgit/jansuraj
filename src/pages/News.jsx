import React from 'react'

import { useLanguage } from "../i18n";

export default function News(){
  const { t } = useLanguage();
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t("News")}</h1>
      <div className="mt-4 space-y-3">
        <div className="rounded-xl border p-4">{t("Featured: Launch of Jansuraaj Bihar")}</div>
        <div className="rounded-xl border p-4">{t("Trending: Road Repairs in Patna")}</div>
      </div>
    </div>
  )
}
