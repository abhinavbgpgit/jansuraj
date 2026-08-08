import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/firebase";

import {
  signOut,
} from "firebase/auth";

import {
  doc,
  getDoc,
} from "firebase/firestore";

const VerifyOTP = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = location.state?.phoneNumber;
  const mode = location.state?.mode;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!phoneNumber || !mode) {
      navigate("/join", { replace: true });
    }
  }, [phoneNumber, mode, navigate]);

  const verifyOTP = async (e) => {
    e.preventDefault();

    setError("");

    if (otp.length !== 6) {
      setError("Please enter 6 digit OTP.");
      return;
    }

    const confirmationResult =
      window.jansuraajConfirmationResult;

    if (!confirmationResult) {
      setError(
        "OTP session expired. Please request OTP again."
      );

      navigate(mode === "login" ? "/login" : "/join");
      return;
    }

    try {
      setLoading(true);

      // Firebase OTP verification
      const result = await confirmationResult.confirm(otp);

      const user = result.user;

      console.log("Firebase user:", user);

      // Registration
      if (mode === "join") {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {

          alert(
            "This mobile number is already registered. Please login."
          );

          await signOut(auth);

          navigate("/login", { replace: true });

          return;
        }

        navigate("/profile-setup", {
          replace: true,
        });

        return;
      }

      // Login
      if (mode === "login") {

        const userRef = doc(db, "users", user.uid);

        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {

          alert(
            "Account not found. Please join Jansuraaj first."
          );

          await signOut(auth);

          navigate("/join", { replace: true });

          return;
        }

        // Login successful
        navigate("/", {
          replace: true,
        });

        return;
      }

    } catch (error) {
      console.error("OTP verification error:", error);

      switch (error.code) {
        case "auth/invalid-verification-code":
          setError("Incorrect OTP. Please try again.");
          break;

        case "auth/code-expired":
          setError("OTP expired. Please request a new OTP.");
          break;

        default:
          setError(
            error.message || "OTP verification failed."
          );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-cyan-50 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-7">

        <div className="flex justify-center mb-6">

          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">

            <img
              src="/jansuraaj-logo.png"
              alt="Jansuraaj"
              className="w-full h-full object-cover"
            />

          </div>

        </div>

        <h1 className="text-3xl font-semibold text-center">
          Verify OTP
        </h1>

        <p className="text-center text-gray-500 mt-3">
          OTP sent to
        </p>

        <p className="text-center font-semibold text-gray-800 mt-1">
          {phoneNumber}
        </p>

        <form
          onSubmit={verifyOTP}
          className="mt-8"
        >

          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 6 digit OTP
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value.replace(/\D/g, ""))
            }
            placeholder="000000"
            className="w-full border border-gray-300 rounded-xl px-4 py-4 text-center text-2xl tracking-[0.5em] outline-none focus:ring-2 focus:ring-cyan-400"
          />

          {error && (
            <p className="text-red-500 text-sm mt-3 text-center">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-6 bg-cyan-500 hover:bg-cyan-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading ? "VERIFYING..." : "VERIFY OTP"}
          </button>

        </form>

        <button
          onClick={() =>
            navigate(mode === "login" ? "/login" : "/join")
          }
          className="w-full mt-4 border border-gray-300 py-3 rounded-xl text-gray-600"
        >
          Change Mobile Number
        </button>

      </div>

    </div>
  );
};

export default VerifyOTP;