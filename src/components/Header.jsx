import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/jansuraj_logo.png'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('jansuraaj_user')
    setLoggedIn(Boolean(stored))
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jansuraaj_user')
    setLoggedIn(false)
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-40 bg-white/60 backdrop-blur-md border-b border-slate-200">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="Jansuraaj logo" className="h-10 w-10 rounded-xl object-cover" />
          <div>
            <div className="text-sm font-semibold">Jansuraaj</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-4 md:flex">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            Home
          </Link>
          <Link to="/issues" className="text-sm text-slate-600 hover:text-slate-900">
            Issues
          </Link>
          <Link to="/notifications" className="text-sm text-slate-600 hover:text-slate-900">
            Alerts
          </Link>
          <Link to="/profile" className="text-sm text-slate-600 hover:text-slate-900">
            Profile
          </Link>
          <Link to="/bihar-dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/search" className="text-sm text-slate-600 hover:text-slate-900">
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/profile" className="rounded-full border border-slate-200/60 px-3 py-1 text-sm text-slate-700">
            Profile
          </Link>
          {loggedIn && (
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full border border-slate-200/60 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-slate-300"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
