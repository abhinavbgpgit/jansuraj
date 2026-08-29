import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SupportButton({ problemId, initialCount = 1 }) {
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);
  const [supported, setSupported] = useState(false);
  const [isCreator, setIsCreator] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // CHECK SUPPORT STATUS
  // ==========================================

  useEffect(() => {
    const checkSupportStatus = async () => {
      try {
        setError("");

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl || !problemId) {
          return;
        }

        const response = await axios.get(
          `${backendUrl}/api/support/${problemId}/status`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          // ==========================================
          // CREATOR STATUS
          // ==========================================

          setIsCreator(Boolean(response.data.isCreator));

          // ==========================================
          // SUPPORT STATUS
          // ==========================================

          setSupported(Boolean(response.data.supported));

          // ==========================================
          // SUPPORT COUNT
          // ==========================================

          if (typeof response.data.reportCount === "number") {
            setCount(response.data.reportCount);
          }
        }
      } catch (error) {
        console.error("Support status error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        // Status check fail hone par
        // button ko block nahi karna hai
        setError("");
      }
    };

    checkSupportStatus();
  }, [problemId, initialCount]);

  // ==========================================
  // SUPPORT PROBLEM
  // ==========================================

  const handleSupport = async () => {
    // ==========================================
    // SAFETY CHECK
    // ==========================================

    if (loading || supported || isCreator) {
      return;
    }

    try {
      setLoading(true);
      setError("");

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setError("Backend URL is not configured.");
        return;
      }

      const response = await axios.post(
        `${backendUrl}/api/support/${problemId}`,
        {},
        {
          withCredentials: true,
        }
      );

      // ==========================================
      // SUPPORT SUCCESS
      // ==========================================

      if (response.data?.success) {
        if (typeof response.data.reportCount === "number") {
          setCount(response.data.reportCount);
        } else {
          setCount((previous) => previous + 1);
        }

        // Button permanently disabled
        setSupported(true);

        setError("");
      }
    } catch (error) {
      console.error("Support problem error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      const responseData = error.response?.data;

      // ==========================================
      // CREATOR
      // ==========================================

      if (responseData?.isCreator) {
        setIsCreator(true);
        setSupported(false);
        setError("");
        return;
      }

      // ==========================================
      // ALREADY SUPPORTED
      // ==========================================

      if (responseData?.alreadySupported) {
        setSupported(true);

        if (typeof responseData.reportCount === "number") {
          setCount(responseData.reportCount);
        }

        setError("");
        return;
      }

      // ==========================================
      // SAME WARD / AREA ERROR
      // ==========================================

      if (error.response?.status === 403) {
        setError(
          responseData?.message ||
            "आप केवल अपने वार्ड की समस्या को ही support कर सकते हैं।"
        );

        return;
      }

      // ==========================================
      // AUTH ERROR
      // ==========================================

      if (error.response?.status === 401) {
        setError(
          "आपका login session समाप्त हो गया है। कृपया फिर से login करें।"
        );

        return;
      }

      // ==========================================
      // OTHER ERROR
      // ==========================================

      setError(responseData?.message || "Support करने में समस्या हुई।");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CREATOR UI
  // ==========================================

  if (isCreator) {
    // Creator ke liye support button nahi
    // Support received information dikhayenge

    const supportCount = Math.max((count || 1) - 1, 0);

    return (
      <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
        <div className="flex items-start gap-3">
          {/* Support Icon */}
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
            ♥
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-emerald-700">
              समस्या को समर्थन मिल रहा है
            </p>

            <p className="mt-1 text-sm text-slate-700">
              <span className="font-bold text-emerald-700">{supportCount}</span>{" "}
              लोगों ने इस समस्या को support किया है।
            </p>
          </div>
        </div>

        {/* Bottom Message */}
        <div className="mt-3 border-t border-emerald-200 pt-3">
          <p className="text-xs leading-5 text-slate-600">
            आपकी समस्या को क्षेत्र के लोगों का समर्थन मिल रहा है।
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NORMAL USER UI
  // ==========================================

  return (
    <div className="mt-4">
      {/* ==========================================
          SUPPORT BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={handleSupport}
        disabled={loading || supported}
        className={`flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
          supported
            ? "cursor-not-allowed border-emerald-200 bg-emerald-50 text-emerald-700"
            : loading
            ? "cursor-wait border-sky-200 bg-sky-50 text-sky-500"
            : "border-sky-200 bg-sky-50 text-sky-600 hover:border-sky-300 hover:bg-sky-100"
        }`}
      >
        {supported ? (
          <>
            <span className="text-base">✓</span>

            <span>आपने इस समस्या को support किया</span>
          </>
        ) : (
          <>
            <span className="text-base">♡</span>

            <span>समस्या को support करें</span>
          </>
        )}
      </button>

      {/* ==========================================
          SUPPORT COUNT
      ========================================== */}

      <p className="mt-2 text-center text-xs text-slate-500">
        {count} लोगों ने इस समस्या को report किया
      </p>

      {/* ==========================================
          ERROR
      ========================================== */}

      {error && (
        <p className="mt-2 text-center text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}
