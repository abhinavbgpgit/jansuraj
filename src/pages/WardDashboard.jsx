import React from 'react'

export default function WardDashboard(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">Ward Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Members, volunteers and issue analytics for a ward.</p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border p-4">Total Members<br/><span className="font-semibold">1,240</span></div>
        <div className="rounded-2xl border p-4">Volunteers<br/><span className="font-semibold">84</span></div>
        <div className="rounded-2xl border p-4">Pending Issues<br/><span className="font-semibold">12</span></div>
      </div>
    </div>
  )
}
