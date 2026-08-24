import React from 'react'
import { useLanguage } from '../i18n'

export default function TransparencyDashboard(){
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t('Transparency Dashboard')}</h1>
      <p className="mt-1 text-sm text-slate-600">{t('Funds, budgets and project progress (placeholder).')}</p>
      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4">{t('MLA Fund')}</div>
        <div className="rounded-2xl border p-4">{t('MP Fund')}</div>
        <div className="rounded-2xl border p-4">{t('Ward Fund')}</div>
      </div>
    </div>
  )
}
