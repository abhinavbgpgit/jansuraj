import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function PhotoPreview({ photos = [] }) {
  const validPhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];

  const [selectedIndex, setSelectedIndex] = useState(null);

  const closeViewer = () => {
    setSelectedIndex(null);
  };

  const showPrevious = () => {
    setSelectedIndex((current) => {
      if (current === null || validPhotos.length === 0) return current;

      return current === 0 ? validPhotos.length - 1 : current - 1;
    });
  };

  const showNext = () => {
    setSelectedIndex((current) => {
      if (current === null || validPhotos.length === 0) return current;

      return current === validPhotos.length - 1 ? 0 : current + 1;
    });
  };

  // ==========================================
  // KEYBOARD CONTROLS
  // ==========================================

  useEffect(() => {
    if (selectedIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeViewer();
      }

      if (e.key === "ArrowLeft") {
        showPrevious();
      }

      if (e.key === "ArrowRight") {
        showNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Background scroll lock
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [selectedIndex]);

  // ==========================================
  // NO PHOTOS
  // ==========================================

  if (validPhotos.length === 0) {
    return null;
  }

  // ==========================================
  // PREVIEW
  // ==========================================

  const previewPhotos = validPhotos.slice(0, 2);
  const remainingPhotos = validPhotos.length - 4;

  return (
    <>
      {/* ==========================================
          PHOTO PREVIEW
      ========================================== */}

      <div className="mt-5">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-slate-700">
            📷 फोटो ({validPhotos.length})
          </p>

          {validPhotos.length > 1 && (
            <span className="text-xs text-slate-400">फोटो पर क्लिक करें</span>
          )}
        </div>

        {/* Photos Grid */}
        <div
          className={`grid gap-2 ${
            validPhotos.length === 1 ? "grid-cols-1" : "grid-cols-2"
          }`}
        >
          {previewPhotos.map((photo, index) => {
            const isLastPreview = index === 3 && remainingPhotos > 0;

            return (
              <button
                key={`${photo}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100 text-left shadow-sm transition duration-200 hover:border-slate-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
              >
                <img
                  src={photo}
                  alt={`Issue photo ${index + 1}`}
                  loading="lazy"
                  className={`w-full object-cover transition duration-300 group-hover:scale-105 ${
                    validPhotos.length === 1 ? "h-52 sm:h-56" : "h-32 sm:h-36"
                  }`}
                />

                {/* Dark hover overlay */}
                <span className="absolute inset-0 bg-black/0 transition duration-200 group-hover:bg-black/20" />

                {/* Zoom button */}
                <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-sm text-white opacity-0 shadow-sm backdrop-blur transition duration-200 group-hover:opacity-100">
                  🔍
                </span>

                {/* Remaining photos */}
                {isLastPreview && (
                  <span className="absolute inset-0 flex items-center justify-center bg-black/55 text-lg font-bold text-white backdrop-blur-[1px]">
                    +{remainingPhotos} और
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* View all */}
        {validPhotos.length > 1 && (
          <button
            type="button"
            onClick={() => setSelectedIndex(0)}
            className="mt-3 inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-4 py-2 text-sm font-semibold text-sky-600 transition hover:border-sky-300 hover:bg-sky-100"
          >
            📷 सभी फोटो देखें ({validPhotos.length}) →
          </button>
        )}
      </div>

      {/* ==========================================
          FULLSCREEN PHOTO VIEWER
          PORTAL = document.body
      ========================================== */}

      {selectedIndex !== null &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex h-[100dvh] w-full items-center justify-center bg-black/90 p-3 sm:p-5"
            onClick={closeViewer}
          >
            {/* ==================================
                TOP BAR
            ================================== */}

            <div className="absolute left-3 right-3 top-3 z-20 flex items-center justify-between sm:left-5 sm:right-5 sm:top-5">
              {/* Counter */}
              <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md">
                {selectedIndex + 1} / {validPhotos.length}
              </div>

              {/* Close */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  closeViewer();
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-2xl leading-none text-white backdrop-blur-md transition hover:bg-white/25"
                aria-label="Close photo viewer"
              >
                ×
              </button>
            </div>

            {/* ==================================
                PREVIOUS BUTTON
            ================================== */}

            {validPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showPrevious();
                }}
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-xl transition hover:scale-105 sm:left-5"
                aria-label="Previous photo"
              >
                ←
              </button>
            )}

            {/* ==================================
                MAIN CONTENT
            ================================== */}

            <div
              className="flex max-h-[92dvh] max-w-[94vw] flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Main Photo */}
              <div className="flex max-h-[75dvh] max-w-[94vw] items-center justify-center sm:max-h-[78dvh]">
                <img
                  src={validPhotos[selectedIndex]}
                  alt={`Issue photo ${selectedIndex + 1}`}
                  className="max-h-[75dvh] max-w-[92vw] rounded-xl object-contain shadow-2xl sm:max-h-[78dvh] sm:max-w-[88vw]"
                />
              </div>

              {/* ==================================
                  THUMBNAILS
              ================================== */}

              {validPhotos.length > 1 && (
                <div className="mt-4 flex max-w-[90vw] gap-2 overflow-x-auto rounded-2xl bg-white/10 p-2 backdrop-blur-md">
                  {validPhotos.map((photo, index) => (
                    <button
                      key={`${photo}-thumb-${index}`}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIndex(index);
                      }}
                      className={`shrink-0 overflow-hidden rounded-lg border-2 transition ${
                        selectedIndex === index
                          ? "border-sky-400 opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img
                        src={photo}
                        alt={`Thumbnail ${index + 1}`}
                        className="h-12 w-16 object-cover sm:h-14 sm:w-20"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ==================================
                NEXT BUTTON
            ================================== */}

            {validPhotos.length > 1 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  showNext();
                }}
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-xl font-medium text-slate-900 shadow-xl transition hover:scale-105 sm:right-5"
                aria-label="Next photo"
              >
                →
              </button>
            )}
          </div>,
          document.body
        )}
    </>
  );
}
