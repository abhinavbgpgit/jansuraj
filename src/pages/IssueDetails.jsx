import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../i18n";
import PhotoPreview from "../components/PhotoPreview";
import VideoPreview from "../components/VideoPreview";
import SupportButton from "../components/SupportButton"

// ==========================================
// Backend se aane wale raw slug values
// (jaise "bhagalpur_municipal_corporation")
// ko readable text me badalta hai.
// ==========================================
function formatLabel(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-zA-Z]/g, (char) => char.toUpperCase());
}

// ==========================================
// STATUS STEPPER
// ==========================================
function StatusStepper({ status }) {
  const order = ["pending", "in-progress", "resolved"];
  const steps = [
    { key: "pending", label: "दर्ज हुई" },
    { key: "in-progress", label: "कार्रवाई जारी" },
    { key: "resolved", label: "समाधान" },
  ];

  const currentIndex = Math.max(0, order.indexOf(status || "pending"));

  return (
    <div className="flex items-center">
      {steps.map((step, index) => (
        <React.Fragment key={step.key}>
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                index <= currentIndex
                  ? "bg-sky-600 text-white"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              {index < currentIndex ? "✓" : index + 1}
            </div>

            <span
              className={`whitespace-nowrap text-xs font-medium ${
                index <= currentIndex ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {step.label}
            </span>
          </div>

          {index < steps.length - 1 && (
            <div
              className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                index < currentIndex ? "bg-sky-600" : "bg-slate-200"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}

export default function IssueDetails() {
  const { t } = useLanguage();
  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // FETCH ISSUE DETAILS
  // ==========================================
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          setError("Backend URL is not configured.");
          return;
        }

        if (!id) {
          setError("Invalid problem ID.");
          return;
        }

        // ==========================================
        // IMPORTANT:
        // localStorage token ki zarurat nahi hai.
        // HttpOnly cookie browser automatically bhejega.
        // ==========================================
        const response = await axios.get(
          `${backendUrl}/api/problems/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setIssue(response.data.problem);
        } else {
          setError(
            response.data?.message ||
              "Problem not found."
          );
        }
      } catch (error) {
        console.error("Issue details error:", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });

        // ==========================================
        // AUTH ERROR
        // ==========================================
        if (error.response?.status === 401) {
          setError(
            "आपका login session समाप्त हो गया है। कृपया दोबारा login करें।"
          );
          return;
        }

        // ==========================================
        // ACCESS DENIED
        // ==========================================
        if (error.response?.status === 403) {
          setError(
            error.response?.data?.message ||
              "आप इस समस्या को देखने के लिए अधिकृत नहीं हैं।"
          );
          return;
        }

        // ==========================================
        // NOT FOUND
        // ==========================================
        if (error.response?.status === 404) {
          setError(
            error.response?.data?.message ||
              "Problem not found."
          );
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load problem."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
        <p className="text-slate-600">
          समस्या लोड हो रही है...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error || !issue) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 text-center">
        <h1 className="text-2xl font-bold text-slate-900">
          समस्या नहीं मिली
        </h1>

        <p className="mt-3 text-slate-600">
          {error || "यह समस्या मौजूद नहीं है।"}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/issues"
            className="inline-flex rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
          >
            सभी समस्याएँ देखें
          </Link>

          {error?.includes("login") && (
            <Link
              to="/login"
              className="inline-flex rounded-full bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
            >
              {t("Login")}
            </Link>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // AREA TEXT
  // ==========================================
  const areaParts = [];

  if (issue.district) {
    areaParts.push(`जिला: ${formatLabel(issue.district)}`);
  }

  if (
    issue.areaType === "urban" &&
    issue.localBody
  ) {
    areaParts.push(
      `नगर निकाय: ${formatLabel(issue.localBody)}`
    );
  }

  if (issue.areaType === "rural") {
    areaParts.push("ग्रामीण क्षेत्र");
  }

  if (issue.ward) {
    areaParts.push(`वार्ड: ${formatLabel(issue.ward)}`);
  }

  const areaText =
    areaParts.length > 0
      ? areaParts.join(" • ")
      : "क्षेत्र की जानकारी उपलब्ध नहीं है";

  const hasVideos =
    Array.isArray(issue.videoLinks) &&
    issue.videoLinks.filter(Boolean).length > 0;

  // ==========================================
  // STATUS TEXT
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
  // STATUS CLASS
  // ==========================================
  const getStatusClass = (status) => {
    switch (status) {
      case "resolved":
        return "bg-green-50 text-green-700";

      case "in-progress":
        return "bg-orange-50 text-orange-700";

      default:
        return "bg-emerald-50 text-emerald-700";
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-6">

      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            {formatLabel(issue.category) || "समस्या"}
          </h1>

          <p className="mt-2 text-sm text-slate-600">
            {areaText}
          </p>
        </div>

        <Link
          to="/issues"
          className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
        >
          वापस सभी पर जाएँ
        </Link>
      </div>

      {/* ==========================================
          MAIN CONTENT
      ========================================== */}
      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">

        {/* ==========================================
            LEFT CONTENT
        ========================================== */}
        <div className="space-y-6 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          {/* ==========================================
              STATUS PROGRESS
          ========================================== */}
          <div className="rounded-3xl bg-slate-50 p-5">
            <StatusStepper status={issue.status} />
          </div>

          {/* STATUS + DATE + REPORT COUNT */}
          <div className="flex flex-wrap items-center gap-3">

            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(
                issue.status
              )}`}
            >
              {getStatusText(issue.status)}
            </span>

            {issue.createdAt && (
              <span className="text-sm text-slate-500">
                {new Date(
                  issue.createdAt
                ).toLocaleDateString("hi-IN")}
              </span>
            )}

            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-700">
              {issue.reportCount || 1} रिपोर्ट
            </span>
          </div>

          {/* ==========================================
              DESCRIPTION
          ========================================== */}
          <div className="rounded-3xl bg-slate-50 p-4 text-sm text-slate-700">

            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              समस्या का विवरण
            </h2>

            <p className="leading-7">
              {issue.description ||
                "समस्या का विवरण उपलब्ध नहीं है।"}
            </p>
          </div>

          {/* ==========================================
              PHOTOS
          ========================================== */}
          {Array.isArray(issue.photos) && issue.photos.filter(Boolean).length > 0 && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <PhotoPreview photos={issue.photos} />
            </div>
          )}

          {/* ==========================================
              VIDEOS
          ========================================== */}
          {hasVideos && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <h3 className="mb-3 font-semibold text-slate-900">
                वीडियो
              </h3>

              <VideoPreview videos={issue.videoLinks.filter(Boolean)} />
            </div>
          )}

          {/* ==========================================
              AREA + CATEGORY
          ========================================== */}
          <div className="grid gap-4 md:grid-cols-2">

            {/* AREA */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

              <h3 className="font-semibold text-slate-900">
                कहाँ?
              </h3>

              <div className="mt-3 space-y-2 text-sm text-slate-600">

                {issue.district && (
                  <p>
                    <span className="font-medium text-slate-900">
                      जिला:
                    </span>{" "}
                    {formatLabel(issue.district)}
                  </p>
                )}

                {issue.areaType === "urban" &&
                  issue.localBody && (
                    <p>
                      <span className="font-medium text-slate-900">
                        नगर निकाय:
                      </span>{" "}
                      {formatLabel(issue.localBody)}
                    </p>
                  )}

                {issue.areaType === "rural" && (
                  <p>
                    <span className="font-medium text-slate-900">
                      क्षेत्र:
                    </span>{" "}
                    ग्रामीण
                  </p>
                )}

                {issue.ward && (
                  <p>
                    <span className="font-medium text-slate-900">
                      वार्ड:
                    </span>{" "}
                    {formatLabel(issue.ward)}
                  </p>
                )}

              </div>
            </div>

            {/* CATEGORY */}
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

              <h3 className="font-semibold text-slate-900">
                Category
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                {formatLabel(issue.category) ||
                  "Not available"}
              </p>
            </div>
          </div>

          {/* ==========================================
              ADDRESS
          ========================================== */}
          {issue.address && (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

              <h3 className="font-semibold text-slate-900">
                समस्या का पता
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {formatLabel(issue.address)}
              </p>
            </div>
          )}

          {/* ==========================================
              COORDINATES
          ========================================== */}
          {issue.latitude !== null &&
            issue.latitude !== undefined &&
            issue.longitude !== null &&
            issue.longitude !== undefined && (
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">

                <h3 className="font-semibold text-slate-900">
                  Location
                </h3>

                <p className="mt-2 text-sm text-slate-600">
                  {issue.latitude},{" "}
                  {issue.longitude}
                </p>

                <a
                  href={`https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-sky-600 hover:text-sky-700 hover:underline"
                >
                  📍 Google Maps पर देखें →
                </a>
              </div>
            )}
        </div>

        {/* ==========================================
            RIGHT SIDEBAR
        ========================================== */}
        <aside className="space-y-5 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          {/* ==========================================
              TIMELINE
          ========================================== */}
          <div className="rounded-3xl bg-slate-50 p-5">

            <h3 className="text-lg font-semibold text-slate-900">
              पब्लिक टाइमलाइन
            </h3>

            <div className="mt-4 space-y-3 text-sm text-slate-600">

              {Array.isArray(issue.timeline) &&
              issue.timeline.length > 0 ? (

                issue.timeline.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      {typeof item === "string"
                        ? item
                        : item?.message ||
                          item?.text ||
                          "Timeline update"}
                    </div>
                  )
                )

              ) : (

                <div className="rounded-2xl border border-slate-200 bg-white p-3">
                  अभी कोई timeline update नहीं है।
                </div>
              )}
            </div>
          </div>

          {/* ==========================================
              NEXT STEP
          ========================================== */}
          <div className="rounded-3xl bg-slate-50 p-5">

            <h3 className="text-lg font-semibold text-slate-900">
              आगामी कदम
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              विभाग इस समस्या पर काम कर रहा है और
              जल्द ही अपडेट साझा किया जाएगा।
            </p>
          </div>

          {/* ==========================================
    SAME ISSUE CTA
========================================== */}
<div className="rounded-3xl border border-sky-100 bg-sky-50 p-5">
  <h3 className="text-sm font-semibold text-sky-900">
    क्या आपके इलाके में भी यही समस्या है?
  </h3>

  <p className="mt-1 text-xs leading-5 text-sky-700">
    अगर यह वही समस्या है, तो इसे support करें।
    अगर आपकी कोई अलग समस्या है, तो नई समस्या दर्ज करें।
  </p>

  {/* BUTTONS */}
  <div className="mt-3 flex flex-wrap items-center gap-2">
    
    {/* NEW ISSUE BUTTON */}
    <Link
      to="/report"
      className="inline-flex items-center justify-center gap-1 rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-sky-700"
    >
      समस्या दर्ज करें →
    </Link>

    {/* SUPPORT BUTTON */}
    <SupportButton
      problemId={issue._id || issue.id}
      initialCount={issue.reportCount || 1}
    />

  </div>
</div>

        </aside>
      </div>
    </div>
  );
}
