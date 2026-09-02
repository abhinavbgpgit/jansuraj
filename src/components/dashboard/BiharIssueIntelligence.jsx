import React from "react";
import StatsOverview from "./StatsOverview";
import IssueHotspots from "./IssueHotspots";
import TopCategories from "./TopCategories";
import TopDistricts from "./TopDistricts";
import TopWards from "./TopWards";
import IssueTrends from "./IssueTrends";
import CriticalIssues from "./CriticalIssues";
import LongestPending from "./LongestPending";
import DistrictPerformance from "./DistrictPerformance";
import RecentActivity from "./RecentActivity";
import WhatBiharNeeds from "./WhatBiharNeeds";

// ==========================================
// "बिहार इशू इंटेलिजेंस" — homepage dashboard।
// Har section apna alag component + apna alag
// API endpoint use karta hai (dashboard folder
// dekho), taaki future me kisi ek section ko
// badalna ho to poora page chhedne ki zaroorat
// na pade.
// ==========================================
export default function BiharIssueIntelligence() {
  return (
    <section className="bg-[#FBF8F1] py-12">
      <div className="mx-auto max-w-6xl space-y-6 px-4">
        <div className="mb-2">
          <h1 className="text-2xl font-black tracking-tight text-[#17231D] sm:text-3xl">
            🇮🇳 बिहार इशू इंटेलिजेंस
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-[#6B766F]">
            समस्या कहाँ सबसे ज़्यादा है, किस तरह की सबसे ज़्यादा है, और सिस्टम
            कितना असरदार जवाब दे रहा है — तीनों सवालों के जवाब एक जगह।
          </p>
        </div>

        <StatsOverview />
        <IssueHotspots />
        <TopCategories />

        <div className="grid gap-6 lg:grid-cols-2">
          <TopDistricts />
          <TopWards />
        </div>

        <IssueTrends />
        <CriticalIssues />
        <LongestPending />
        <DistrictPerformance />
        <RecentActivity />
        <WhatBiharNeeds />
      </div>
    </section>
  );
}
