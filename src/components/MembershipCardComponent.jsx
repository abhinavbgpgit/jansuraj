import React, { useRef, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import html2canvas from "html2canvas";
import { useLanguage } from "../i18n";

// ==========================================
// "68f0c1..." (Mongo ObjectId) -> "JSR-C1AB-2934"
// har member ka ek readable, stable card number
// ==========================================
function formatMemberId(id) {
  if (!id) return "JSR-0000-0000";

  const clean = String(id).toUpperCase().replace(/[^0-9A-F]/g, "");
  const tail = clean.slice(-8).padStart(8, "0");
  return `JSR-${tail.slice(0, 4)}-${tail.slice(4)}`;
}

// ==========================================
// "+919570452929" -> "+91 95704 52929"
// ==========================================
function formatPhone(phone) {
  if (!phone) return "";

  const match = String(phone).match(/^(\+\d{1,3})(\d{5})(\d{5})$/);
  return match ? `${match[1]} ${match[2]} ${match[3]}` : phone;
}

export default function MembershipCardComponent({ member = {} }) {
  const { t } = useLanguage();
  const [flipped, setFlipped] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const flipWrapperRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);

  const {
    name = "Your Name",
    _id = "",
    phone = "",
    photo = "",
    district = "",
    ward = "",
    block = "",
    panchayat = "",
    localBody = "",
    areaType = "rural",
    profession = "",
    education = "",
    registrationStatus = "",
    memberSince = "",
  } = member;

  const memberId = formatMemberId(_id);
  const isVerified = registrationStatus === "completed";
  const areaLine = areaType === "urban" ? localBody : panchayat || block;

  const qrValue = JSON.stringify({
    id: memberId,
    name,
    phone: formatPhone(phone),
    district,
    area: areaLine,
    ward,
    profession,
    education,
    verified: isVerified,
    memberSince,
  });

  async function handleDownload(e) {
    e.stopPropagation();

    const node = flipped ? backRef.current : frontRef.current;
    if (!node || downloading) return;

    setDownloading(true);

    // The wrapper carries rotateY(180deg) when flipped, and the back
    // face carries its own rotateY(180deg) to cancel that out on screen.
    // html2canvas captures the target node in isolation but still walks
    // up through the cloned ancestor chain, so if either 3D rotation is
    // left in place the capture comes out mirrored/reordered. Neutralise
    // both (plus the transition, so nothing is mid-flip) before capturing.
    const wrapperNode = flipWrapperRef.current;
    const hadWrapperTransform = wrapperNode.style.transform;
    const hadWrapperTransition = wrapperNode.style.transition;
    const hadNodeTransform = node.style.transform;

    wrapperNode.style.setProperty("transition", "none", "important");
    wrapperNode.style.setProperty("transform", "none", "important");
    node.style.setProperty("transform", "none", "important");

    try {
      const canvas = await html2canvas(node, {
        scale: 3,
        backgroundColor: "#ffffff",
        useCORS: true,
      });

      const link = document.createElement("a");
      link.download = `jansuraaj-card-${flipped ? "back" : "front"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Card download error:", err);
    } finally {
      wrapperNode.style.transform = hadWrapperTransform;
      wrapperNode.style.transition = hadWrapperTransition;
      node.style.transform = hadNodeTransform;
      setDownloading(false);
    }
  }

  function handleFlip(e) {
    e.stopPropagation();
    setFlipped((f) => !f);
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div
        className="relative mx-auto aspect-[2/1] w-full cursor-pointer select-none [perspective:1600px]"
        onClick={() => setFlipped((f) => !f)}
        role="button"
        tabIndex={0}
        aria-label={t("Tap to flip")}
      >
        <div
          ref={flipWrapperRef}
          className={`relative h-full w-full transition-transform duration-700 ease-in-out [transform-style:preserve-3d] ${
            flipped ? "[transform:rotateY(180deg)]" : ""
          }`}
        >
          {/* ==========================================
              FRONT — photo, name, member id, phone
          ========================================== */}
          <div
            ref={frontRef}
            className="absolute inset-0 flex flex-col overflow-hidden border border-slate-200 bg-gradient-to-br from-white via-orange-50/60 to-emerald-50/60 shadow-lg [backface-visibility:hidden]"
          >
            <div className="flex items-center justify-between px-4 pt-3 sm:px-5 sm:pt-4">
              <div className="flex items-center gap-1.5">
                <span
                  className="inline-block h-3 w-4 shrink-0"
                  style={{
                    background: "linear-gradient(to bottom, #F97316 50%, #16A34A 50%)",
                    clipPath: "polygon(100% 0, 0% 50%, 100% 100%)",
                  }}
                  aria-hidden="true"
                />
                <span className="text-sm font-extrabold tracking-tight text-slate-900 sm:text-base">
                  जनसुराज
                </span>
              </div>

              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                {t("Digital Member Card")}
              </span>
            </div>

            <div className="mt-1 flex flex-1 items-center gap-3 px-4 sm:gap-4 sm:px-5">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="h-24 w-24 shrink-0 rounded-xl border-2 border-white object-cover shadow-sm sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border-2 border-white bg-slate-200 text-xl font-bold text-slate-500 shadow-sm sm:h-28 sm:w-28">
                  {(name || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate pb-0.5 text-base font-bold leading-snug text-slate-900 sm:text-lg">
                  {name}
                </p>

                {isVerified && (
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-full bg-transparent px-1.5 py-0.5 text-[9px] font-semibold text-emerald-700 sm:text-[10px]">
                    ✓ {t("Verified member")}
                  </span>
                )}

                <p className="mt-1 text-[11px] font-medium text-slate-600 sm:text-xs">
                  {t("Member ID")}: {memberId}
                </p>

                {phone && (
                  <p className="text-[11px] font-medium text-slate-600 sm:text-xs">
                    📱 {formatPhone(phone)}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between px-4 pb-2 pt-2 sm:px-5">
              <p className="text-[9px] text-slate-500 sm:text-[10px]">
                {memberSince ? `${t("Member since:")} ${memberSince}` : ""}
              </p>

              <p className="text-[9px] italic text-slate-400 sm:text-[10px]">
                ⟲
              </p>
            </div>

            <div
              className="h-1.5 w-full shrink-0"
              style={{
                background: "linear-gradient(to right, #F97316, #ffffff, #16A34A)",
              }}
              aria-hidden="true"
            />
          </div>

          {/* ==========================================
              BACK — address, occupation, QR code
          ========================================== */}
          <div
            ref={backRef}
            className="absolute inset-0 flex flex-col overflow-hidden border border-slate-200 bg-white shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]"
          >
            <div className="flex items-center justify-between px-4 pt-3 sm:px-5 sm:pt-4">
              <span className="text-xs font-bold text-slate-900 sm:text-sm">
                {t("Membership details")}
              </span>
              <span className="text-[9px] font-semibold uppercase tracking-wider text-slate-500 sm:text-[10px]">
                {memberId}
              </span>
            </div>

            <div className="mt-2 flex flex-1 items-stretch gap-3 px-4 sm:gap-4 sm:px-5">
              <div className="min-w-0 flex-1 space-y-1.5 text-[11px] text-slate-700 sm:text-xs">
                <p>
                  <span className="font-bold text-slate-900">{t("District")}:</span>{" "}
                  {district || "—"}
                </p>

                {areaType === "urban" ? (
                  <p>
                    <span className="font-bold text-slate-900">
                      {t("Urban local body")}:
                    </span>{" "}
                    {localBody || "—"}
                  </p>
                ) : (
                  <p>
                    <span className="font-bold text-slate-900">
                      {t("Gram panchayat")}:
                    </span>{" "}
                    {panchayat || block || "—"}
                  </p>
                )}

                <p>
                  <span className="font-bold text-slate-900">{t("Ward")}:</span>{" "}
                  {ward || "—"}
                </p>

                <p>
                  <span className="font-bold text-slate-900">{t("Profession")}:</span>{" "}
                  {profession || "—"}
                </p>

                <p>
                  <span className="font-bold text-slate-900">{t("Education")}:</span>{" "}
                  {education || "—"}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-center justify-center gap-1">
                <div className="rounded-lg border border-slate-200 bg-white p-1.5 shadow-sm">
                  <QRCodeSVG
                    value={qrValue}
                    size={78}
                    level="M"
                    bgColor="#ffffff"
                    fgColor="#0f172a"
                  />
                </div>
                <p className="max-w-[90px] text-center text-[8px] leading-tight text-slate-400 sm:text-[9px]">
                  {t("Scan for full details")}
                </p>
              </div>
            </div>

            <p className="px-4 pb-2 text-center text-[8px] leading-tight text-slate-400 sm:px-5 sm:text-[9px]">
              {t("This is a digital membership card issued by Jansuraaj.")}
            </p>

            <div
              className="h-1.5 w-full shrink-0"
              style={{
                background: "linear-gradient(to right, #F97316, #ffffff, #16A34A)",
              }}
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={handleFlip}
          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
        >
          🔄 {flipped ? t("View front") : t("View back")}
        </button>

        <button
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="rounded-full bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {downloading ? "..." : `⬇️ ${t("Download PNG")}`}
        </button>
      </div>
    </div>
  );
}
