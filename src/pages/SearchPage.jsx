import React from 'react'

export default function SearchPage(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-6">
      <h1 className="text-xl font-semibold">Search</h1>
      <p className="mt-1 text-sm text-slate-600">Search across districts, wards, members and issues.</p>
      <div className="mt-4 rounded-xl border p-4">
        <input className="w-full rounded border p-2" placeholder="Search..." />
      </div>
    </div>
  )
}
