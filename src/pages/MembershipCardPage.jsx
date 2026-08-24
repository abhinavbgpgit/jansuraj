import React from 'react'
import MembershipCardComponent from '../components/MembershipCardComponent'
import { useLanguage } from '../i18n'

export default function MembershipCardPage(){
  const { t } = useLanguage()
  const member = { name: 'Sushila Devi', id: 'JNB-2026-001', ward: 'Ward 7', district: 'Patna' }
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <h1 className="text-xl font-semibold">{t('Membership Card')}</h1>
      <p className="mt-1 text-sm text-slate-600">{t('Your digital membership card with QR code.')}</p>
      <div className="mt-4">
        <MembershipCardComponent member={member} />
      </div>
    </div>
  )
}
