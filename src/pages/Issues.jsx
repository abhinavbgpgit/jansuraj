import React from 'react'
import { issues } from '../data/issues'
import { Link } from 'react-router-dom'

export default function Issues() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">सभी समस्याएँ</h1>
          <p className="mt-2 text-sm text-slate-600">यहाँ वार्ड की सभी समस्याएँ एक साथ दिखाई देंगी।</p>
        </div>
        <Link
          to="/report"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          नई समस्या दर्ज करें
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {issues.map((issue) => (
          <Link
            key={issue.id}
            to={`/issues/${issue.id}`}
            className="group rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
          >
            <div className="mb-3 flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{issue.statusText}</span>
              <span className="text-xs text-slate-500">{issue.days}</span>
            </div>
            <h2 className="text-lg font-bold leading-7 text-slate-900 group-hover:text-sky-600">{issue.title}</h2>
            <p className="mt-3 text-sm text-slate-600">{issue.location}</p>
            <p className="mt-4 text-sm text-slate-700 line-clamp-3">{issue.description}</p>
            <div className="mt-5 flex items-center justify-between text-sm font-semibold text-slate-700">
              <span>{issue.progress}/4 चरण पूरा</span>
              <span className="text-sky-600">विस्तार देखें →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
