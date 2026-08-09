import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

import { auth } from "../firebase/firebase";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("phone");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // =====================================================
  // CHECK LOGIN
  // =====================================================

  useEffect(() => {
    const stored = localStorage.getItem("jansuraaj_user");

    if (stored) {
      navigate("/home");
    }
  }, [navigate]);

  // =====================================================
  // CLEANUP RECAPTCHA
  // =====================================================

  useEffect(() => {
    return () => {
      if (window.loginRecaptchaVerifier) {
        try {
          window.loginRecaptchaVerifier.clear();
        } catch (error) {
          console.log(error);
        }

        window.loginRecaptchaVerifier = null;
      }
    };
  }, []);

  // =====================================================
  // CLEAR RECAPTCHA
  // =====================================================

  const clearRecaptcha = () => {
    if (window.loginRecaptchaVerifier) {
      try {
        window.loginRecaptchaVerifier.clear();
      } catch (error) {
        console.log("reCAPTCHA clear error:", error);
      }

      window.loginRecaptchaVerifier = null;
    }
  };

  // =====================================================
  // SETUP FIREBASE RECAPTCHA
  // =====================================================

  const setupRecaptcha = () => {
    if (window.loginRecaptchaVerifier) {
      return window.loginRecaptchaVerifier;
    }

    window.loginRecaptchaVerifier = new RecaptchaVerifier(
      auth,
      "login-recaptcha-container",
      {
        size: "normal",

        callback: () => {
          console.log("reCAPTCHA solved");
        },

        "expired-callback": () => {
          setError("reCAPTCHA expired. Please try again.");
        },
      }
    );

    return window.loginRecaptchaVerifier;
  };

  // =====================================================
  // SEND OTP
  // =====================================================

  const sendOtp = async (e) => {
    e.preventDefault();

    setError("");

    const normalized = phone.replace(/\D/g, "");

    if (normalized.length !== 10) {
      setError("Please enter a valid 10-digit phone number.");

      return;
    }

    const phoneNumber = `+91${normalized}`;

    try {
      setLoading(true);

      const appVerifier = setupRecaptcha();

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        appVerifier
      );

      // Firebase OTP confirmation result
      window.jansuraajLoginConfirmation = confirmationResult;

      // Save phone temporarily
      localStorage.setItem(
        "jansuraaj_join_phone",
        JSON.stringify({
          phone: phoneNumber,
        })
      );

      // =====================================================
      // IMPORTANT:
      // OTP screen par jaane se pehle reCAPTCHA clear
      // =====================================================

      clearRecaptcha();

      setStage("otp");
    } catch (error) {
      console.error("Firebase OTP Error:", error);

      switch (error.code) {
        case "auth/invalid-phone-number":
          setError("Please enter a valid phone number.");
          break;

        case "auth/too-many-requests":
          setError("Too many attempts. Please try again later.");
          break;

        case "auth/quota-exceeded":
          setError("Firebase SMS quota exceeded.");
          break;

        case "auth/billing-not-enabled":
          setError(
            "Real SMS requires Firebase billing. For testing, use your Firebase test phone number."
          );
          break;

        case "auth/operation-not-allowed":
          setError("Phone authentication is not enabled.");
          break;

        case "auth/captcha-check-failed":
          setError("reCAPTCHA verification failed.");
          break;

        default:
          setError(error.message || "Failed to send OTP.");
      }

      // Reset recaptcha
      clearRecaptcha();
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // VERIFY OTP
  // =====================================================

  const verifyOtp = async (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");

      return;
    }

    const confirmationResult = window.jansuraajLoginConfirmation;

    if (!confirmationResult) {
      setError("OTP session expired. Please send OTP again.");

      setStage("phone");

      return;
    }

    try {
      setLoading(true);

      // Firebase OTP verification
      const result = await confirmationResult.confirm(otp);

      const user = result.user;

      console.log("Firebase OTP verified:", user);

      // -------------------------------------------------
      // Save verified Firebase user temporarily
      // -------------------------------------------------

      localStorage.setItem(
        "jansuraaj_join_phone",
        JSON.stringify({
          uid: user.uid,
          phone: user.phoneNumber || `+91${phone.replace(/\D/g, "")}`,
        })
      );

      // Remove confirmation object
      window.jansuraajLoginConfirmation = null;

      // -------------------------------------------------
      // OTP VERIFY KE BAAD JOIN PAGE
      // -------------------------------------------------

      navigate("/join", {
        replace: true,
      });
    } catch (error) {
      console.error("OTP verification error:", error);

      switch (error.code) {
        case "auth/invalid-verification-code":
          setError("OTP does not match. Please try again.");
          break;

        case "auth/code-expired":
          setError("OTP has expired. Please request a new OTP.");
          break;

        default:
          setError(error.message || "OTP verification failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10">
      <div className="mx-auto max-w-md">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">
            Login to Jansuraaj
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter the phone number you used to join, then verify with OTP.
          </p>

          {/* =================================================
              PHONE STAGE
          ================================================= */}

          {stage === "phone" ? (
            <form onSubmit={sendOtp} className="space-y-5">
              <div className="mt-6">
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
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, ""));
                      setError("");
                    }}
                    placeholder="98765 43210"
                    className="w-full bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>
              </div>

              {/* Firebase reCAPTCHA */}

              <div
                id="login-recaptcha-container"
                className="flex justify-center"
              />

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          ) : (
            /* =================================================
               OTP STAGE
            ================================================= */

            <form onSubmit={verifyOtp} className="space-y-5">
              <div className="mt-6 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm text-slate-600">OTP sent to</p>

                <p className="mt-1 text-lg font-semibold text-slate-900">
                  +91 {phone.replace(/\D/g, "")}
                </p>

                <p className="mt-3 text-sm text-slate-500">
                  Enter the 6-digit verification code sent to your mobile
                  number.
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
                    setOtp(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                  placeholder="6-digit code"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                />
              </div>

              {error && <p className="text-sm text-rose-600">{error}</p>}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    clearRecaptcha();
                    setStage("phone");
                    setOtp("");
                    setError("");
                  }}
                  className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                >
                  Change number
                </button>

                <button
                  type="submit"
                  disabled={loading || otp.length !== 6}
                  className="rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            </form>
          )}

          {/* =================================================
              JOIN LINK
          ================================================= */}

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
    </div>
  );
}