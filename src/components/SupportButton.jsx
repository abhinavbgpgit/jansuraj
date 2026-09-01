import React, { useEffect, useState } from "react";
import axios from "axios";

export default function SupportButton({ problemId, initialCount = 1,  onCreatorStatus,}) {
  const [count, setCount] = useState(
    typeof initialCount === "number" ? initialCount : 1
  );

  const [loading, setLoading] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  const [supported, setSupported] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  const [error, setError] = useState("");

  // ==========================================
  // SYNC INITIAL COUNT
  // ==========================================

  useEffect(() => {
    if (typeof initialCount === "number") {
      setCount(initialCount);
    }
  }, [initialCount]);

  // ==========================================
  // CHECK SUPPORT STATUS
  // ==========================================

  useEffect(() => {
    let cancelled = false;

    const checkSupportStatus = async () => {
      try {
        setCheckingStatus(true);
        setError("");

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        // ==========================================
        // VALIDATION
        // ==========================================

        if (!backendUrl) {
          console.error("VITE_BACKEND_URL is not configured");

          if (!cancelled) {
            setError("Backend URL configure नहीं है।");
          }

          return;
        }

        if (!problemId) {
          console.error("SupportButton problemId is missing:", problemId);

          if (!cancelled) {
            setError("Problem ID नहीं मिला।");
          }

          return;
        }

        // ==========================================
        // STATUS API
        // ==========================================

        const response = await axios.get(
          `${backendUrl}/api/support/${problemId}/status`,
          {
            withCredentials: true,
          }
        );

        console.log("Support status response:", response.data);

        if (cancelled) {
          return;
        }

        // ==========================================
        // SUCCESS
        // ==========================================

        if (response.data?.success) {

          const creator = Boolean(response.data.isCreator);
  const userSupported = Boolean(response.data.supported);

          setIsCreator(creator);
setSupported(userSupported);

          // ==========================================
          // COUNT
          // ==========================================

        if (typeof onCreatorStatus === "function") {
  onCreatorStatus(creator);
}

          // Agar backend supportCount bhejta hai
          else if (typeof response.data.supportCount === "number") {
            setCount(response.data.supportCount);
          }
        } else {
          console.warn("Support status API success false:", response.data);
        }
      } catch (error) {
        console.error("Support status error:", {
          message: error.message,
          status: error.response?.status,
          response: error.response?.data,
        });

        if (cancelled) {
          return;
        }

        // ==========================================
        // IMPORTANT
        // Status API fail hone se
        // support button disable nahi hoga
        // ==========================================

        setSupported(false);
        setIsCreator(false);

        // Login error ko status check me
        // UI par show nahi kar rahe
        if (error.response?.status !== 401) {
          setError("");
        }
      } finally {
        if (!cancelled) {
          setCheckingStatus(false);
        }
      }
    };

    checkSupportStatus();

    return () => {
      cancelled = true;
    };
  }, [problemId]);

  // ==========================================
  // SUPPORT PROBLEM
  // ==========================================

  const handleSupport = async () => {
    // ==========================================
    // SAFETY CHECK
    // ==========================================

    if (loading) {
      return;
    }

    if (supported) {
      return;
    }

    if (isCreator) {
      return;
    }

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!backendUrl) {
      setError("Backend URL configure नहीं है।");

      return;
    }

    if (!problemId) {
      console.error("Support click failed. problemId:", problemId);

      setError("Problem ID नहीं मिला। कृपया page refresh करें।");

      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Sending support request:", {
        problemId,
        url: `${backendUrl}/api/support/${problemId}`,
      });

      // ==========================================
      // SUPPORT API
      // ==========================================

      const response = await axios.post(
        `${backendUrl}/api/support/${problemId}`,
        {},
        {
          withCredentials: true,
        }
      );

      console.log("Support response:", response.data);

      // ==========================================
      // SUCCESS
      // ==========================================

      if (response.data?.success) {
        // ==========================================
        // UPDATE COUNT
        // ==========================================

        if (typeof response.data.reportCount === "number") {
          setCount(response.data.reportCount);
        } else if (typeof response.data.supportCount === "number") {
          setCount(response.data.supportCount);
        } else {
          setCount((previous) => previous + 1);
        }

        // ==========================================
        // MARK AS SUPPORTED
        // ==========================================

        setSupported(true);

        setError("");

        return;
      }

      // ==========================================
      // HTTP 200 BUT SUCCESS FALSE
      // ==========================================

      setError(response.data?.message || "Support करने में समस्या हुई।");
    } catch (error) {
      console.error("Support problem error:", {
        message: error.message,
        status: error.response?.status,
        response: error.response?.data,
      });

      const responseData = error.response?.data;

      // ==========================================
      // CREATOR
      // ==========================================

      if (responseData?.isCreator === true) {
        setIsCreator(true);
        setSupported(false);
        setError("");

        return;
      }

      // ==========================================
      // ALREADY SUPPORTED
      // ==========================================

      if (responseData?.alreadySupported === true) {
        setSupported(true);

        if (typeof responseData.reportCount === "number") {
          setCount(responseData.reportCount);
        } else if (typeof responseData.supportCount === "number") {
          setCount(responseData.supportCount);
        }

        setError("");

        return;
      }

      // ==========================================
      // LOGIN REQUIRED
      // ==========================================

      if (error.response?.status === 401) {
        setError("Support करने के लिए पहले login करें।");

        return;
      }

      // ==========================================
      // AREA RESTRICTION
      // ==========================================

      if (error.response?.status === 403) {
        setError(
          responseData?.message ||
            "आप इस समस्या को support करने के लिए अधिकृत नहीं हैं।"
        );

        return;
      }

      // ==========================================
      // NOT FOUND
      // ==========================================

      if (error.response?.status === 404) {
        setError("यह समस्या नहीं मिली।");

        return;
      }

      // ==========================================
      // NETWORK ERROR
      // ==========================================

      if (!error.response) {
        setError("Network error. कृपया अपना internet connection check करें।");

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
  const supportCount = Math.max((count || 1) - 1, 0);

  return (
    <button
      type="button"
      disabled
      className="inline-flex items-center justify-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white opacity-90"
      title="आप अपनी समस्या को स्वयं support नहीं कर सकते"
    >
      <span>♥</span>

        <span className="leading-4">
        <span className="block">
          {supportCount} लोगों ने इस समस्या को
        </span>

        <span className="block">
          support किया है
        </span>
      </span>
    </button>
  );
}

  // ==========================================
  // NORMAL USER UI
  // ==========================================

  return (
    <div>
      <button
        type="button"
        onClick={handleSupport}
        disabled={loading || supported || checkingStatus}
        className={`inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold transition ${
          supported
            ? "cursor-not-allowed bg-emerald-100 text-emerald-700"
            : loading || checkingStatus
            ? "cursor-wait bg-slate-100 text-slate-500"
            : "bg-white text-sky-700 ring-1 ring-sky-200 hover:bg-sky-50"
        }`}
      >
        {checkingStatus ? (
          <>
            <span>⏳</span>
            <span>जाँच हो रही है...</span>
          </>
        ) : loading ? (
          <>
            <span>⏳</span>
            <span>Support हो रहा है...</span>
          </>
        ) : supported ? (
          <>
            <span>✓</span>
            <span>आपने Support किया</span>
          </>
        ) : (
          <>
            <span>♡</span>
            <span>इस समस्या को Support करें</span>
          </>
        )}
      </button>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
