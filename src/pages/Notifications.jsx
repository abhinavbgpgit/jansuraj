import React from 'react'

export default function Notifications(){
  const notes = [
    'Issue #12 updated',
    'Event reminder: Patna meeting',
    'Your membership approved'
  ]
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Notifications</h1>
      <div className="mt-3 space-y-2">
        {notes.map((n,i)=> <div key={i} className="rounded-xl border p-3">{n}</div>)}
      </div>
    </div>
  )
}
