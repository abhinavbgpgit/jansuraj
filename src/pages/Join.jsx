import React, {  useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ProgressStepper from '../components/ProgressStepper'
import MapPicker from '../components/MapPicker'
import addressData from '../data/addressData'
import { auth, db } from "../firebase/firebase";

import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function Join() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    photo: null,
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
 const [errors, setErrors] = useState({});

const [authError, setAuthError] = useState("");
const [saving, setSaving] = useState(false);
const [verifiedUser, setVerifiedUser] = useState(null);


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

  useEffect(() => {
  const user = auth.currentUser;

  if (!user) {
    // User directly /join खोल रहा है
    // और login नहीं किया है
    navigate("/login", {
      replace: true,
    });

    return;
  }

  // Login में OTP already verified है
  setVerifiedUser(user);

  // Firebase से verified phone
  if (user.phoneNumber) {
    setForm((previous) => ({
      ...previous,
      phone: user.phoneNumber.replace(
        "+91",
        ""
      ),
    }));
  }
}, [navigate]);

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
  setAuthError("");

  setStep((s) =>
    Math.max(1, s - 1)
  );
}

  // function sendOtp(e) {
  //   e.preventDefault()
  //   setAuthError('')
  //   if (!validateStep(4)) return

  //   const code = Math.floor(100000 + Math.random() * 900000).toString()
  //   setSentCode(code)
  //   setAuthStage('otp')
  // }

  // function verifyOtp(e) {
  //   e.preventDefault()
  //   setAuthError('')
  //   if (!otp.trim()) {
  //     setAuthError('Please enter the OTP.')
  //     return
  //   }
  //   if (otp !== sentCode) {
  //     setAuthError('OTP does not match. Please try again.')
  //     return
  //   }

  //   const normalized = form.phone.replace(/\D/g, '')
  //   const member = {
  //     ...form,
  //     phone: normalized,
  //     registeredAt: Date.now(),
  //   }

  //   localStorage.setItem('jansuraaj_member', JSON.stringify(member))
  //   localStorage.setItem('jansuraaj_user', JSON.stringify({ phone: normalized, loggedInAt: Date.now() }))
  //   navigate('/home')
  // }
