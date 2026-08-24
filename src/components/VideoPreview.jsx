import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../i18n";
import { createPortal } from "react-dom";

function getYouTubeEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    // youtube.com/watch?v=VIDEO_ID
    if (
      parsed.hostname.includes("youtube.com") &&
      parsed.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${parsed.searchParams.get("v")}`;
    }

    // youtu.be/VIDEO_ID
    if (parsed.hostname.includes("youtu.be")) {
      const videoId = parsed.pathname.split("/").filter(Boolean)[0];

      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }

    // youtube.com/shorts/VIDEO_ID
    if (parsed.hostname.includes("youtube.com")) {
      const parts = parsed.pathname.split("/").filter(Boolean);

      if (parts[0] === "shorts" && parts[1]) {
        return `https://www.youtube.com/embed/${parts[1]}`;
      }
    }
  } catch {
    return null;
  }

  return null;
}

function getFacebookEmbedUrl(url) {
  try {
    const parsed = new URL(url);

    const isFacebook =
      parsed.hostname.includes("facebook.com") ||
      parsed.hostname.includes("fb.watch");

    if (!isFacebook) {
      return null;
    }

    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
      url
    )}&show_text=false`;
  } catch {
    return null;
  }
}

function getVideoInfo(url) {
  const youtubeUrl = getYouTubeEmbedUrl(url);

  if (youtubeUrl) {
    return {
      type: "YouTube",
      embedUrl: youtubeUrl,
    };
  }

  const facebookUrl = getFacebookEmbedUrl(url);

  if (facebookUrl) {
    return {
      type: "Facebook",
      embedUrl: facebookUrl,
    };
  }

  return null;
}

function VideoPreview({ videos = [] }) {
  const { t } = useLanguage();
  const cleanVideos = useMemo(() => {
    return Array.isArray(videos)
      ? videos.map((url) => url?.trim()).filter(Boolean)
      : [];
  }, [videos]);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedVideo = cleanVideos[selectedIndex];
  const selectedVideoInfo = selectedVideo ? getVideoInfo(selectedVideo) : null;

  // ==========================================
  // RESET SELECTED VIDEO
  // ==========================================

  useEffect(() => {
    if (selectedIndex >= cleanVideos.length) {
      setSelectedIndex(0);
    }
  }, [cleanVideos.length, selectedIndex]);

  // ==========================================
  // ESC KEY
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  // ==========================================
  // BODY SCROLL LOCK
  // ==========================================

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (cleanVideos.length === 0) {
    return null;
  }

  // ==========================================
  // OPEN MODAL
  // ==========================================

  const openModal = () => {
    setSelectedIndex(0);
    setIsOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* ==========================================
          SINGLE VIDEO BUTTON
      ========================================== */}

      <button
        type="button"
        onClick={openModal}
        className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-700 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-sky-100"
      >
        <span className="text-sm">▶</span>

        <span>{cleanVideos.length} वीडियो देखें</span>

        <span className="text-xs">→</span>
      </button>

      {/* ==========================================
          VIDEO MODAL
      ========================================== */}

      {isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/75 p-4 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* ======================================
                MODAL
            ====================================== */}

            <div
              className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
              onClick={(event) => event.stopPropagation()}
            >
              {/* ====================================
                  HEADER
              ==================================== */}

              <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 sm:px-5">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-slate-900 sm:text-base">
                    समस्या से संबंधित वीडियो
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    {cleanVideos.length}{" "}
                    {cleanVideos.length === 1
                      ? "वीडियो उपलब्ध है"
                      : "वीडियो उपलब्ध हैं"}
                  </p>
                </div>

                {/* ==================================
                    CLOSE BUTTON
                ================================== */}

                <button
                  type="button"
                  onClick={closeModal}
                  className="ml-3 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-2xl font-medium leading-none text-slate-600 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-red-50 hover:text-red-500 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-red-100"
                  aria-label={t("Close")}
                >
                  ×
                </button>
              </div>

              {/* ====================================
                  VIDEO
              ==================================== */}

              <div className="min-h-0 overflow-y-auto">
                {selectedVideoInfo ? (
                  <div className="bg-black">
                    <div className="aspect-video w-full">
                      <iframe
                        key={selectedVideo}
                        src={selectedVideoInfo.embedUrl}
                        title={`${selectedVideoInfo.type} वीडियो ${
                          selectedIndex + 1
                        }`}
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-64 items-center justify-center bg-slate-50 px-6">
                    <p className="text-sm font-medium text-red-500">
                      यह वीडियो लिंक उपलब्ध नहीं है।
                    </p>
                  </div>
                )}

                {/* ==================================
                    VIDEO SELECTOR
                ================================== */}

                {cleanVideos.length > 1 && (
                  <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
                    <div className="mb-3">
                      <p className="text-sm font-bold text-slate-800">
                        दूसरा वीडियो देखें
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        नीचे से वीडियो चुनें।
                      </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {cleanVideos.map((video, index) => {
                        const info = getVideoInfo(video);
                        const isSelected = index === selectedIndex;

                        return (
                          <button
                            key={`${video}-${index}`}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 ${
                              isSelected
                                ? "border-sky-300 bg-sky-50 text-sky-700 shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-slate-50"
                            }`}
                          >
                            <span
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm ${
                                isSelected
                                  ? "bg-sky-600 text-white"
                                  : "bg-slate-100 text-slate-500"
                              }`}
                            >
                              {index + 1}
                            </span>

                            <span className="min-w-0">
                              <span className="block text-sm font-semibold">
                                वीडियो {index + 1}
                              </span>

                              <span className="mt-0.5 block text-xs text-slate-500">
                                {info?.type || "वीडियो लिंक"}
                              </span>
                            </span>

                            {isSelected && (
                              <span className="ml-auto text-sky-600">✓</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* ==================================
                    INVALID LINKS
                ================================== */}

                {cleanVideos.some((video) => !getVideoInfo(video)) && (
                  <div className="border-t border-amber-200 bg-amber-50 px-4 py-3">
                    <p className="text-xs font-medium text-amber-700">
                      कुछ वीडियो लिंक सही नहीं हैं। कृपया उन्हें जांचें।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}

export default VideoPreview;
