import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { getIssueById } from '../data/issues'

export default function IssueDetails() {
  const { id } = useParams()
  const issue = getIssueById(id)

  if (!issue) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">समस्या नहीं मिली</h1>
        <p className="mt-3 text-slate-600">यह समस्या मौजूद नहीं है या पहले ही हल की जा चुकी है।</p>
        <Link
          to="/issues"
          className="mt-6 inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
        >
          सभी समस्याएँ देखें
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{issue.title}</h1>
          <p className="mt-2 text-sm text-slate-600">{issue.location}</p>
        </div>
        <Link
          to="/issues"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          वापस सभी पर जाएँ
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">{issue.statusText}</span>
            <span className="text-sm text-slate-500">{issue.days}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">Progress {issue.progress}/4</span>
          </div>

          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">समस्याओं का विवरण</h2>
            <p className="leading-7">{issue.description}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">कहाँ?</h3>
              <p className="mt-2 text-sm text-slate-600">{issue.location}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="font-semibold text-slate-900">कितने दिन?</h3>
              <p className="mt-2 text-sm text-slate-600">{issue.days}</p>
            </div>
          </div>
        </div>

        <aside className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="rounded-3xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">पब्लिक टाइमलाइन</h3>
            <div className="mt-4 space-y-3 text-sm text-slate-600">
              {issue.timeline?.map((item, index) => (
                <div key={index} className="rounded-2xl border border-slate-200 bg-white p-3">
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-slate-50 p-5">
            <h3 className="text-lg font-semibold text-slate-900">आगामी कदम</h3>
            <p className="mt-3 text-sm text-slate-600">विभाग इस समस्या पर काम कर रहा है और जल्द ही अपडेट साझा किया जाएगा।</p>
          </div>
        </aside>
      </div>
    </div>
  )
}
