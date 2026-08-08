import React from 'react'

export default function VolunteerDashboard(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">Volunteer Dashboard</h1>
      <p className="mt-1 text-sm text-slate-600">Assigned tasks, events and certificates.</p>

      <div className="mt-4 space-y-3">
        <div className="rounded-xl border p-4">Assigned Task: Community outreach</div>
        <div className="rounded-xl border p-4">Next Event: Orientation • 5 Sep</div>
      </div>
    </div>
  )
}
