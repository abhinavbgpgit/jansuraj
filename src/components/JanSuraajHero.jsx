import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { issues } from "../data/issues";
import { useLanguage } from "../i18n";

export default function JanSuraajHero() {
  const { t } = useLanguage();
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const filteredIssues =
    filter === "all"
      ? issues
      : issues.filter((issue) => issue.status === filter);

  const viewIssue = (id) => {
    navigate(`/issues/${id}`);
  };

  const reportIssue = () => {
    navigate("/report");
  };

  const exploreIssues = () => {
    navigate("/issues");
  };

  const statusStyle = {
    new: {
      badge: "bg-[#FEF0ED] text-[#C24132]",
      dot: "bg-[#C24132]",
    },
    progress: {
      badge: "bg-[#FFF6DD] text-[#A16207]",
      dot: "bg-[#F59E0B]",
    },
    done: {
      badge: "bg-[#EEF6F1] text-[#21845A]",
      dot: "bg-[#21845A]",
    },
  };

  return (
    <section className="relative min-h-[760px] overflow-hidden bg-[#FBF8F1] text-[#17231D]">
      <div
        className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(23,35,29,.025)_1px,transparent_1px),linear-gradient(90deg,rgba(23,35,29,.025)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_90%)]"
      />

      <div className="pointer-events-none absolute -right-32 -top-32 h-[430px] w-[430px] rounded-full bg-[#F59E0B]/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 -left-40 h-[430px] w-[430px] rounded-full bg-[#176B4D]/10 blur-3xl" />

      <div className="relative z-10 mx-auto grid min-h-[760px] w-[calc(100%-30px)] max-w-[1200px] items-center gap-10 py-12 lg:grid-cols-[minmax(0,1fr)_minmax(430px,.85fr)] lg:gap-[75px] lg:py-0">
        <div className="animate-[heroIn_.8s_ease_forwards]">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#176B4D]/15 bg-[#EEF6F1]/80 px-3 py-2 text-[11px] font-extrabold text-[#176B4D]">
            <span className="h-2 w-2 rounded-full bg-[#21845A] shadow-[0_0_0_5px_rgba(33,132,90,.10)] animate-pulse" />
            {t("बिहार के हर वार्ड की आवाज़")}
          </div>

          <h1 className="mb-6 max-w-[680px] text-[42px] font-black leading-[1.1] tracking-[-1.8px] sm:text-[50px] lg:text-[67px] lg:tracking-[-2.5px]">
            आपके वार्ड की <span className="relative text-[#D97706]">
              {t("समस्या,")}
              <span className="absolute -bottom-1 left-0 right-0 h-[7px] -rotate-1 rounded-full bg-[#F59E0B]/20" />
            </span>{" "}
            {t("अब पूरे बिहार के सामने।")}
          </h1>

          <p className="mb-8 max-w-[610px] text-[14px] leading-[1.9] text-[#6B766F] sm:text-[15px] lg:text-[16px]">
            {t("सड़क, पानी, नाली, बिजली या किसी भी सार्वजनिक समस्या को दर्ज कीजिए। उसकी स्थिति देखिए, कार्रवाई की टाइमलाइन देखिए और जानिए कि समस्या कहाँ तक पहुँची।")}
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

        <div className="relative animate-[panelIn_.9s_.15s_ease_forwards] opacity-100">
          <div className="pointer-events-none absolute -right-14 -top-12 -z-10 h-[120px] w-[120px] rounded-full bg-[#F59E0B]/10" />

          <div className="rounded-[27px] border border-[#17231D]/10 bg-[#FFFDF8]/95 p-4 shadow-[0_30px_75px_rgba(23,35,29,.11)] backdrop-blur-xl lg:h-[650px]">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EEF6F1] text-lg text-[#176B4D]">⌖</div>
                <div>
                  <strong className="block text-[14px]">भागलपुर • वार्ड 24</strong>
                  <span className="mt-0.5 block text-[9px] text-[#6B766F]">इस वार्ड में अभी क्या हो रहा है?</span>
                </div>
              </div>
              <button
                onClick={exploreIssues}
                className="border-none bg-transparent text-[10px] font-extrabold text-[#176B4D] transition-colors hover:text-[#D97706]"
              >
                {t("सभी देखें →")}
              </button>
            </div>

            <div className="mb-3 flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {[
                ["all", "सभी"],
                ["new", "नई"],
                ["progress", "कार्रवाई जारी"],
                ["done", "समाधान हुआ"],
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

            <div className="grid gap-2.5">
              <div className="max-h-[420px] overflow-y-auto pr-1">
                {filteredIssues.map((issue) => {
                  const style = statusStyle[issue.status];
                  return (
                    <article
                      key={issue.id}
                      className="rounded-[15px] border border-[#E5E0D5] bg-white p-3.5 transition-all duration-200 hover:-translate-y-1 hover:border-[#176B4D]/30 hover:shadow-[0_12px_28px_rgba(23,35,29,.07)]"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[8px] font-extrabold ${style.badge}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                          {issue.statusText}
                        </span>
                        <span className="text-[8px] text-[#6B766F]">{issue.days}</span>
                      </div>
                      <h3 className="mb-1.5 text-[12px] font-bold leading-[1.5]">{issue.title}</h3>
                      <div className="mb-3 text-[9px] text-[#6B766F]">📍 {issue.location}</div>
                      <div className="flex items-center justify-between">
                        <div className="flex w-full max-w-[145px] items-center gap-1">
                          {[1, 2, 3, 4].map((step) => (
                            <span
                              key={step}
                              className={`h-[3px] flex-1 rounded-full ${
                                step <= issue.progress ? "bg-[#176B4D]" : "bg-[#E8EBE8]"
                              }`}
                            />
                          ))}
                        </div>
                        <button
                          onClick={() => viewIssue(issue.id)}
                          className="border-none bg-transparent p-1 text-[9px] font-extrabold text-[#176B4D] transition-colors hover:text-[#D97706]"
                        >
                          View Issue →
                        </button>
                      </div>
                    </article>
                  );
                })}
              </div>

              <div className="mt-3 flex items-center justify-between rounded-[13px] bg-[#0F4D38] px-3.5 py-3 text-white">
                <div className="flex items-baseline gap-1.5">
                  <strong className="text-[21px]">27</strong>
                  <span className="text-[8px] text-white/60">{t("कुल समस्याएँ")}</span>
                </div>
                <div className="text-right text-[8px] leading-[1.5] text-white/70">
                  {t("18 पर कार्रवाई जारी")}
                  <br />
                  {t("9 का समाधान")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
