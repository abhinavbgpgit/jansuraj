import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import VideoPreview from "../components/VideoPreview";
import { useLanguage } from "../i18n";

export default function Issues() {
  const { t } = useLanguage();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH MY AREA PROBLEMS
  // ==========================================
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          setError("Backend URL is not configured.");
          return;
        }

        const response = await axios.get(`${backendUrl}/api/problems/my-area`, {
          // HttpOnly cookie automatically send hogi
          withCredentials: true,
        });

        if (response.data?.success) {
          setIssues(response.data.problems || []);
        } else {
          setError(response.data?.message || "Failed to load problems.");
        }
      } catch (error) {
        console.error("Fetch problems error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        // ==========================================
        // NOT LOGGED IN / SESSION EXPIRED
        // ==========================================
        if (error.response?.status === 401) {
          setError("Your login session has expired. Please login again.");

          return;
        }

        setError(error.response?.data?.message || "Failed to load problems.");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // ==========================================
  // AREA DISPLAY
  // ==========================================
  const getAreaText = (issue) => {
    const parts = [];

    if (issue.district) {
      parts.push(`जिला: ${issue.district}`);
    }

    if (issue.areaType === "urban" && issue.localBody) {
      parts.push(`नगर निकाय: ${issue.localBody}`);
    }

    if (issue.ward) {
      parts.push(`वार्ड: ${issue.ward}`);
    }

    if (parts.length === 0) {
      return "क्षेत्र की जानकारी उपलब्ध नहीं है";
    }

    return parts.join(" • ");
  };

  // ==========================================
  // STATUS DISPLAY
  // ==========================================
  const getStatusText = (status) => {
    switch (status) {
      case "pending":
        return "लंबित";

      case "in-progress":
        return "कार्य प्रगति पर";

      case "resolved":
        return "समाधान हो गया";

      default:
        return "लंबित";
    }
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <p className="text-slate-600">समस्याएँ लोड हो रही हैं...</p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10 text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-rose-600">{error}</p>
        </div>
      </div>
    );
  }

  // ==========================================
  // MAIN UI
  // ==========================================
  return (
    <div className="mx-auto max-w-5xl px-4 py-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t("All Issues")}</h1>

          <p className="mt-2 text-sm text-slate-600">
            {t("Here you will see all issues in your area.")}
          </p>
        </div>

        <Link
          to="/report"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          {t("New Issue")}
        </Link>
      </div>

      {/* ======================================
          NO PROBLEMS
      ====================================== */}

      {issues.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center">
          <p className="text-slate-600">
            {t("No issues have been reported in your area yet.")}
          </p>

          <Link
            to="/report"
            className="mt-4 inline-block rounded-full bg-sky-600 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-700"
          >
            {t("Report your first issue")}
          </Link>
        </div>
      ) : (
        /* ======================================
           PROBLEM LIST
        ====================================== */

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {issues.map((issue) => (
            <div
              key={issue._id}
              // to={`/issues/${issue._id}`}
              className="group rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
            >
              {/* =================================
                  STATUS + DATE
              ================================= */}

              <div className="mb-3 flex items-center justify-between gap-3">
                <span
                  className={`text-xs font-semibold uppercase tracking-[0.12em] ${
                    issue.status === "resolved"
                      ? "text-green-600"
                      : issue.status === "in-progress"
                      ? "text-orange-600"
                      : "text-slate-500"
                  }`}
                >
                  {getStatusText(issue.status)}
                </span>

                <span className="text-xs text-slate-500">
                  {issue.createdAt
                    ? new Date(issue.createdAt).toLocaleDateString("hi-IN")
                    : ""}
                </span>
              </div>

              {/* =================================
                  CATEGORY
              ================================= */}

              <h2 className="text-lg font-bold leading-7 text-slate-900 group-hover:text-sky-600">
                {issue.category || "समस्या"}
              </h2>

              {/* =================================
                  REGISTERED AREA
              ================================= */}

              <div className="mt-3 rounded-xl bg-slate-50 p-3">
                <p className="text-sm font-medium leading-6 text-slate-700">
                  📍 {getAreaText(issue)}
                </p>
              </div>

              {/* =================================
                  DESCRIPTION
              ================================= */}

              <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-700">
                {issue.description || "समस्या का विवरण उपलब्ध नहीं है।"}
              </p>

              {/* =================================
    VIDEO PREVIEWS
================================= */}

              {Array.isArray(issue.videoLinks) &&
                issue.videoLinks.filter(Boolean).length > 0 && (
                  <div className="mt-4">
                    <VideoPreview videos={issue.videoLinks.filter(Boolean)} />
                  </div>
                )}

              {/* =================================
                  REPORT COUNT
              ================================= */}

              <div className="mt-4 text-xs text-slate-500">
                {issue.reportCount || 1} लोगों ने इस समस्या को रिपोर्ट किया
              </div>

              {/* =================================
                  DETAILS
              ================================= */}

              <div className="mt-5 flex items-center justify-end text-sm font-semibold">
                <Link
                  to={`/issues/${issue._id}`}
                  className="text-sky-600 hover:text-sky-700"
                >
                  विस्तार देखें →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
