import React from 'react'
import MapPicker from '../components/MapPicker'

export default function ReportIssue(){
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Report an Issue</h1>
      <p className="mt-1 text-sm text-slate-600">Upload photos/videos, pick location and submit.</p>

      <div className="mt-4 space-y-4">
        <div className="rounded-xl border p-4">
          <label className="block text-sm">Upload Images</label>
          <input type="file" accept="image/*" multiple className="mt-2" />
        </div>

        <div className="rounded-xl border p-4">
          <label className="block text-sm">Upload Videos</label>
          <input type="file" accept="video/*" multiple className="mt-2" />
        </div>

        <MapPicker />

        <div className="rounded-xl border p-4">
          <label className="block text-sm">Category</label>
          <select className="mt-2 w-full rounded border p-2">
            <option>Infrastructure</option>
            <option>Sanitation</option>
            <option>Health</option>
          </select>
        </div>

        <div className="rounded-xl border p-4">
          <label className="block text-sm">Description</label>
          <textarea className="mt-2 w-full rounded border p-2" rows={4} />
        </div>

        <div className="flex items-center justify-end">
          <button className="rounded-full bg-sky-600 px-4 py-2 text-white">Submit</button>
        </div>
      </div>
    </div>
  )
}
