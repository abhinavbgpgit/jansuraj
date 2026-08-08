import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import logo from '../assets/jansuraj_logo.png'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('jansuraaj_user')
    if (stored) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[url('../assets/jansuraj_logo.png')] bg-cover bg-center px-4 py-8 sm:bg-[length:120%]">
      <div className="w-full max-w-3xl rounded-[34px] border border-white/20 bg-white/85 p-8 shadow-[0_40px_120px_rgba(15,23,42,0.15)] backdrop-blur-xl sm:p-12">
        <div className="flex items-center justify-center gap-4">
          <img src={logo} alt="Jansuraaj logo" className="h-20 w-20 rounded-3xl object-cover shadow-xl" />
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Welcome to</p>
            <h1 className="mt-3 text-4xl font-semibold text-slate-950 sm:text-5xl">Join Jansuraaj</h1>
          </div>
        </div>

        <p className="mt-6 text-center text-base leading-7 text-slate-600 sm:text-lg">
          A civic platform for Bihar citizens to report issues, track progress, and connect with local public engagement efforts.
        </p>

        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link to="/login" className="inline-flex items-center justify-center rounded-full bg-[#0ea5a4] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-white shadow-lg shadow-[#0ea5a4]/20 transition hover:bg-[#0bb99b]">
            Join Jansuraaj
          </Link>
          <Link to="/login" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition hover:border-slate-400">
            Login to Jansuraaj
          </Link>
          <Link to="/report" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-slate-700 shadow-sm transition hover:border-slate-400">
            Report Issue
          </Link>
        </div>
      </div>
    </div>
  )
}
