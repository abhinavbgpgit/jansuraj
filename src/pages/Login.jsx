import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  onAuthStateChanged,
} from "firebase/auth";

import { auth, db } from "../firebase/firebase";

import {
  doc,
  getDoc,
} from "firebase/firestore";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("phone");
  const [error, setError] = useState("");
  const [confirmationResult, setConfirmationResult] =
    useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ==========================================
  // CHECK FIREBASE LOGIN
  // ==========================================

 

  // ==========================================
  // CLEANUP RECAPTCHA
  // ==========================================

  useEffect(() => {
    return () => {
      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (error) {
          console.log(
            "reCAPTCHA cleanup error:",
            error
          );
        }

        window.recaptchaVerifier = null;
      }
    };
  }, []);

  // ==========================================
  // SEND FIREBASE OTP
  // ==========================================

  const sendOtp = async (e) => {
    e.preventDefault();

    setError("");

    const normalized = phone.replace(/\D/g, "");

    if (normalized.length !== 10) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);

      const phoneNumber = `+91${normalized}`;

      // ========================================
      // CREATE FIREBASE RECAPTCHA
      // ========================================

      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier =
          new RecaptchaVerifier(
            auth,
            "recaptcha-container",
            {
              size: "invisible",

              callback: () => {
                console.log(
                  "Firebase reCAPTCHA verified"
                );
              },

              "expired-callback": () => {
                setError(
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

      // ========================================
      // SEND REAL FIREBASE OTP
      // ========================================

      const confirmation =
        await signInWithPhoneNumber(
          auth,
          phoneNumber,
          window.recaptchaVerifier
        );

      setConfirmationResult(confirmation);

      setStage("otp");

      setError("");
    } catch (error) {
      console.error(
        "Firebase Send OTP Error:",
        error
      );

      let message =
        "Failed to send OTP. Please try again.";

      if (error.code === "auth/invalid-phone-number") {
        message =
          "Please enter a valid phone number.";
      }

      if (error.code === "auth/too-many-requests") {
        message =
          "Too many OTP requests. Please try again later.";
      }

      if (error.code === "auth/quota-exceeded") {
        message =
          "Firebase SMS quota exceeded. Please try again later.";
      }

      if (error.code === "auth/captcha-check-failed") {
        message =
          "reCAPTCHA verification failed. Please try again.";
      }

      setError(message);

      if (window.recaptchaVerifier) {
        try {
          window.recaptchaVerifier.clear();
        } catch (recaptchaError) {
          console.log(recaptchaError);
        }

        window.recaptchaVerifier = null;
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY FIREBASE OTP
  // ==========================================

  const verifyOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    if (!confirmationResult) {
      setError(
        "Please request OTP first."
      );
      return;
    }

    if (otp.trim().length !== 6) {
      setError(
        "Please enter a valid 6-digit OTP."
      );
      return;
    }

    try {
      setLoading(true);

      // ========================================
      // FIREBASE OTP VERIFY
      // ========================================

      const result =
        await confirmationResult.confirm(
          otp.trim()
        );

      const user = result.user;

      // ========================================
      // CHECK FIRESTORE USER
      // ========================================

      const userRef = doc(
        db,
        "users",
        user.uid
      );

      const userSnapshot =
        await getDoc(userRef);

      if (!userSnapshot.exists()) {
        setError(
          "No registered Jansuraaj profile found. Please join first."
        );

        // Sign out the newly authenticated user
        await auth.signOut();

        setLoading(false);
        return;
      }

      // ========================================
      // USER DATA
      // ========================================

      const userData =
        userSnapshot.data();

      // ========================================
      // SAVE LOCAL LOGIN INFO
      // ========================================

      localStorage.setItem(
        "jansuraaj_user",
        JSON.stringify({
          uid: user.uid,

          phone:
            user.phoneNumber ||
            `+91${phone.replace(/\D/g, "")}`,

          name:
            userData?.name || "",

          loggedIn: true,

          loggedInAt: Date.now(),
        })
      );

      // ========================================
      // HOME
      // ========================================

      navigate("/home", {
        replace: true,
      });
    } catch (error) {
      console.error(
        "Firebase Verify OTP Error:",
        error
      );

      let message =
        "OTP does not match. Please try again.";

      if (error.code === "auth/invalid-verification-code") {
        message =
          "Invalid OTP. Please enter the correct OTP.";
      }

      if (error.code === "auth/code-expired") {
        message =
          "OTP has expired. Please request a new OTP.";
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE NUMBER
  // ==========================================

  const changeNumber = () => {
    setStage("phone");
    setOtp("");
    setError("");
    setConfirmationResult(null);

    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch (error) {
        console.log(error);
      }

      window.recaptchaVerifier = null;
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">

        {/* ======================================
            TITLE
        ======================================= */}

        <h1 className="text-xl font-semibold">
          Login to Jansuraaj
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          Enter the phone number you used to join,
          then verify with OTP.
        </p>

        {/* Firebase reCAPTCHA container */}

        <div id="recaptcha-container"></div>

        {/* ======================================
            PHONE STAGE
        ======================================= */}

        {stage === "phone" ? (
          <form
            onSubmit={sendOtp}
            className="mt-6 space-y-5"
          >
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Phone number
              </label>

              <div className="mt-2 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

                <span className="flex items-center text-sm text-slate-500">
                  +91
                </span>

                <input
                  type="tel"
                  inputMode="numeric"
                  value={phone}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setPhone(
                      value.slice(0, 10)
                    );

                    setError("");
                  }}
                  placeholder="98765 43210"
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-rose-600">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Sending OTP..."
                : "Send OTP"}
            </button>
          </form>
        ) : (

          /* ====================================
             OTP STAGE
          ===================================== */

          <form
            onSubmit={verifyOtp}
            className="mt-6 space-y-5"
          >
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

              <p className="text-sm text-slate-600">
                OTP sent to
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                +91{" "}
                {phone.replace(/\D/g, "")}
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Firebase OTP has been sent to
                your mobile number.
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
                onChange={(e) => {
                  const value =
                    e.target.value.replace(
                      /\D/g,
                      ""
                    );

                  setOtp(
                    value.slice(0, 6)
                  );

                  setError("");
                }}
                placeholder="6-digit code"
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-600">
                {error}
              </p>
            )}

            <div className="flex flex-col gap-3 sm:flex-row">

              <button
                type="button"
                onClick={changeNumber}
                disabled={loading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
              >
                Change number
              </button>

              <button
                type="submit"
                disabled={loading}
                className="rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>

            </div>
          </form>
        )}

        {/* ======================================
            JOIN LINK
        ======================================= */}

        <div className="mt-6 text-center text-sm text-slate-500">
          New to Jansuraaj?{" "}

          <Link
            to="/join"
            className="font-semibold text-slate-900 hover:text-sky-600"
          >
            Join now
          </Link>
        </div>

      </div>
    </div>
  );
}