async function createAccount(e) {
  e.preventDefault();

  setAuthError("");

  // ------------------------------------------
  // Firebase user check
  // ------------------------------------------

  const user =
    auth.currentUser;

  if (!user) {
    setAuthError(
      "Your login session has expired. Please login again."
    );

    navigate("/login", {
      replace: true,
    });

    return;
  }

  // ------------------------------------------
  // Validate all details
  // ------------------------------------------

  if (!validateStep(2)) {
    setStep(2);
    return;
  }

  if (!validateStep(3)) {
    setStep(3);
    return;
  }

  if (!validateStep(4)) {
    setStep(4);
    return;
  }

  try {
    setSaving(true);

    // ------------------------------------------
    // Firestore reference
    // users/{firebase UID}
    // ------------------------------------------

    const userRef = doc(
      db,
      "users",
      user.uid
    );

    // ------------------------------------------
    // User data
    // ------------------------------------------

    const userData = {
      uid: user.uid,

      phone:
        user.phoneNumber ||
        `+91${form.phone.replace(
          /\D/g,
          ""
        )}`,

      // Personal details
      name: form.name.trim(),

      education:
        form.education.trim(),

      profession:
        form.profession.trim(),

      skills:
        form.skills.trim(),

      social:
        form.social.trim(),

      // Address
      district:
        form.district,

      block:
        form.block,

      panchayat:
        form.panchayat,

      village:
        form.village,

      ward:
        form.ward,

      // Map location
      location: form.location
        ? {
            lat: form.location.lat,
            lng: form.location.lng,
          }
        : null,

      // Photo name for now
      profilePhotoName:
        form.photo
          ? form.photo.name
          : null,

      // Account
      role: "member",

      status: "active",

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    };

    // ------------------------------------------
    // SAVE TO FIRESTORE
    // ------------------------------------------

    await setDoc(
      userRef,
      userData
    );

    // ------------------------------------------
    // Local login info
    // ------------------------------------------

    localStorage.setItem(
      "jansuraaj_user",
      JSON.stringify({
        uid: user.uid,

        phone:
          user.phoneNumber ||
          `+91${form.phone.replace(
            /\D/g,
            ""
          )}`,

        name: form.name,

        loggedIn: true,
      })
    );

    // ------------------------------------------
    // Success
    // ------------------------------------------

    alert(
      "Welcome to Jansuraaj!"
    );

    // ------------------------------------------
    // HOME
    // ------------------------------------------

    navigate("/", {
      replace: true,
    });

  } catch (error) {
    console.error(
      "Create account error:",
      error
    );

    setAuthError(
      error.message ||
        "Failed to create account."
    );

  } finally {
    setSaving(false);
  }
}
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Join Jansuraaj</h1>
        <p className="mt-1 text-sm text-slate-600">Create your member profile and verify your phone for login.</p>
        <div className="mt-4">
          <ProgressStepper step={step} max={4} />
        </div>

        <div className="mt-4 space-y-4">
          {step === 1 && (
            <div>
              <label className="block text-sm">Profile Photo (optional)</label>
              <div className="mt-2 flex items-center gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-slate-100">
                  {form.photo ? <img src={URL.createObjectURL(form.photo)} alt="profile" className="h-full w-full object-cover" /> : null}
                </div>
                <div>
                  <input type="file" accept="image/*" onChange={(e) => update('photo', e.target.files && e.target.files[0])} />
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
    {/* ================================
        STEP 4 - MOBILE VERIFIED
    ================================= */}

    <h3 className="block text-sm font-semibold text-slate-900">
      Verify your phone
    </h3>

    <p className="mt-2 text-sm text-slate-600">
      यह नंबर आपके लॉगिन और OTP verification
      के लिए उपयोग होगा।
    </p>

    {/* ================================
        VERIFIED PHONE
    ================================= */}

    <div className="mt-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-5">

      <div className="flex items-center gap-3">

        {/* CHECK ICON */}

        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500 text-lg font-bold text-white">
          ✓
        </div>

        {/* PHONE DETAILS */}

        <div>

          <p className="font-semibold text-emerald-800">
            Mobile Number Verified
          </p>

          <p className="mt-1 text-sm text-emerald-700">
            {verifiedUser?.phoneNumber ||
              `+91${form.phone}`}
          </p>

        </div>

      </div>

      <p className="mt-4 text-sm leading-6 text-emerald-700">
        आपका mobile number OTP के द्वारा
        successfully verify हो चुका है।
        अब नीचे दिए गए button से अपना
        Jansuraaj account create करें।
      </p>

    </div>

    {/* ================================
        REGISTRATION SUMMARY
    ================================= */}

    <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">

      <p className="text-sm font-semibold text-slate-800">
        Registration Summary
      </p>

      <div className="mt-4 space-y-3 text-sm text-slate-600">

        {/* NAME */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Name
          </span>

          <span className="text-right">
            {form.name || "Not provided"}
          </span>
        </div>

        {/* EDUCATION */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Education
          </span>

          <span className="text-right">
            {form.education || "Not provided"}
          </span>
        </div>

        {/* PROFESSION */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Profession
          </span>

          <span className="text-right">
            {form.profession || "Not provided"}
          </span>
        </div>

        {/* DISTRICT */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            District
          </span>

          <span className="text-right">
            {form.district || "Not provided"}
          </span>
        </div>

        {/* BLOCK */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Block
          </span>

          <span className="text-right">
            {form.block || "Not provided"}
          </span>
        </div>

        {/* PANCHAYAT */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Panchayat
          </span>

          <span className="text-right">
            {form.panchayat || "Not provided"}
          </span>
        </div>

        {/* VILLAGE */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Village
          </span>

          <span className="text-right">
            {form.village || "Not provided"}
          </span>
        </div>

        {/* WARD */}

        <div className="flex justify-between gap-4">
          <span className="font-medium text-slate-700">
            Ward
          </span>

          <span className="text-right">
            {form.ward || "Not provided"}
          </span>
        </div>

      </div>

    </div>

    {/* ================================
        ERROR
    ================================= */}

    {authError && (
      <div className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-rose-600">
        {authError}
      </div>
    )}

    {/* ================================
        CREATE ACCOUNT BUTTON
    ================================= */}

    <button
      type="button"
      onClick={createAccount}
      disabled={saving}
      className="mt-5 w-full rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {saving
        ? "Creating Account..."
        : "Create Account & Join Jansuraaj"}
    </button>

  </div>
)}

{/* ====================================================
    STEP NAVIGATION
===================================================== */}

<div className="mt-6 flex items-center gap-3">

  {/* BACK BUTTON */}

  {step > 1 && (
    <button
      type="button"
      onClick={prev}
      disabled={saving}
      className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
    >
      Back
    </button>
  )}

  {/* NEXT BUTTON */}

  {step < 4 && (
    <button
      type="button"
      onClick={next}
      className="rounded-full bg-sky-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-sky-700"
    >
      Next
    </button>
  )}

</div>

</div>
</div>
</div>
);
}
