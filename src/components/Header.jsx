import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/jansuraj_logo.png'
import userFemale from '../assets/user_female.jpg'

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(null)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const menuRef = useRef(null)

  useEffect(() => {
    const stored = localStorage.getItem('jansuraaj_user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setLoggedIn(true)
      setUser(parsed)
    }
  }, [])

  useEffect(() => {
    function refreshUser() {
      const s = localStorage.getItem('jansuraaj_user')
      if (s) {
        setLoggedIn(true)
        setUser(JSON.parse(s))
      } else {
        setLoggedIn(false)
        setUser(null)
      }
    }

    // respond to cross-window storage changes and in-window custom events
    window.addEventListener('storage', refreshUser)
    window.addEventListener('jansuraaj_user_change', refreshUser)
    return () => {
      window.removeEventListener('storage', refreshUser)
      window.removeEventListener('jansuraaj_user_change', refreshUser)
    }
  }, [])

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('jansuraaj_user')
    setLoggedIn(false)
    setUser(null)
    setMenuOpen(false)
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
          <Link to="/purpose" className="text-sm text-slate-600 hover:text-slate-900">
            Purpose
          </Link>
          <Link to="/issues" className="text-sm text-slate-600 hover:text-slate-900">
            Issues
          </Link>
          <Link to="/notifications" className="text-sm text-slate-600 hover:text-slate-900">
            Alerts
          </Link>
          <Link to="/bihar-dashboard" className="text-sm text-slate-600 hover:text-slate-900">
            Dashboard
          </Link>
          <Link to="/search" className="text-sm text-slate-600 hover:text-slate-900">
            Search
          </Link>
        </nav>

        <div className="flex items-center gap-3" ref={menuRef}>
          {!loggedIn ? (
            <Link
              to="/login"
              className="rounded-full border border-slate-200/60 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-slate-300"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-2 py-1 transition hover:border-slate-300"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200">
                  <img
                    src={user?.photo || userFemale}
                    alt={user?.name ? `${user.name} avatar` : 'User avatar'}
                    className="h-full w-full object-cover"
                  />
                </span>
                <span className="hidden text-sm font-medium text-slate-700 md:inline-block pr-4">
                  {user?.name || 'Mamta Kumari'}
                </span>
                <span className="flex items-center gap-1 text-xl leading-none text-slate-600 pr-2">
                  <span>·</span>
                  <span>·</span>
                  <span>·</span>
                </span>
              </button>

              <div
                className={`absolute right-0 mt-2 w-48 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition ${menuOpen ? 'block' : 'hidden'}`}
              >
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Profile
                </Link>
                <Link
                  to="/notifications"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Notifications
                </Link>
                <Link
                  to="/bihar-dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-slate-50"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
