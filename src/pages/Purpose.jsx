import React from "react";

const Purpose = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">

      {/* ================= HERO ================= */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-orange-500 blur-3xl" />
          <div className="absolute bottom-0 -left-20 h-72 w-72 rounded-full bg-indigo-500 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-6xl px-5 py-20 md:px-8 md:py-28">

          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm backdrop-blur">
            🇮🇳 बिहार के लिए एक डिजिटल पहल
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-6xl">
            हम क्या बना रहे हैं?
          </h1>

          <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            एक ऐसा Digital Public Platform जहाँ बिहार के किसी भी क्षेत्र की
            समस्या सिर्फ दर्ज होकर गायब न हो जाए, बल्कि उसकी पूरी यात्रा
            जनता के सामने दिखाई दे।
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#purpose"
              className="rounded-xl bg-orange-500 px-6 py-3 font-bold text-white shadow-lg transition hover:bg-orange-600"
            >
              पूरा Purpose पढ़ें ↓
            </a>

            <a
              href="#how-it-works"
              className="rounded-xl border border-white/20 bg-white/10 px-6 py-3 font-semibold backdrop-blur transition hover:bg-white/20"
            >
              कैसे काम करेगा?
            </a>
          </div>
        </div>
      </section>


      {/* ================= ONE LINE ================= */}
      <section className="mx-auto max-w-5xl px-5 py-12 md:px-8">

        <div className="rounded-3xl border border-orange-100 bg-white p-7 text-center shadow-sm md:p-12">

          <div className="mb-4 text-4xl">💡</div>

          <h2 className="text-2xl font-black md:text-4xl">
            आसान भाषा में समझिए
          </h2>

          <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-slate-600 md:text-xl">
            अगर आपके वार्ड में सड़क नहीं बनी, नाली नहीं बनी, पानी की समस्या है,
            बिजली की समस्या है या कोई दूसरा सार्वजनिक मुद्दा है,
            तो उसे इस platform पर दर्ज किया जा सकेगा।
          </p>

          <div className="mt-7 rounded-2xl bg-slate-900 px-5 py-6 text-lg font-bold leading-8 text-white md:text-2xl">
            समस्या दर्ज होगी → उसकी स्थिति दिखाई देगी →
            कार्रवाई की Timeline बनेगी → और समाधान होने तक उसका record रहेगा।
          </div>

        </div>
      </section>


      {/* ================= PURPOSE ================= */}
      <section id="purpose" className="mx-auto max-w-6xl px-5 py-14 md:px-8">

        <div className="mb-10">
          <span className="font-bold text-orange-600">01 / PURPOSE</span>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            इसकी जरूरत क्यों है?
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            आज किसी मोहल्ले या वार्ड में समस्या होने पर सबसे बड़ी परेशानी
            सिर्फ समस्या होना नहीं है। परेशानी यह भी है कि आम आदमी को अक्सर
            यह पता नहीं चलता कि उसकी समस्या का हुआ क्या।
          </p>
        </div>


        <div className="grid gap-5 md:grid-cols-2">

          {[
            {
              icon: "❓",
              title: "समस्या किसके पास पहुँची?",
              text: "शिकायत दर्ज होने के बाद वह किस विभाग या जिम्मेदार स्तर तक पहुँची, इसकी जानकारी मिल सके।",
            },
            {
              icon: "⏳",
              title: "कब तक समाधान होगा?",
              text: "अगर कोई अनुमानित समय है तो वह Timeline में दिखाई दे सके।",
            },
            {
              icon: "🔎",
              title: "अभी स्थिति क्या है?",
              text: "Pending, Verification, Action या Work in Progress जैसी स्थिति साफ दिखाई दे।",
            },
            {
              icon: "✅",
              title: "वास्तव में काम हुआ या नहीं?",
              text: "समस्या के समाधान के बाद उसका completion record और उपलब्ध evidence रखा जा सके।",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="mb-4 text-3xl">{item.icon}</div>

              <h3 className="text-xl font-bold">
                {item.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {item.text}
              </p>
            </div>
          ))}

        </div>

      </section>


      {/* ================= EXAMPLE ================= */}
      <section className="bg-slate-900 py-16 text-white">

        <div className="mx-auto max-w-6xl px-5 md:px-8">

          <div className="mb-10">
            <span className="font-bold text-orange-400">
              02 / EXAMPLE
            </span>

            <h2 className="mt-2 text-3xl font-black md:text-5xl">
              मान लीजिए वार्ड नंबर 24 में सड़क नहीं बनी
            </h2>

            <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-300">
              अभी यह समस्या सिर्फ वार्ड के लोगों की समस्या है।
              इस platform पर आने के बाद इसे structured public issue में बदला
              जा सकता है।
            </p>
          </div>


          <div className="grid gap-4 md:grid-cols-5">

            {[
              ["01", "Problem Reported", "समस्या दर्ज"],
              ["02", "Verified", "समस्या की पुष्टि"],
              ["03", "Authority Notified", "संबंधित स्तर को सूचना"],
              ["04", "Work In Progress", "काम चल रहा है"],
              ["05", "Resolved", "समस्या का समाधान"],
            ].map((item, index) => (

              <div
                key={index}
                className="relative rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
              >
                <div className="text-sm font-bold text-orange-400">
                  {item[0]}
                </div>

                <div className="mt-3 text-lg font-bold">
                  {item[1]}
                </div>

                <div className="mt-2 text-sm text-slate-400">
                  {item[2]}
                </div>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= TIMELINE ================= */}
      <section className="mx-auto max-w-5xl px-5 py-16 md:px-8">

        <div className="text-center">

          <span className="font-bold text-orange-600">
            03 / TIMELINE
          </span>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            हर समस्या की अपनी Timeline
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            शिकायत दर्ज करके छोड़ देना उद्देश्य नहीं है।
            असली उद्देश्य है कि समस्या के समाधान की यात्रा दिखाई दे।
          </p>

        </div>


        <div className="relative mt-12">

          <div className="absolute left-5 top-0 h-full w-0.5 bg-slate-200 md:left-1/2" />

          {[
            {
              date: "10 अगस्त",
              title: "समस्या दर्ज",
              text: "वार्ड के नागरिक ने सड़क की समस्या report की।",
              color: "bg-blue-500",
            },
            {
              date: "12 अगस्त",
              title: "Verification",
              text: "समस्या की जानकारी और उपलब्ध evidence की जाँच।",
              color: "bg-yellow-500",
            },
            {
              date: "15 अगस्त",
              title: "Action Initiated",
              text: "संबंधित विभाग / जिम्मेदार स्तर को मामला भेजा गया।",
              color: "bg-orange-500",
            },
            {
              date: "25 अगस्त",
              title: "Work Started",
              text: "निर्माण कार्य शुरू हुआ।",
              color: "bg-purple-500",
            },
            {
              date: "15 सितंबर",
              title: "Resolved",
              text: "कार्य पूरा हुआ और issue को resolved किया गया।",
              color: "bg-green-500",
            },
          ].map((item, index) => (

            <div
              key={index}
              className={`relative mb-10 flex ${
                index % 2 === 0
                  ? "md:justify-start"
                  : "md:justify-end"
              }`}
            >

              <div className="ml-12 w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:ml-0 md:w-[45%]">

                <div className="flex items-center gap-3">

                  <span
                    className={`h-3 w-3 rounded-full ${item.color}`}
                  />

                  <span className="text-sm font-bold text-slate-500">
                    {item.date}
                  </span>

                </div>

                <h3 className="mt-3 text-xl font-black">
                  {item.title}
                </h3>

                <p className="mt-2 leading-7 text-slate-600">
                  {item.text}
                </p>

              </div>

            </div>

          ))}

        </div>

      </section>


      {/* ================= LOCAL + BIHAR ================= */}
      <section className="bg-orange-50 py-16">

        <div className="mx-auto max-w-6xl px-5 md:px-8">

          <div className="grid items-center gap-10 md:grid-cols-2">

            <div>

              <span className="font-bold text-orange-600">
                04 / LOCAL + BIHAR
              </span>

              <h2 className="mt-3 text-3xl font-black md:text-5xl">
                Local भी, Bihar-level भी
              </h2>

              <p className="mt-5 text-lg leading-8 text-slate-600">
                Platform की सबसे महत्वपूर्ण सोच यही है कि यह केवल
                “एक बड़ी वेबसाइट” न बने। यह हर छोटे क्षेत्र तक पहुँचे।
              </p>

            </div>


            <div className="rounded-3xl bg-white p-6 shadow-sm">

              {[
                "🇮🇳 बिहार",
                "↓",
                "📍 जिला",
                "↓",
                "📍 प्रखंड",
                "↓",
                "📍 पंचायत",
                "↓",
                "📍 गाँव / क्षेत्र",
                "↓",
                "📍 वार्ड",
              ].map((item, index) => (

                <div
                  key={index}
                  className={`py-1 text-center ${
                    item === "↓"
                      ? "text-slate-300"
                      : "font-bold text-slate-800"
                  }`}
                >
                  {item}
                </div>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* ================= MEMBERSHIP ================= */}
      <section className="mx-auto max-w-6xl px-5 py-16 md:px-8">

        <div className="mb-10">

          <span className="font-bold text-orange-600">
            05 / JOIN
          </span>

          <h2 className="mt-2 text-3xl font-black md:text-5xl">
            Join Jan Suraaj
          </h2>

          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            Platform का दूसरा महत्वपूर्ण हिस्सा digital membership होगा,
            जहाँ इच्छुक व्यक्ति अपनी आवश्यक जानकारी देकर जुड़ सकेगा।
          </p>

        </div>


        <div className="grid gap-5 md:grid-cols-3">

          {[
            ["👤", "Member Registration", "नाम, मोबाइल, क्षेत्र, वार्ड, profession और आवश्यक जानकारी।"],
            ["📷", "Profile Photo", "Member profile के साथ photo को securely manage किया जा सकेगा।"],
            ["🪪", "Digital Card", "Registration के बाद digital membership card generate किया जा सकेगा।"],
          ].map((item, index) => (

            <div
              key={index}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <div className="text-3xl">{item[0]}</div>

              <h3 className="mt-4 text-xl font-black">
                {item[1]}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">
                {item[2]}
              </p>
            </div>

          ))}

        </div>

        <div className="mt-6 rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900">
          <strong>Privacy Principle:</strong> केवल आवश्यक जानकारी ली जाएगी।
          Aadhaar जैसी अत्यधिक संवेदनशील जानकारी को अनिवार्य नहीं बनाया जाएगा।
        </div>

      </section>


      {/* ================= TRANSPARENCY ================= */}
      <section className="bg-slate-950 py-16 text-white">

        <div className="mx-auto max-w-6xl px-5 md:px-8">

          <div className="max-w-3xl">

            <span className="font-bold text-orange-400">
              06 / FUTURE VISION
            </span>

            <h2 className="mt-3 text-3xl font-black md:text-5xl">
              आगे सिर्फ शिकायत नहीं, Transparency
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-300">
              भविष्य में platform को development works और public spending
              की verified information को समझने योग्य तरीके से public करने
              की दिशा में बढ़ाया जा सकता है।
            </p>

          </div>


          <div className="mt-10 grid gap-4 md:grid-cols-4">

            {[
              ["💰", "Fund", "कितना पैसा उपलब्ध हुआ?"],
              ["📋", "Allocation", "कहाँ खर्च करने की योजना है?"],
              ["🏗️", "Project", "कौन सा काम हो रहा है?"],
              ["📊", "Progress", "काम कहाँ तक पहुँचा?"],
            ].map((item, index) => (

              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >

                <div className="text-3xl">
                  {item[0]}
                </div>

                <h3 className="mt-4 text-xl font-bold">
                  {item[1]}
                </h3>

                <p className="mt-2 text-slate-400">
                  {item[2]}
                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* ================= NOT JUST WEBSITE ================= */}
      <section className="mx-auto max-w-5xl px-5 py-16 text-center md:px-8">

        <span className="font-bold text-orange-600">
          07 / BIGGER PICTURE
        </span>

        <h2 className="mt-3 text-3xl font-black md:text-5xl">
          यह सिर्फ एक Website नहीं है
        </h2>

        <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
          Website इसका पहला रूप है। असली उद्देश्य एक ऐसा digital ecosystem
          बनाना है जिसमें जनता, स्थानीय समस्याएँ, public information और
          progress एक structured system में जुड़ सकें।
        </p>


        <div className="mt-10 grid gap-5 md:grid-cols-3">

          <div className="rounded-3xl bg-blue-50 p-7">
            <div className="text-4xl">👥</div>
            <h3 className="mt-4 text-xl font-black">
              People
            </h3>
            <p className="mt-3 text-slate-600">
              जनता अपनी समस्या और अपने क्षेत्र की जरूरत सामने रख सके।
            </p>
          </div>

          <div className="rounded-3xl bg-orange-50 p-7">
            <div className="text-4xl">🏛️</div>
            <h3 className="mt-4 text-xl font-black">
              Governance
            </h3>
            <p className="mt-3 text-slate-600">
              समस्या का workflow और progress structured तरीके से track हो।
            </p>
          </div>

          <div className="rounded-3xl bg-green-50 p-7">
            <div className="text-4xl">📊</div>
            <h3 className="mt-4 text-xl font-black">
              Transparency
            </h3>
            <p className="mt-3 text-slate-600">
              Verified information और progress जनता के सामने उपलब्ध हो।
            </p>
          </div>

        </div>

      </section>


      {/* ================= CORE WORKFLOW ================= */}
      <section id="how-it-works" className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 text-white">

        <div className="mx-auto max-w-5xl px-5 text-center md:px-8">

          <span className="font-bold text-orange-100">
            CORE WORKFLOW
          </span>

          <h2 className="mt-3 text-3xl font-black md:text-5xl">
            पूरा विचार सिर्फ 6 शब्दों में
          </h2>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">

            {[
              "Report",
              "Verify",
              "Track",
              "Act",
              "Resolve",
              "Public Record",
            ].map((item, index) => (

              <React.Fragment key={item}>

                <div className="rounded-xl bg-white px-5 py-3 font-black text-orange-600 shadow-lg">
                  {item}
                </div>

                {index !== 5 && (
                  <span className="hidden text-2xl font-bold md:block">
                    →
                  </span>
                )}

              </React.Fragment>

            ))}

          </div>

        </div>

      </section>


      {/* ================= FINAL MESSAGE ================= */}
      <section className="bg-slate-50 px-5 py-20 text-center">

        <div className="mx-auto max-w-4xl">

          <div className="text-5xl">
            🇮🇳
          </div>

          <h2 className="mt-6 text-3xl font-black leading-tight md:text-5xl">
            समस्या छोटी हो सकती है,
            <br />
            लेकिन उसकी आवाज़ छोटी नहीं होनी चाहिए।
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            शुरुआत एक वार्ड से हो सकती है।
            लेकिन सही architecture के साथ वही system पूरे बिहार तक
            scale किया जा सकता है।
          </p>

          <div className="mt-10 rounded-2xl bg-slate-900 px-6 py-7 text-lg font-bold leading-8 text-white shadow-xl md:text-2xl">
            “हर समस्या दर्ज हो,
            हर कार्रवाई दिखाई दे,
            और हर समाधान का रिकॉर्ड जनता के सामने हो।”
          </div>

        </div>

      </section>


      {/* ================= FOOTER ================= */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 text-center text-sm text-slate-500">

        <p>
          Jan Suraaj Digital Public Platform
        </p>

        <p className="mt-1">
          Initial Concept: Bhagalpur → Future Vision: Bihar
        </p>

      </footer>

    </div>
  );
};

export default Purpose;
