import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import joinImage from '../assets/jansuraj_join_image.png'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('jansuraaj_user')
    if (stored) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="h-[calc(100vh-72px)]  px-4 py-[7vh]">
      <div className="mx-auto w-full max-w-[55vw] min-w-[300px] overflow-hidden rounded-[12px] ">
        <div className="relative">
          <img src={joinImage} alt="Jansuraaj" className="h-full w-full min-h-[420px] object-cover" />
          <div className="absolute inset-x-0 bottom-24 max-[1300px]:bottom-14 px-3 py-3">
            <div className="grid md:grid-cols-3  w-[95%] mx-auto">
              <Link
                to="/join"
                className="inline-flex w-full max-w-[250px] mx-auto min-h-[40px] items-center justify-center rounded-full border border-slate-200 bg-[#0ea5a4] px-3 py-2 text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition hover:bg-[#0bb99b]"
              >
                Join Jansuraaj
              </Link>
              <Link
                to="/login"
                className="inline-flex w-full max-w-[250px] mx-auto min-h-[40px] items-center justify-center rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-900 transition hover:bg-white"
              >
                Login to Jansuraaj
              </Link>
              <Link
                to="/report"
                className="inline-flex w-full max-w-[250px] mx-auto min-h-[40px] items-center justify-center rounded-full border border-slate-200 bg-white/90 px-3 py-2 text-[10px] sm:text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-900 transition hover:bg-white"
              >
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
