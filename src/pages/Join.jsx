import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressStepper from '../components/ProgressStepper'
import MapPicker from '../components/MapPicker'
import addressData from '../data/addressData'

export default function Join() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    photo: '',
    name: '',
    education: '',
    profession: '',
    skills: '',
    social: '',
    aadhaar: '',
    district: '',
    block: '',
    panchayat: '',
    village: '',
    ward: '',
    location: null,
    phone: '',
  })
  const [errors, setErrors] = useState({})
  const [otp, setOtp] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [authStage, setAuthStage] = useState('phone')
  const [authError, setAuthError] = useState('')

  const districts = useMemo(() => Object.keys(addressData), [])
  const blocks = useMemo(() => (form.district ? Object.keys(addressData[form.district].blocks) : []), [form.district])
  const panchayats = useMemo(() => (form.district && form.block ? Object.keys(addressData[form.district].blocks[form.block].panchayats) : []), [form.district, form.block])
  const villages = useMemo(() => (form.district && form.block && form.panchayat ? Object.keys(addressData[form.district].blocks[form.block].panchayats[form.panchayat].villages) : []), [form.district, form.block, form.panchayat])
  const wards = useMemo(() => (form.district && form.block && form.panchayat && form.village ? addressData[form.district].blocks[form.block].panchayats[form.panchayat].villages[form.village].wards : []), [form.district, form.block, form.panchayat, form.village])

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
    if (field === 'phone') {
      setAuthError('')
    }
  }

  function readFileAsDataURL(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  async function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0]
    if (!file) return
    const dataUrl = await readFileAsDataURL(file)
    update('photo', dataUrl)
  }

  function validateStep(s) {
    const nextErrors = {}
    if (s === 1) {
      // profile photo optional
    }
    if (s === 2) {
      if (!form.name) nextErrors.name = 'Full name is required'
    }
    if (s === 3) {
      if (!form.district) nextErrors.district = 'Select district'
      if (!form.ward) nextErrors.ward = 'Select ward'
    }
    if (s === 4) {
      const normalized = form.phone.replace(/\D/g, '')
      if (normalized.length !== 10) nextErrors.phone = 'Please enter a valid 10-digit phone number.'
    }
    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function next() {
    if (validateStep(step)) setStep((s) => Math.min(4, s + 1))
  }

  function prev() {
    if (step === 1) {
      navigate('/')
      return
    }
    if (step === 4) {
      setAuthStage('phone')
      setOtp('')
      setSentCode('')
      setAuthError('')
    }
    setStep((s) => Math.max(1, s - 1))
  }

  function sendOtp(e) {
    e.preventDefault()
    setAuthError('')
    if (!validateStep(4)) return

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    setSentCode(code)
    setAuthStage('otp')
  }

  function verifyOtp(e) {
    e.preventDefault()
    setAuthError('')
    if (!otp.trim()) {
      setAuthError('Please enter the OTP.')
      return
    }
    if (otp !== sentCode) {
      setAuthError('OTP does not match. Please try again.')
      return
    }

    const normalized = form.phone.replace(/\D/g, '')
    const member = {
      ...form,
      phone: normalized,
      registeredAt: Date.now(),
    }

    localStorage.setItem('jansuraaj_member', JSON.stringify(member))
    localStorage.setItem(
      'jansuraaj_user',
      JSON.stringify({
        phone: normalized,
        name: form.name,
        photo: form.photo,
        loggedInAt: Date.now(),
      })
    )
    // notify other windows/components about the login change
    try {
      window.dispatchEvent(new Event('jansuraaj_user_change'))
    } catch (e) {
      /* ignore in non-window environments */
    }
    navigate('/home')
  }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-8 font-sans">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Join Jansuraaj</h1>
        <p className="mt-1 text-sm font-normal text-slate-600">Create your member profile and verify your phone for login.</p>
        <div className="mt-4">
          <ProgressStepper step={step} max={4} />
        </div>

        <div className="mt-4 space-y-4">
          {step === 1 && (
           <div>
  <label className="block text-sm font-semibold text-slate-700">
    Profile Photo
    <span className="ml-1 text-xs font-normal text-slate-400">(optional)</span>
  </label>

  <div className="mt-3 flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4">
    {/* Profile Preview */}
    <div className="relative shrink-0">
      <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
        {form.photo ? (
          <img
            src={form.photo}
            alt="Profile"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Camera badge */}
      <label
        htmlFor="profile-photo"
        className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
        title="Change photo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 7.5h1.386a1.5 1.5 0 001.342-.83l.474-.95A1.5 1.5 0 0111.294 4.5h1.412a1.5 1.5 0 011.342.83l.474.95a1.5 1.5 0 001.342.83h1.386A2.25 2.25 0 0119.5 9.75v7.5a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25v-7.5A2.25 2.25 0 016.75 7.5z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>
      </label>
    </div>

    {/* Upload Area */}
    <div className="min-w-0">
      <label
        htmlFor="profile-photo"
        className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 16.5V3.75m0 0L7.5 8.25M12 3.75l4.5 4.5M4.5 15.75v1.5A3 3 0 007.5 20.25h9a3 3 0 003-3v-1.5"
          />
        </svg>

        {form.photo ? "Change Photo" : "Upload Photo"}
      </label>

      <input
        id="profile-photo"
        type="file"
        accept="image/*"
        onChange={handlePhotoChange}
        className="hidden"
      />

      <p className="mt-2 text-xs text-slate-400">
        JPG, PNG or WEBP · Max 5MB
      </p>
    </div>
  </div>
</div>
          )}

          {step === 2 && (
            <div>
              <label className="block text-sm">Personal Information</label>
              <input className="mt-2 w-full rounded border p-2" placeholder="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} />
              {errors.name ? <div className="mt-1 text-xs text-rose-600">{errors.name}</div> : null}

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input className="rounded border p-2" placeholder="Education" value={form.education} onChange={(e)=> update('education', e.target.value)} />
                <input className="rounded border p-2" placeholder="Profession" value={form.profession} onChange={(e)=> update('profession', e.target.value)} />
              </div>

              <input className="mt-3 w-full rounded border p-2" placeholder="Skills (comma separated)" value={form.skills} onChange={(e)=> update('skills', e.target.value)} />
              <input className="mt-3 w-full rounded border p-2" placeholder="Social links (optional)" value={form.social} onChange={(e)=> update('social', e.target.value)} />

              <input className="mt-3 w-full rounded border p-2" placeholder="Aadhaar (optional)" value={form.aadhaar} onChange={(e)=> update('aadhaar', e.target.value)} />
            </div>
          )}

          {step === 3 && (
            <div>
              <label className="block text-sm">Address</label>
              <div className="mt-2 grid gap-2 sm:grid-cols-2">
                <select className="rounded border p-2" value={form.district} onChange={(e)=>{ update('district', e.target.value); update('block',''); update('panchayat',''); update('village',''); update('ward','') }}>
                  <option value="">Select District</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>

                <select className="rounded border p-2" value={form.block} onChange={(e)=>{ update('block', e.target.value); update('panchayat',''); update('village',''); update('ward','') }}>
                  <option value="">Select Block</option>
                  {blocks.map(b => <option key={b} value={b}>{b}</option>)}
                </select>

                <select className="rounded border p-2" value={form.panchayat} onChange={(e)=>{ update('panchayat', e.target.value); update('village',''); update('ward','') }}>
                  <option value="">Select Panchayat</option>
                  {panchayats.map(p => <option key={p} value={p}>{p}</option>)}
                </select>

                <select className="rounded border p-2" value={form.village} onChange={(e)=>{ update('village', e.target.value); update('ward','') }}>
                  <option value="">Select Village</option>
                  {villages.map(v => <option key={v} value={v}>{v}</option>)}
                </select>

                <select className="rounded border p-2" value={form.ward} onChange={(e)=> update('ward', e.target.value)}>
                  <option value="">Select Ward</option>
                  {wards.map(w => <option key={w} value={w}>{w}</option>)}
                </select>

              </div>
              {errors.district ? <div className="mt-1 text-xs text-rose-600">{errors.district}</div> : null}
              {errors.ward ? <div className="mt-1 text-xs text-rose-600">{errors.ward}</div> : null}

              <div className="mt-4">
                <MapPicker initialPosition={[25.6,85.1]} onLocationSelect={(loc)=> update('location', loc)} />
                {form.location ? <div className="mt-2 text-xs text-slate-600">Picked: {form.location.lat.toFixed(4)}, {form.location.lng.toFixed(4)}</div> : null}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="block text-sm font-semibold">Verify your phone</h3>
              <p className="mt-2 text-sm text-slate-600">यह नंबर आपके लॉगिन और OTP verification के लिए उपयोग होगा।</p>

              {authStage === 'phone' ? (
                <form onSubmit={sendOtp} className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <label className="block text-sm font-medium text-slate-700">Phone number</label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-sm text-slate-500">+91</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update('phone', e.target.value)}
                      placeholder="98765 43210"
                      className="w-full border-none bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                  {errors.phone ? <div className="text-xs text-rose-600">{errors.phone}</div> : null}
                  <button type="submit" className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b]">
                    Send OTP
                  </button>
                </form>
              ) : (
                <form onSubmit={verifyOtp} className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <p className="text-sm text-slate-600">OTP sent to +91 {form.phone.replace(/\D/g, '')}</p>
                    <p className="mt-2 text-sm text-slate-500">Your verification code is <span className="font-semibold text-slate-900">{sentCode}</span>.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">Enter OTP</label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  {authError ? <div className="text-xs text-rose-600">{authError}</div> : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStage('phone')
                        setOtp('')
                        setSentCode('')
                        setAuthError('')
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      Change number
                    </button>
                    <button type="submit" className="rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b]">
                      Verify OTP & Join
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={prev} className="rounded-full border px-4 py-2">Back</button>
          {step < 4 ? (
            <button onClick={next} className="rounded-full bg-sky-600 px-4 py-2 text-white">Next</button>
          ) : (
            <button onClick={authStage === 'phone' ? sendOtp : verifyOtp} className="rounded-full bg-emerald-600 px-4 py-2 text-white">
              {authStage === 'phone' ? 'Send OTP' : 'Verify OTP & Join'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
