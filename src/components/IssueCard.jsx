import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n'

export default function IssueCard({ issue = {} }) {
  const { t } = useLanguage()
  const { id = '1', title = 'Pothole on main road', ward = 'Ward 3', category = 'Infrastructure', status = 'Open' } = issue
  return (
    <article className="rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm">
      <div className="h-40 rounded-lg bg-slate-200" />
      <h3 className="mt-3 text-lg font-semibold text-slate-900">{title}</h3>
      <div className="mt-1 flex items-center gap-3 text-xs text-slate-600">
        <span>{ward}</span>
        <span className="rounded-full bg-slate-100 px-2 py-0.5">{category}</span>
        <span className={`ml-auto font-medium ${status === 'Resolved' ? 'text-emerald-600' : 'text-amber-600'}`}>{status}</span>
      </div>
      <div className="mt-3 flex items-center gap-3 text-sm text-slate-700">
        <button className="rounded-full bg-sky-600/10 px-3 py-1">{t('Like')}</button>
        <Link to={`/issues/${id}`} className="text-sky-600">{t('View')}</Link>
      </div>
    </article>
  )
}
