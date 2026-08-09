import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProgressStepper from "../components/ProgressStepper";
import MapPicker from "../components/MapPicker";
import addressData from "../data/addressData";

import { auth, db } from "../firebase/firebase";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function Join() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    photo: null,
    name: "",
    education: "",
    profession: "",
    skills: "",
    social: "",
    aadhaar: "",
    district: "",
    block: "",
    panchayat: "",
    village: "",
    ward: "",
    location: null,
    phone: "",
  });

  const [errors, setErrors] = useState({});

  const [otp, setOtp] = useState("");
  const [authStage, setAuthStage] = useState("phone");
  const [authError, setAuthError] = useState("");

  const [confirmationResult, setConfirmationResult] = useState(null);
  const [saving, setSaving] = useState(false);

  const districts = useMemo(
    () => Object.keys(addressData),
    []
  );

  const blocks = useMemo(
    () =>
      form.district
        ? Object.keys(addressData[form.district].blocks)
        : [],
    [form.district]
  );

  const panchayats = useMemo(
    () =>
      form.district && form.block
        ? Object.keys(
            addressData[form.district].blocks[form.block]
              .panchayats
          )
        : [],
    [form.district, form.block]
  );

  const villages = useMemo(
    () =>
      form.district &&
      form.block &&
      form.panchayat
        ? Object.keys(
            addressData[form.district].blocks[form.block]
              .panchayats[form.panchayat].villages
          )
        : [],
    [form.district, form.block, form.panchayat]
  );

  const wards = useMemo(
    () =>
      form.district &&
      form.block &&
      form.panchayat &&
      form.village
        ? addressData[form.district].blocks[form.block]
            .panchayats[form.panchayat].villages[
            form.village
          ].wards
        : [],
    [
      form.district,
      form.block,
      form.panchayat,
      form.village,
    ]
  );

  function update(field, value) {
    setForm((f) => ({
      ...f,
      [field]: value,
    }));

    setErrors((e) => ({
      ...e,
      [field]: undefined,
    }));

    if (field === "phone") {
      setAuthError("");
    }
  }

  // ------------------------------------------
  // CLEANUP FIREBASE RECAPTCHA
  // ------------------------------------------

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log("reCAPTCHA cleanup error:", error);
        }

        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // ------------------------------------------
  // VALIDATION
  // ------------------------------------------

  function validateStep(s) {
    const nextErrors = {};

    if (s === 1) {
      // profile photo optional
    }

    if (s === 2) {
      if (!form.name) {
        nextErrors.name = "Full name is required";
      }
    }

    if (s === 3) {
      if (!form.district) {
        nextErrors.district = "Select district";
      }

      if (!form.ward) {
        nextErrors.ward = "Select ward";
      }
    }

    if (s === 4) {
      const normalized = form.phone.replace(/\D/g, "");

      if (normalized.length !== 10) {
        nextErrors.phone =
          "Please enter a valid 10-digit phone number.";
      }
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  // ------------------------------------------
  // NEXT
  // ------------------------------------------

  function next() {
    if (validateStep(step)) {
      setStep((s) => Math.min(4, s + 1));
    }
  }

  // ------------------------------------------
  // BACK
  // ------------------------------------------

  function prev() {
    if (step === 4) {
      setAuthStage("phone");
      setOtp("");
      setConfirmationResult(null);
      setAuthError("");

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log("reCAPTCHA clear error:", error);
        }

        window.recaptchaVerifier = null;
      }
    }

    setStep((s) => Math.max(1, s - 1));
  }

  // ------------------------------------------
  // SEND FIREBASE OTP
  // ------------------------------------------

  async function sendOtp(e) {
    e.preventDefault();

    setAuthError("");

    if (!validateStep(4)) {
      return;
    }

    try {
      setSaving(true);

      const normalizedPhone = form.phone.replace(/\D/g, "");

      const phoneNumber = `+91${normalizedPhone}`;

      // ------------------------------------------
      // CREATE FIREBASE RECAPTCHA
      // ------------------------------------------

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "recaptcha-container",
          {
            size: "invisible",

            callback: () => {
              console.log("Firebase reCAPTCHA verified");
            },

            "expired-callback": () => {
              setAuthError(
                "reCAPTCHA expired. Please try again."
              );

              if (window.recaptchaVerifier) {
                try {
                  window.recaptchaVerifier.clear();
                } catch (error) {
                  console.log(error);
                }

                window.recaptchaVerifier = null;
              }
            },
          }
        );
      }

      // ------------------------------------------
      // SEND REAL FIREBASE OTP
      // ------------------------------------------

      const confirmation = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        window.recaptchaVerifier
      );

      // Firebase confirmation object
      setConfirmationResult(confirmation);

      // OTP screen
      setAuthStage("otp");

      setAuthError("");
    } catch (error) {
      console.error("Firebase OTP Error:", error);

      setAuthError(
        error?.message ||
          "Failed to send OTP. Please try again."
      );

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (recaptchaError) {
          console.log(recaptchaError);
        }

        window.recaptchaVerifier = null;
      }
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------
  // VERIFY FIREBASE OTP
  // ------------------------------------------

  async function verifyOtp(e) {
    e.preventDefault();

    setAuthError("");

    if (!otp.trim()) {
      setAuthError("Please enter the OTP.");
      return;
    }

    if (!confirmationResult) {
      setAuthError(
        "Please request OTP first."
      );
      return;
    }

    try {
      setSaving(true);

      // ------------------------------------------
      // VERIFY OTP WITH FIREBASE
      // ------------------------------------------

      const result =
        await confirmationResult.confirm(
          otp.trim()
        );

      const user = result.user;

      // ------------------------------------------
      // NORMALIZED PHONE
      // ------------------------------------------

      const normalizedPhone =
        form.phone.replace(/\D/g, "");

      // ------------------------------------------
      // USER DATA
      // ------------------------------------------

      const userData = {
        uid: user.uid,

        phone:
          user.phoneNumber ||
          `+91${normalizedPhone}`,

        // Personal Information
        name: form.name.trim(),

        education: form.education.trim(),

        profession: form.profession.trim(),

        skills: form.skills.trim(),

        social: form.social.trim(),

        aadhaar: form.aadhaar.trim(),

        // Address
        district: form.district,

        block: form.block,

        panchayat: form.panchayat,

        village: form.village,

        ward: form.ward,

        // Map Location
        location: form.location
          ? {
              lat: form.location.lat,
              lng: form.location.lng,
            }
          : null,

        // Photo name for now
        profilePhotoName: form.photo
          ? form.photo.name
          : null,

        // Account
        role: "member",

        status: "active",

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      };

      // ------------------------------------------
      // SAVE USER IN FIRESTORE
      // users/{firebase UID}
      // ------------------------------------------

      await setDoc(
        doc(db, "users", user.uid),
        userData
      );

      // ------------------------------------------
      // LOCAL LOGIN INFO
      // ------------------------------------------

      localStorage.setItem(
        "jansuraaj_user",
        JSON.stringify({
          uid: user.uid,

          phone:
            user.phoneNumber ||
            `+91${normalizedPhone}`,

          name: form.name,

          loggedIn: true,

          loggedInAt: Date.now(),
        })
      );

      // ------------------------------------------
      // REMOVE OLD PENDING REGISTRATION
      // ------------------------------------------

      localStorage.removeItem(
        "jansuraaj_pending_registration"
      );

      // ------------------------------------------
      // SUCCESS
      // ------------------------------------------

      alert("Welcome to Jansuraaj!");

      // ------------------------------------------
      // HOME PAGE
      // ------------------------------------------

      navigate("/home", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Firebase OTP verification error:",
        error
      );

      setAuthError(
        error?.message ||
          "Invalid OTP. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------
  // RESET OTP / CHANGE NUMBER
  // ------------------------------------------

  function changeNumber() {
    setAuthStage("phone");
    setOtp("");
    setConfirmationResult(null);
    setAuthError("");

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.log(error);
      }

      window.recaptchaVerifier = null;
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">
          Join Jansuraaj
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Create your member profile and verify your phone
          for login.
        </p>

        <div className="mt-4">
          <ProgressStepper
            step={step}
            max={4}
          />
        </div>

        <div className="mt-4 space-y-4">

          {/* =========================================
              STEP 1
          ========================================== */}

          {step === 1 && (
            <div>
              <label className="block text-sm">
                Profile Photo (optional)
              </label>

              <div className="mt-2 flex items-center gap-3">
                <div className="h-20 w-20 overflow-hidden rounded-lg bg-slate-100">
                  {form.photo ? (
                    <img
                      src={URL.createObjectURL(
                        form.photo
                      )}
                      alt="profile"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </div>

                <div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      update(
                        "photo",
                        e.target.files &&
                          e.target.files[0]
                      )
                    }
                  />
                </div>
              </div>
            </div>
          )}

          {/* =========================================
              STEP 2
          ========================================== */}

          {step === 2 && (
            <div>
              <label className="block text-sm">
                Personal Information
              </label>

              <input
                className="mt-2 w-full rounded border p-2"
                placeholder="Full name"
                value={form.name}
                onChange={(e) =>
                  update("name", e.target.value)
                }
              />

              {errors.name ? (
                <div className="mt-1 text-xs text-rose-600">
                  {errors.name}
                </div>
              ) : null}

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <input
                  className="rounded border p-2"
                  placeholder="Education"
                  value={form.education}
                  onChange={(e) =>
                    update(
                      "education",
                      e.target.value
                    )
                  }
                />

                <input
                  className="rounded border p-2"
                  placeholder="Profession"
                  value={form.profession}
                  onChange={(e) =>
                    update(
                      "profession",
                      e.target.value
                    )
                  }
                />
              </div>

              <input
                className="mt-3 w-full rounded border p-2"
                placeholder="Skills (comma separated)"
                value={form.skills}
                onChange={(e) =>
                  update(
                    "skills",
                    e.target.value
                  )
                }
              />

              <input
                className="mt-3 w-full rounded border p-2"
                placeholder="Social links (optional)"
                value={form.social}
                onChange={(e) =>
                  update(
                    "social",
                    e.target.value
                  )
                }
              />

              <input
                className="mt-3 w-full rounded border p-2"
                placeholder="Aadhaar (optional)"
                value={form.aadhaar}
                onChange={(e) =>
                  update(
                    "aadhaar",
                    e.target.value
                  )
                }
              />
            </div>
          )}

          {/* =========================================
              STEP 3
          ========================================== */}

          {step === 3 && (
            <div>
              <label className="block text-sm">
                Address
              </label>

              <div className="mt-2 grid gap-2 sm:grid-cols-2">

                <select
                  className="rounded border p-2"
                  value={form.district}
                  onChange={(e) => {
                    update(
                      "district",
                      e.target.value
                    );
                    update("block", "");
                    update("panchayat", "");
                    update("village", "");
                    update("ward", "");
                  }}
                >
                  <option value="">
                    Select District
                  </option>

                  {districts.map((d) => (
                    <option
                      key={d}
                      value={d}
                    >
                      {d}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded border p-2"
                  value={form.block}
                  onChange={(e) => {
                    update(
                      "block",
                      e.target.value
                    );
                    update("panchayat", "");
                    update("village", "");
                    update("ward", "");
                  }}
                >
                  <option value="">
                    Select Block
                  </option>

                  {blocks.map((b) => (
                    <option
                      key={b}
                      value={b}
                    >
                      {b}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded border p-2"
                  value={form.panchayat}
                  onChange={(e) => {
                    update(
                      "panchayat",
                      e.target.value
                    );
                    update("village", "");
                    update("ward", "");
                  }}
                >
                  <option value="">
                    Select Panchayat
                  </option>

                  {panchayats.map((p) => (
                    <option
                      key={p}
                      value={p}
                    >
                      {p}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded border p-2"
                  value={form.village}
                  onChange={(e) => {
                    update(
                      "village",
                      e.target.value
                    );
                    update("ward", "");
                  }}
                >
                  <option value="">
                    Select Village
                  </option>

                  {villages.map((v) => (
                    <option
                      key={v}
                      value={v}
                    >
                      {v}
                    </option>
                  ))}
                </select>

                <select
                  className="rounded border p-2"
                  value={form.ward}
                  onChange={(e) =>
                    update(
                      "ward",
                      e.target.value
                    )
                  }
                >
                  <option value="">
                    Select Ward
                  </option>

                  {wards.map((w) => (
                    <option
                      key={w}
                      value={w}
                    >
                      {w}
                    </option>
                  ))}
                </select>
              </div>

              {errors.district ? (
                <div className="mt-1 text-xs text-rose-600">
                  {errors.district}
                </div>
              ) : null}

              {errors.ward ? (
                <div className="mt-1 text-xs text-rose-600">
                  {errors.ward}
                </div>
              ) : null}

              <div className="mt-4">
                <MapPicker
                  initialPosition={[
                    25.6,
                    85.1,
                  ]}
                  onLocationSelect={(loc) =>
                    update(
                      "location",
                      loc
                    )
                  }
                />

                {form.location ? (
                  <div className="mt-2 text-xs text-slate-600">
                    Picked:{" "}
                    {form.location.lat.toFixed(
                      4
                    )}
                    ,{" "}
                    {form.location.lng.toFixed(
                      4
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          )}

          {/* =========================================
              STEP 4
          ========================================== */}

          {step === 4 && (
            <div>
              <h3 className="block text-sm font-semibold">
                Verify your phone
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                यह नंबर आपके लॉगिन और OTP
                verification के लिए उपयोग होगा।
              </p>

              {/* Firebase reCAPTCHA */}
              <div id="recaptcha-container"></div>

              {/* =====================================
                  PHONE
              ====================================== */}

              {authStage === "phone" ? (
                <form
                  onSubmit={sendOtp}
                  className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number
                  </label>

                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-sm text-slate-500">
                      +91
                    </span>

                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) =>
                        update(
                          "phone",
                          e.target.value
                        )
                      }
                      placeholder="98765 43210"
                      className="w-full border-none bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>

                  {errors.phone ? (
                    <div className="text-xs text-rose-600">
                      {errors.phone}
                    </div>
                  ) : null}

                  {authError ? (
                    <div className="text-xs text-rose-600">
                      {authError}
                    </div>
                  ) : null}

                  <button
                    type="submit"
                    disabled={saving}
                    className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {saving
                      ? "Sending OTP..."
                      : "Send OTP"}
                  </button>
                </form>
              ) : (

                /* =====================================
                   OTP
                ====================================== */

                <form
                  onSubmit={verifyOtp}
                  className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div>
                    <p className="text-sm text-slate-600">
                      OTP sent to +91{" "}
                      {form.phone.replace(
                        /\D/g,
                        ""
                      )}
                    </p>

                    <p className="mt-2 text-sm text-slate-500">
                      आपके mobile number पर
                      Firebase OTP भेजा गया है।
                      कृपया OTP enter करके
                      verify करें।
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Enter OTP
                    </label>

                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp}
                      onChange={(e) =>
                        setOtp(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      placeholder="6-digit code"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  {authError ? (
                    <div className="text-xs text-rose-600">
                      {authError}
                    </div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">

                    <button
                      type="button"
                      onClick={changeNumber}
                      disabled={saving}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
                    >
                      Change number
                    </button>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {saving
                        ? "Verifying..."
                        : "Verify OTP & Join"}
                    </button>

                  </div>
                </form>
              )}
            </div>
          )}
        </div>

        {/* =========================================
            STEP NAVIGATION
        ========================================== */}

        <div className="mt-6 flex items-center gap-3">

          <button
            type="button"
            onClick={prev}
            disabled={
              saving || step === 1
            }
            className="rounded-full border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Back
          </button>

          {step < 4 ? (
            <button
              type="button"
              onClick={next}
              disabled={saving}
              className="rounded-full bg-sky-600 px-4 py-2 text-white disabled:opacity-50"
            >
              Next
            </button>
          ) : null}

        </div>
      </div>
    </div>
  );
}