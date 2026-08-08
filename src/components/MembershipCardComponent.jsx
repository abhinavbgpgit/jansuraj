import React from 'react'

export default function MembershipCardComponent({ member = {} }) {
  const { name = 'Your Name', id = 'JNB-0001', ward = 'Ward 1', district = 'Patna' } = member
  return (
    <div className="mx-auto max-w-md rounded-2xl bg-white/60 p-4 shadow-md border border-slate-100">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-lg bg-slate-200" />
        <div>
          <div className="text-lg font-semibold">{name}</div>
          <div className="text-xs text-slate-500">{ward} • {district}</div>
          <div className="mt-2 text-xs text-slate-600">Member ID: {id}</div>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-slate-600">Digital Card</div>
        <button className="rounded-full bg-sky-600 px-3 py-2 text-xs text-white">Download PNG</button>
      </div>
    </div>
  )
}
