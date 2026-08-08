import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const NavButton = ({ to, label }) => {
  const loc = useLocation()
  const active = loc.pathname === to
  return (
    <Link to={to} className={`flex w-full flex-col items-center gap-1 p-2 text-xs ${active ? 'text-sky-600' : 'text-slate-600'}`}>
      <div className={`h-7 w-7 rounded-lg ${active ? 'bg-sky-100' : 'bg-slate-100'} flex items-center justify-center text-sm`}>●</div>
      <span>{label}</span>
    </Link>
  )
}

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-4 left-0 right-0 z-50 mx-auto max-w-3xl px-4 md:hidden">
      <div className="backdrop-blur-md rounded-2xl border border-slate-200/50 bg-white/60 px-3 py-2 shadow-lg">
        <div className="flex items-center justify-between">
          <NavButton to="/" label="Home" />
          <NavButton to="/issues" label="Issues" />
          <NavButton to="/join" label="Join" />
          <NavButton to="/notifications" label="Alerts" />
          <NavButton to="/profile" label="Profile" />
        </div>
      </div>
    </nav>
  )
}
