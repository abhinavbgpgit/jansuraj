import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import joinImage from "../assets/jansuraj_join_image.png";
import mobileJoinImage from "../assets/mobile_view_login_image.png";
import logo from "../assets/jansuraj_logo.png";
import { useLanguage } from "../i18n";

export default function Landing() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  // ==========================================
  // CHECK CURRENT LOGIN
  // ==========================================
  useEffect(() => {
    const checkCurrentUser = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          console.error("VITE_BACKEND_URL is not configured");
          return;
        }

        const response = await axios.get(
          `${backendUrl}/api/auth/me`,
          {
            withCredentials: true,
          }
        );

        // Agar valid login session hai
        if (
          response.data?.success &&
          response.data?.member
        ) {
          navigate("/home", { replace: true });
        }
      } catch (error) {
        // 401 ka matlab user logged in nahi hai.
        // Landing page par rehna hai.
        if (error.response?.status !== 401) {
          console.error(
            "Landing auth check error:",
            error.response?.data || error.message
          );
        }
      }
    };

    checkCurrentUser();
  }, [navigate]);

  return (
    <div className="h-[calc(100vh-72px)] md:px-4 md:py-[7vh] px-0 py-0">
      <div className="mx-auto w-full md:max-w-[55vw] md:min-w-[300px] overflow-hidden md:rounded-[12px]">
        <div className="relative">

          {/* Desktop Image */}
          <img
            src={joinImage}
            alt="Jansuraaj"
            className="hidden h-full w-full min-h-[420px] object-cover md:block"
          />

          {/* Mobile Image */}
          <img
            src={mobileJoinImage}
            alt="Jansuraaj mobile"
            className="h-full w-full min-h-[420px] object-cover md:hidden"
          />

          {/* Buttons */}
          <div className="absolute inset-x-0 bottom-24 max-[1300px]:bottom-14 px-3 py-3">

            <div className="grid md:flex md:justify-center md:items-center w-[95%] mx-auto justify-items-center gap-2">

              {/* ==========================================
                  JOIN
              ========================================== */}
              <Link
                to="/join"
                className="w-full max-w-[360px] mx-auto"
              >
                <div className="flex items-center gap-4 rounded-2xl px-4 py-3 min-h-[64px] bg-gradient-to-r from-emerald-500 to-teal-400 text-white shadow-lg hover:shadow-2xl transform transition hover:-translate-y-1">

                  <img
                    src={logo}
                    alt="Jansuraaj"
                    className="h-12 w-12 rounded-full bg-white/20 p-1"
                  />

                  <div className="text-left">
                    <div className="text-sm font-semibold">
                      {t("Join Jansuraaj")}
                    </div>

                    <div className="mt-1 text-xs opacity-90">
                      {t("Create your member profile and verify your phone for login.")}
                    </div>
                  </div>

                </div>
              </Link>

              {/* ==========================================
                  LOGIN
              ========================================== */}
              <Link
                to="/login"
                className="w-full max-w-[340px] mx-auto"
              >
                <div className="flex items-center gap-4 rounded-2xl px-4 py-3 min-h-[64px] bg-white border border-slate-200 shadow-sm hover:shadow-md transform transition hover:-translate-y-1">

                  <img
                    src={logo}
                    alt="Jansuraaj"
                    className="h-12 w-12 rounded-full bg-slate-100 p-1"
                  />

                  <div className="text-left">
                    <div className="text-sm font-semibold text-slate-900">
                      {t("Login to Jansuraaj")}
                    </div>

                    <div className="mt-1 text-xs text-slate-600">
                      {t("Login to report an issue")}
                    </div>
                  </div>

                </div>
              </Link>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}