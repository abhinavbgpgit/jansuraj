import React from 'react'

export default function BiharDashboard(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">Bihar Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Interactive map and district analytics (placeholder).</p>

      <div className="mt-4 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border p-4">Interactive Map (placeholder)</div>
        <div className="rounded-2xl border p-4">District Cards</div>
        <div className="rounded-2xl border p-4">Heatmap & Charts</div>
      </div>
    </div>
  )
}
