import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import joinImage from '../assets/jansuraj_join_image.png'
import mobileJoinImage from '../assets/mobile_view_login_image.png'
import logo from '../assets/jansuraj_logo.png'

export default function Landing() {
  const navigate = useNavigate()

  useEffect(() => {
    const stored = localStorage.getItem('jansuraj_user')
    if (stored) {
      navigate('/home')
    }
  }, [navigate])

  return (
    <div className="h-[calc(100vh-72px)] md:px-4 md:py-[7vh] px-0 py-0">
      <div className="mx-auto w-full md:max-w-[55vw] md:min-w-[300px] overflow-hidden md:rounded-[12px]">
        <div className="relative">
          <img
            src={joinImage}
            alt="Jansuraaj"
            className="hidden h-full w-full min-h-[420px] object-cover md:block"
          />
          <img
            src={mobileJoinImage}
            alt="Jansuraaj mobile"
            className="h-full w-full min-h-[420px] object-cover md:hidden"
          />
          <div className="absolute inset-x-0 bottom-24 max-[1300px]:bottom-14 px-3 py-3">
            <div className="grid md:flex md:justify-center md:items-center w-[95%] mx-auto justify-items-center gap-2">
              <Link to="/join" className="w-full max-w-[360px] mx-auto">
                <div className="flex items-center gap-4 rounded-2xl px-4 py-3 min-h-[64px] bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg hover:shadow-2xl transform transition hover:-translate-y-1">
                  <img src={logo} alt="Jansuraaj" className="h-12 w-12 rounded-full bg-white/20 p-1" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">Join Jansuraaj</div>
                    <div className="mt-1 text-xs opacity-90">सदस्य प्रोफ़ाइल बनाने और सत्यापन के लिए Join करें।</div>
                  </div>                 
                </div>
              </Link>

              <Link to="/login" className="w-full max-w-[340px] mx-auto">
                <div className="flex items-center gap-4 rounded-2xl px-4 py-3 min-h-[64px] bg-white border border-slate-200 shadow-sm hover:shadow-md transform transition hover:-translate-y-1">
                  <img src={logo} alt="Jansuraaj" className="h-12 w-12 rounded-full bg-slate-100 p-1" />
                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">Login to Jansuraaj</div>
                    <div className="mt-1 text-xs text-slate-600">Issue दर्ज करने के लिए Login करें</div>
                  </div>                  
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
