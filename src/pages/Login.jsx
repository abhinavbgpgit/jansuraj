import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // =====================================================
  // OTP LOGIN CODE - TEMPORARILY DISABLED
  // =====================================================

  /*
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState("phone");
  const [sessionInfo, setSessionInfo] = useState("");

  // SEND OTP
  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");

    const normalized = phone
      .replace(/\D/g, "")
      .slice(-10);

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

  // VERIFY OTP / LOGIN
  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const cleanOtp = otp.replace(/\D/g, "");

    if (cleanOtp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    if (!sessionInfo) {
      setError(
        "OTP session expired. Please request a new OTP."
      );
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
          withCredentials: true,
        }
      );

      if (response.data.success) {
        window.dispatchEvent(
          new Event("jansuraaj_auth_change")
        );

        navigate("/home");
      } else {
        setError(
          response.data.message || "Login failed"
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data || error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // CHANGE PHONE NUMBER
  const handleChangeNumber = () => {
    setStage("phone");
    setOtp("");
    setSessionInfo("");
    setError("");
  };
  */

  // =====================================================
  // MOBILE NUMBER LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");

    const normalized = phone
      .replace(/\D/g, "")
      .slice(-10);

    // Validate mobile number
    if (normalized.length !== 10) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    try {
      setLoading(true);

      const backendUrl =
        import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setError(
          "Backend URL is not configured."
        );
        return;
      }

      // =================================================
      // MOBILE NUMBER LOGIN API
      // =================================================

      const response = await axios.post(
        `${backendUrl}/api/auth/login`,
        {
          phone: `+91${normalized}`,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data?.success) {
        // Header ko authentication change batao
        window.dispatchEvent(
          new Event("jansuraaj_auth_change")
        );

        // Home page
        navigate("/home");
      } else {
        setError(
          response.data?.message ||
            "Login failed"
        );
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data ||
          error.message
      );

      setError(
        error.response?.data?.message ||
          "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-8">

      <div className="relative w-full max-w-md rounded-[32px] border border-slate-200 bg-white p-8 shadow-soft">

        {/* =================================================
            CLOSE BUTTON
        ================================================= */}

        <Link
          to="/"
          className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-200"
          aria-label="Close login"
        >
          ×
        </Link>

        {/* =================================================
            HEADER
        ================================================= */}

        <div className="mb-6 text-center">

          <h1 className="text-3xl font-semibold text-slate-900">
            Login to Jansuraaj
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Enter the phone number you used to join.
          </p>

        </div>

        {/* =================================================
            MOBILE NUMBER LOGIN FORM
        ================================================= */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* PHONE NUMBER */}

          <div>

            <label className="block text-sm font-medium text-slate-700">
              Phone number
            </label>

            <div className="mt-2 flex gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

              {/* COUNTRY CODE */}

              <span className="flex items-center text-sm text-slate-500">
                +91
              </span>

              {/* INPUT */}

              <input
                type="tel"
                inputMode="numeric"
                autoComplete="tel"
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

                }}
                placeholder="98765 43210"
                maxLength={10}
                className="w-full bg-transparent text-sm text-slate-900 outline-none"
              />

            </div>

          </div>

          {/* =================================================
              ERROR
          ================================================= */}

          {error && (
            <p className="text-sm text-rose-600">
              {error}
            </p>
          )}

          {/* =================================================
              LOGIN BUTTON
          ================================================= */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
          >

            {loading
              ? "Logging in..."
              : "Login"}

          </button>

        </form>

        {/* =================================================
            JOIN
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
  );
}