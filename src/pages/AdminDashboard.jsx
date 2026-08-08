import React from 'react'

export default function AdminDashboard(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Member & issue management tools (placeholder).</p>

      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border p-4">Analytics & Charts</div>
        <div className="rounded-2xl border p-4">Member Management Table</div>
      </div>
    </div>
  )
}
