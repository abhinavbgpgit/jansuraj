import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { issues } from "../data/issues";
import axios from "axios";
import { useLanguage } from "../i18n";

export default function JanSuraajHero() {
  const { t } = useLanguage();

  const [filter, setFilter] = useState("all");
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH REAL ISSUES OF LOGGED-IN USER AREA
  // ==========================================

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          console.error("Backend URL is not configured.");
          setIssues([]);
          return;
        }

        const response = await axios.get(`${backendUrl}/api/problems/my-area`, {
          withCredentials: true,
        });

        if (response.data?.success) {
          setIssues(response.data.problems || []);
        } else {
          setIssues([]);
        }
      } catch (error) {
        console.error("Dashboard issues error:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status,
        });

        setIssues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  const navigate = useNavigate();

  // ==========================================
  // FILTER ISSUES
  // ==========================================

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  const areaInfo =
    issues.length > 0
      ? {
          district: issues[0].district,
          ward: issues[0].ward,
        }
      : null;

  // ==========================================
  // VIEW ISSUE
  // ==========================================

  const viewIssue = (id) => {
    navigate(`/issues/${id}`);
  };

  // ==========================================
  // REPORT ISSUE
  // ==========================================

  const reportIssue = () => {
    navigate("/report");
  };

  // ==========================================
  // EXPLORE ALL ISSUES
  // ==========================================

  const exploreIssues = () => {
    navigate("/issues");
  };

  // ==========================================
  // STATUS STYLE
  // ==========================================

  const statusStyle = {
    pending: {
      badge: "bg-[#FEF0ED] text-[#C24132]",
      dot: "bg-[#C24132]",
      text: "नई समस्या",
    },

    "in-progress": {
      badge: "bg-[#FFF6DD] text-[#A16207]",
      dot: "bg-[#F59E0B]",
      text: "कार्रवाई जारी",
    },

    resolved: {
      badge: "bg-[#EEF6F1] text-[#21845A]",
      dot: "bg-[#21845A]",
      text: "समाधान हुआ",
    },
  };

  // ==========================================
  // GET AREA TEXT
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
  // GET PROGRESS
  // ==========================================

  const getProgress = (status) => {
    switch (status) {
      case "pending":
        return 1;

      case "in-progress":
        return 2;

      case "resolved":
        return 4;

      default:
        return 1;
    }
  };

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#FBF8F1] text-[#17231D]">
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(23,35,29,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(23,35,29,.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]" />

      <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-[#F59E0B]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[430px] w-[430px] rounded-full bg-[#176B4D]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[760px] w-[calc(100%-30px)] max-w-[1200px] items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(430px,.85fr)] lg:gap-[75px] lg:py-0">
        {/* ==========================================
            LEFT SIDE
        ========================================== */}

        <div className="animate-[heroIn_.8s_ease_forwards]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#176B4D]/15 bg-[#EEF6F1]/80 px-3 py-2 text-[11px] font-extrabold text-[#176B4D]">
            <span className="h-2 w-2 rounded-full bg-[#21845A] shadow-[0_0_0_5px_rgba(33,132,90,.10)] animate-pulse" />

            {t("बिहार के हर वार्ड की आवाज़")}
          </div>

          <h1 className="mb-6 max-w-[680px] text-[42px] font-black leading-[1.1] tracking-[-1.8px] sm:text-[50px] lg:text-[67px] lg:tracking-[-2.5px]">
            आपके वार्ड की{" "}
            <span className="relative text-[#D97706]">
              {t("समस्या,")}

              <span className="absolute -bottom-1 left-0 right-0 h-[7px] -rotate-1 rounded-full bg-[#F59E0B]/20" />
            </span>{" "}
            {t("अब पूरे बिहार के सामने।")}
          </h1>

          <p className="mb-8 max-w-[610px] text-[14px] leading-[1.9] text-[#6B766F] sm:text-[15px] lg:text-[16px]">
            {t(
              "सड़क, पानी, नाली, बिजली या किसी भी सार्वजनिक समस्या को दर्ज कीजिए। उसकी स्थिति देखिए, कार्रवाई की टाइमलाइन देखिए और जानिए कि समस्या कहाँ तक पहुँची।"
            )}
          </p>

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reportIssue}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-[#F59E0B] bg-[#F59E0B] px-5 text-[13px] font-extrabold text-[#17231D] shadow-[0_12px_25px_rgba(245,158,11,.20)] transition-all duration-200 hover:-translate-y-1 hover:bg-[#D97706] hover:text-white"
            >
              <span className="text-lg leading-none">＋</span>

              {t("समस्या दर्ज करें")}
            </button>

            <button
              onClick={exploreIssues}
              className="inline-flex h-[52px] items-center justify-center gap-2 rounded-xl border border-[#E5E0D5] bg-white/70 px-5 text-[13px] font-extrabold text-[#17231D] transition-all duration-200 hover:-translate-y-1 hover:border-[#176B4D] hover:text-[#176B4D]"
            >
              {t("अपने वार्ड की समस्याएँ देखें")}

              <span>→</span>
            </button>
          </div>

          <div className="mt-6 flex items-center gap-2 text-[10px] text-[#6B766F]">
            <span className="grid h-6 w-6 place-items-center rounded-lg bg-[#EEF6F1] font-black text-[#176B4D]">
              ✓
            </span>

            {t("समस्या दर्ज होने से समाधान तक पूरी स्थिति सार्वजनिक")}
          </div>
        </div>

        {/* ==========================================
            RIGHT SIDE
        ========================================== */}

        <div className="relative animate-[panelIn_.9s_.15s_ease_forwards] opacity-100">
          <div className="pointer-events-none absolute -right-14 -top-12 -z-10 h-[120px] w-[120px] rounded-full bg-[#F59E0B]/10" />

          <div className="rounded-[27px] border border-[#17231D]/10 bg-[#FFFDF8]/95 p-4 shadow-[0_30px_75px_rgba(23,35,29,.11)] backdrop-blur-xl lg:h-[650px]">
            {/* ==========================================
                HEADER
            ========================================== */}

            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF6F1] text-lg text-[#176B4D]">
                  ⌖
                </div>

                <div>
                  <strong className="block text-[14px]">
                    {areaInfo
                      ? `${areaInfo.district} • ${areaInfo.ward}`
                      : "क्षेत्र की जानकारी"}
                  </strong>

                  <span className="mt-0.5 block text-[9px] text-[#6B766F]">
                    इस वार्ड में अभी क्या हो रहा है?
                  </span>
                </div>
              </div>

              <button
                onClick={exploreIssues}
                className="border-none bg-transparent text-[10px] font-extrabold text-[#176B4D] transition-colors hover:text-[#D97706]"
              >
                {t("सभी देखें →")}
              </button>
            </div>

            {/* ==========================================
                FILTERS
            ========================================== */}

            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                ["all", "सभी"],
                ["pending", "नई"],
                ["in-progress", "कार्रवाई जारी"],
                ["resolved", "समाधान हुआ"],
              ].map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`shrink-0 rounded-lg border px-2.5 py-1.5 text-[9px] transition-all ${
                    filter === value
                      ? "border-[#176B4D] bg-[#176B4D] text-white"
                      : "border-[#E5E0D5] bg-white text-[#6B766F] hover:border-[#176B4D]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* ==========================================
                ISSUES
            ========================================== */}

            <div className="grid gap-2.5">
              {loading ? (
                /* ======================================
                   LOADING
                ====================================== */

                <div className="rounded-[15px] border border-[#E5E0D5] bg-white p-6 text-center">
                  <p className="text-[11px] font-semibold text-[#6B766F]">
                    समस्याएँ लोड हो रही हैं...
                  </p>
                </div>
              ) : filteredIssues.length === 0 ? (
                /* ======================================
                   NO ISSUES
                ====================================== */

                <div className="rounded-[15px] border border-[#E5E0D5] bg-white p-6 text-center">
                  <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-[#EEF6F1] text-[#176B4D]">
                    ✓
                  </div>

                  <h3 className="text-[13px] font-extrabold text-[#17231D]">
                    अभी तक कोई समस्या दर्ज नहीं हुई है
                  </h3>

                  <p className="mt-1 text-[9px] text-[#6B766F]">
                    आपके वार्ड में अभी कोई समस्या registered नहीं हुई है।
                  </p>

                  <button
                    onClick={reportIssue}
                    className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#F59E0B] px-4 text-[10px] font-extrabold text-[#17231D] transition hover:bg-[#D97706] hover:text-white"
                  >
                    <span className="text-sm">＋</span>
                    समस्या दर्ज करें
                  </button>
                </div>
              ) : (
                /* ======================================
                   REAL ISSUES LIST
                ====================================== */

                <div className="max-h-[420px] overflow-y-auto pr-1">
                  {filteredIssues.map((issue) => {
                    const style =
                      statusStyle[issue.status] || statusStyle.pending;

                    const statusText = style.text || "नई समस्या";

                    const progress = getProgress(issue.status);

                    const location = getAreaText(issue);

                    const createdDate = issue.createdAt
                      ? new Date(issue.createdAt).toLocaleDateString("hi-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "";

                    const createdTime = issue.createdAt
                      ? new Date(issue.createdAt).toLocaleTimeString("hi-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })
                      : "";

                    return (
                      <article
                        key={issue._id}
                        className="mb-2.5 rounded-[15px] border border-[#E5E0D5] bg-white p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#176B4D]/30 hover:shadow-[0_12px_28px_rgba(23,35,29,.07)]"
                      >
                        {/* STATUS + DATE */}

                        <div className="mb-2 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[8px] font-extrabold ${style.badge}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                            />

                            {statusText}
                          </span>

                          <div className="flex flex-col items-end">
                            <span className="text-[12px] text-[#6B766F]">
                              {createdDate}
                            </span>

                            <span className="mt-0.5 text-[10px] text-[#9CA3AF]">
                              🕒 {createdTime}
                            </span>
                          </div>
                        </div>

                        {/* CATEGORY */}

                        <h3 className="mb-1.5 text-[12px] font-bold leading-[1.5]">
                          {issue.category || "समस्या"}
                        </h3>

                        {/* LOCATION */}

                        <div className="mb-2 text-[9px] text-[#6B766F]">
                          📍 {location}
                        </div>

                        {/* DESCRIPTION */}

                        <p className="mb-3 line-clamp-2 text-[9px] leading-[1.6] text-[#6B766F]">
                          {issue.description ||
                            "समस्या का विवरण उपलब्ध नहीं है।"}
                        </p>

                        {/* PROGRESS + VIEW */}

                        <div className="flex items-center justify-between">
                          <div className="flex w-full max-w-[145px] items-center gap-1">
                            {[1, 2, 3, 4].map((step) => (
                              <span
                                key={step}
                                className={`h-[3px] flex-1 rounded-full ${
                                  step <= progress
                                    ? "bg-[#176B4D]"
                                    : "bg-[#E8EBE8]"
                                }`}
                              />
                            ))}
                          </div>

                          <button
                            onClick={() => viewIssue(issue._id)}
                            className="border-none bg-transparent p-1 text-[9px] font-extrabold text-[#176B4D] transition-colors hover:text-[#D97706]"
                          >
                            View Issue →
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}

              {/* ==========================================
                  REAL TOTAL
              ========================================== */}

              <div className="mt-3 flex items-center justify-between rounded-[13px] bg-[#0F4D38] px-3.5 py-3 text-white">
                <div className="flex items-baseline gap-1.5">
                  <strong className="text-[21px]">{issues.length}</strong>

                  <span className="text-[8px] text-white/60">
                    {t("कुल समस्याएँ")}
                  </span>
                </div>

                <div className="text-right text-[8px] leading-[1.5] text-white/70">
                  {
                    issues.filter((issue) => issue.status === "in-progress")
                      .length
                  }{" "}
                  {t("पर कार्रवाई जारी")}
                  <br />
                  {
                    issues.filter((issue) => issue.status === "resolved").length
                  }{" "}
                  {t("का समाधान")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==========================================
          BOTTOM PROCESS BAR
      ========================================== */}

      <div className="absolute bottom-0 left-0 right-0 flex h-12 items-center justify-center gap-1.5 border-t border-[#E5E0D5] bg-[#FFFDF8]/60 px-4 text-center text-[9px] text-[#6B766F] backdrop-blur-lg">
        {t("दर्ज करें")}

        <strong className="text-[#176B4D]">→</strong>

        {t("ट्रैक करें")}

        <strong className="text-[#176B4D]">→</strong>

        {t("समाधान देखें")}

        <strong className="text-[#176B4D]">→</strong>

        {t("जनता के सामने")}
      </div>
    </section>
  );
}
