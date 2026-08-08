import React from 'react'
import MembershipCardComponent from '../components/MembershipCardComponent'

export default function Profile(){
  const user = { name: 'You', id: 'JNB-0001', ward: 'Ward 1', district: 'Patna' }
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Profile</h1>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        <div>
          <MembershipCardComponent member={user} />
        </div>
        <div>
          <div className="rounded-xl border p-4">Reported Issues</div>
          <div className="mt-3 rounded-xl border p-4">Volunteer History</div>
        </div>
      </div>
    </div>
  )
}
