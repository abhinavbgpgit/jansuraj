import React from 'react'
import { useLanguage } from '../i18n'

export default function ProgressStepper({ step = 1, max = 4 }) {
  const { t } = useLanguage()
  const percent = Math.round((step / max) * 100)
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-slate-600">
        <span>{t('Step {step} of {max}', { step, max })}</span>
        <span>{percent}%</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-200">
        <div className="h-full rounded-full bg-sky-600" style={{ width: `${percent}%` }} />
      </div>
    </div>
  )
}
