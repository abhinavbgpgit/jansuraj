import React from "react";
import { useLanguage } from "../i18n";

const SIZES = {
  md: {
    wrap: "h-10",
    pillBase: "top-1 h-8 w-16",
    pillLeftEn: "left-1",
    pillLeftHi: "left-[4.25rem]",
    btn: "w-16 text-sm",
  },
  sm: {
    wrap: "h-9",
    pillBase: "top-0.5 h-8 w-14",
    pillLeftEn: "left-0.5",
    pillLeftHi: "left-[3.65rem]",
    btn: "w-14 text-xs",
  },
};

export default function LanguageToggle({ className = "", size = "md" }) {
  const { language, setLanguage } = useLanguage();
  const s = SIZES[size] || SIZES.md;

  return (
    <div
      className={`relative inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-0.5 shadow-inner ${s.wrap} ${className}`}
    >
      <span
        className={`absolute rounded-full bg-gradient-to-r from-indigo-500 to-sky-500 shadow-md shadow-indigo-300/50 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${s.pillBase} ${
          language === "en" ? s.pillLeftEn : s.pillLeftHi
        }`}
      />
      <button
        type="button"
        onClick={() => setLanguage("en")}
        className={`relative z-10 rounded-full font-semibold transition-colors duration-300 ${s.btn} ${
          language === "en" ? "text-white" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        EN
      </button>
      <button
        type="button"
        onClick={() => setLanguage("hi")}
        className={`relative z-10 rounded-full font-semibold transition-colors duration-300 ${s.btn} ${
          language === "hi" ? "text-white" : "text-slate-500 hover:text-slate-700"
        }`}
      >
        हिं
      </button>
    </div>
  );
}
