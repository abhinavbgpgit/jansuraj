import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("phone");
  const [sessionInfo, setSessionInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // ==========================================
  // SEND OTP
  // ==========================================
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

   const normalized = phone.replace(/\D/g, "").slice(-10);

console.log("Phone entered:", phone);
console.log("Normalized phone:", normalized);
console.log("Length:", normalized.length);

if (normalized.length !== 10) {
  setError("Please enter a valid 10-digit phone number.");
  return;
}

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/auth/send-otp`,
        {
          phone: `+91${normalized}`,
        }
      );

      if (response.data.success) {
        setSessionInfo(response.data.sessionInfo);
        setStage("otp");
        setOtp("");
      } else {
        setError(
          response.data.message || "Failed to send OTP"
        );
      }
    } catch (error) {
      console.error(
        "Send OTP error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // VERIFY OTP / LOGIN
  // ==========================================
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!sessionInfo) {
      setError("OTP session expired. Please request a new OTP.");
      setStage("phone");
      return;
    }

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          sessionInfo,
          code: cleanOtp,
        },
        {
          // Backend HttpOnly cookie receive/send karne ke liye
          withCredentials: true,
        }
      );

      if (response.data.success) {
  // Header ko batao ki authentication change hua hai
  window.dispatchEvent(
    new Event("jansuraaj_auth_change")
  );

  navigate("/home");
}else {
        setError(
          response.data.message || "Login failed"
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      const message =
        error.response?.data?.message ||
        "Login failed";

      if (message === "Please join first") {
        setError("Please join first.");
        return;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CHANGE PHONE NUMBER
  // ==========================================
  const handleChangeNumber = () => {
    setStage("phone");
    setOtp("");
    setSessionInfo("");
    setError("");
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-8">
      <div className="relative w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">

        {/* Close */}
        <Link
          to="/"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Close login"
        >
          ×
        </Link>

        {/* Header */}
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-semibold text-slate-900">
            Login to Jansuraaj
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter the phone number you used to join,
            then verify with OTP.
          </p>
        </div>

        {/* =====================================
            PHONE STEP
        ===================================== */}
        {stage === "phone" ? (
          <form
            onSubmit={sendOtp}
            className="space-y-5"
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
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    const value =
                      e.target.value.replace(/\D/g, "");

                    setPhone(value.slice(0, 10));
                  }}
                  placeholder="98765 43210"
                  maxLength={10}
                  className="w-full bg-transparent text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-rose-600">
                {error}
              </p>
            )}

            {/* Send OTP */}
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

          /* =====================================
             OTP STEP
          ===================================== */
          <form
            onSubmit={verifyOtp}
            className="space-y-5"
          >
            {/* Phone information */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">
                OTP sent to
              </p>

              <p className="mt-1 text-lg font-semibold text-slate-900">
                +91 {phone}
              </p>

              <p className="mt-3 text-sm text-slate-500">
                Enter the 6-digit verification code
                sent to your mobile number.
              </p>
            </div>

            {/* OTP */}
            <div>
              <label
                htmlFor="otp"
                className="block text-sm font-medium text-slate-700"
              >
                Enter OTP
              </label>

              <input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => {
                  const value =
                    e.target.value.replace(/\D/g, "");

                  setOtp(value.slice(0, 6));
                }}
                placeholder="6-digit code"
                maxLength={6}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-rose-600">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">

              {/* Change number */}
              <button
                type="button"
                onClick={handleChangeNumber}
                disabled={loading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 disabled:opacity-50"
              >
                Change number
              </button>

              {/* Verify */}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Verifying..."
                  : "Verify OTP"}
              </button>
            </div>
          </form>
        )}

        {/* Join */}
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