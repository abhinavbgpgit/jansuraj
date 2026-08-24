import React from "react";
import { useLanguage } from "../i18n";

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
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <label className="block text-sm font-semibold text-slate-700">
        {t("वीडियो लिंक")}
      </label>

      <p className="mt-1 text-xs leading-5 text-slate-400">
        अगर आप वीडियो डालना चाहते हैं तो पहले वीडियो को YouTube या Facebook
        पर अपलोड करें और उसका लिंक यहां पेस्ट करें।
      </p>

      <div className="mt-4 space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
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
                className="rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-500 transition hover:bg-red-50"
                aria-label={`वीडियो लिंक ${index + 1} हटाएं`}
              >
                ×
              </button>
            )}
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