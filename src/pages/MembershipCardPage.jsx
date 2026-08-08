import React from 'react'
import MembershipCardComponent from '../components/MembershipCardComponent'

export default function MembershipCardPage(){
  const member = { name: 'Sushila Devi', id: 'JNB-2026-001', ward: 'Ward 7', district: 'Patna' }
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">Membership Card</h1>
      <p className="mt-1 text-sm text-slate-600">Your digital membership card with QR code.</p>
      <div className="mt-4">
        <MembershipCardComponent member={member} />
      </div>
    </div>
  )
}
