import React from 'react'
import { useLanguage } from '../i18n'

export default function WardDashboard(){
  const { t } = useLanguage()
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t('Ward Dashboard')}</h1>
      <p className="mt-1 text-sm text-slate-600">{t('Members, volunteers and issue analytics for a ward.')}</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4">{t('Total Members')}<br/><span className="font-semibold">1,240</span></div>
        <div className="rounded-2xl border p-4">{t('Volunteers')}<br/><span className="font-semibold">84</span></div>
        <div className="rounded-2xl border p-4">{t('Pending Issues')}<br/><span className="font-semibold">12</span></div>
      </div>
    </div>
  )
}
