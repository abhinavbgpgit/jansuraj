import React from "react";
import { useLanguage } from "../i18n";

function getVideoEmbed(rawUrl) {
  const url = (rawUrl || "").trim();
  if (!url) return null;

  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    return null;
  }

  const host = parsed.hostname.replace(/^www\./, "");

  // ==========================================
  // YOUTUBE
  // ==========================================
  if (host === "youtu.be") {
    const id = parsed.pathname.slice(1);
    if (id) return { type: "youtube", id };
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (parsed.pathname === "/watch") {
      const id = parsed.searchParams.get("v");
      if (id) return { type: "youtube", id };
    }

    if (parsed.pathname.startsWith("/shorts/")) {
      const id = parsed.pathname.split("/")[2];
      if (id) return { type: "youtube", id };
    }

    if (parsed.pathname.startsWith("/embed/")) {
      const id = parsed.pathname.split("/")[2];
      if (id) return { type: "youtube", id };
    }
  }

  // ==========================================
  // FACEBOOK
  // ==========================================
  if (host === "facebook.com" || host === "fb.watch" || host === "m.facebook.com") {
    return { type: "facebook", url };
  }

  return null;
}

function VideoPreview({ url, index }) {
  const { t } = useLanguage();
  const embed = getVideoEmbed(url);

  if (!embed) return null;

  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-slate-200 bg-black">
      <div className="aspect-video w-full">
        {embed.type === "youtube" ? (
          <iframe
            src={`https://www.youtube.com/embed/${embed.id}`}
            title={`YouTube preview ${index + 1}`}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <iframe
            src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(
              embed.url
            )}&show_text=false`}
            title={`Facebook preview ${index + 1}`}
            className="h-full w-full"
            style={{ border: "none" }}
            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
            allowFullScreen
          />
        )}
      </div>
      <p className="bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300">
        {embed.type === "youtube"
          ? t("YouTube preview")
          : t("Facebook preview")}
      </p>
    </div>
  );
}

function VideoLinksInput({ value = [""], onChange }) {
  const { t } = useLanguage();
  const links = Array.isArray(value) && value.length > 0 ? value : [""];

  const updateLink = (index, newValue) => {
    const updatedLinks = [...links];
    updatedLinks[index] = newValue;
    onChange(updatedLinks);
  };

  const addLink = () => {
    onChange([...links, ""]);
  };

  const removeLink = (index) => {
    if (links.length === 1) {
      onChange([""]);
      return;
    }

    onChange(links.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5">
      <label className="block text-sm font-semibold text-slate-700">
        {t("वीडियो लिंक")}
      </label>

      <p className="mt-1 text-xs leading-5 text-slate-500">
        अगर आप वीडियो डालना चाहते हैं तो पहले वीडियो को YouTube या Facebook पर
        अपलोड करें और उसका लिंक यहां पेस्ट करें।
      </p>

      <div className="mt-4 space-y-3">
        {links.map((link, index) => (
          <div key={index}>
            <div className="flex gap-2">
              <input
                type="url"
                value={link}
                onChange={(e) => updateLink(index, e.target.value)}
                placeholder={t("YouTube या Facebook वीडियो लिंक डालें")}
                className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />

              {links.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeLink(index)}
                  className="shrink-0 rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                  aria-label={`वीडियो लिंक ${index + 1} हटाएं`}
                >
                  ×
                </button>
              )}
            </div>

            <VideoPreview url={link} index={index} />
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addLink}
        className="mt-4 rounded-xl border border-sky-200 bg-sky-50 px-4 py-2.5 text-sm font-semibold text-sky-600 transition hover:bg-sky-100"
      >
        + और वीडियो लिंक जोड़ें
      </button>
    </div>
  );
}

export default VideoLinksInput;
