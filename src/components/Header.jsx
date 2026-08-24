import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

import userFemale from "../assets/user_female.jpg";
import { useLanguage } from "../i18n";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  const navigate = useNavigate();
  const location = useLocation();
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const hamburgerRef = useRef(null);

  // ==========================================
  // CHECK CURRENT LOGIN
  // ==========================================
  const checkCurrentUser = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setLoggedIn(false);
        setUser(null);
        return;
      }

      const response = await axios.get(
        `${backendUrl}/api/auth/me`,
        { withCredentials: true }
      );

      if (response.data?.success && response.data?.member) {
        setLoggedIn(true);
        setUser(response.data.member);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    } catch (error) {
      if (error.response?.status !== 401) {
        console.error(
          "Check current user error:",
          error.response?.data || error.message
        );
      }
      setLoggedIn(false);
      setUser(null);
    }
  };

  useEffect(() => {
    checkCurrentUser();
  }, []);

  useEffect(() => {
    const handleAuthChange = () => checkCurrentUser();
    window.addEventListener("jansuraaj_auth_change", handleAuthChange);
    return () =>
      window.removeEventListener("jansuraaj_auth_change", handleAuthChange);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !hamburgerRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
    } finally {
      setLoggedIn(false);
      setUser(null);
      setMenuOpen(false);
      navigate("/");
    }
  };

  const navItems = [
    { to: "/home", label: t("Dashboard") },
    { to: "/purpose", label: t("Purpose") },
    { to: "/issues", label: t("Issues") },
  ];

  return (
    <>
      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dropdown-enter {
          animation: slideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top right;
        }
        .mobile-menu-enter {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: top center;
        }
      `}</style>

      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/90 backdrop-blur-xl shadow-sm shadow-slate-200/60"
            : "bg-white/80 backdrop-blur-md"
        } border-b border-slate-200/70`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3.5">

          {/* ==========================================
              BRAND NAME (no logo)
          ========================================== */}
          <Link to="/" className="group flex items-center gap-2">
            <span className="text-[17px] font-bold tracking-tight text-slate-900 transition-colors group-hover:text-indigo-600">
              Jansuraj Bhagalpur
            </span>
          </Link>

          {/* ==========================================
              DESKTOP NAV
          ========================================== */}
          <nav className="hidden items-center gap-1 lg:flex">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                  location.pathname === item.to
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ==========================================
              RIGHT SIDE ACTIONS
          ========================================== */}
          <div className="flex items-center gap-2">

            {/* MODERN LANGUAGE TOGGLE (Desktop) */}
            <div className="hidden lg:block">
              <div className="relative flex h-9 items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                {/* Sliding indicator */}
                <span
                  className={`absolute top-0.5 h-8 w-[4.25rem] rounded-full bg-white shadow-sm shadow-slate-200/80 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                    language === "en" ? "left-0.5" : "left-[4.45rem]"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`relative z-10 w-[4.25rem] text-sm font-medium transition-colors duration-200 ${
                    language === "en" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`relative z-10 w-[4.25rem] text-sm font-medium transition-colors duration-200 ${
                    language === "hi" ? "text-indigo-600" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  हिं
                </button>
              </div>
            </div>

            {/* DESKTOP LOGIN BUTTON */}
            {!loggedIn && (
              <Link
                to="/login"
                className="hidden h-9 items-center rounded-full bg-indigo-600 px-4 text-sm font-medium text-white transition-all duration-200 hover:bg-indigo-700 hover:shadow-md hover:shadow-indigo-200 active:scale-95 lg:flex"
              >
                {t("Login")}
              </Link>
            )}

            {/* PROFILE SECTION */}
            {loggedIn && (
              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-1.5 py-1 transition-all duration-200 hover:border-indigo-300"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-200 ring-1 ring-slate-100">
                    <img
                      src={user?.photo || userFemale}
                      alt={user?.name ? `${user.name} avatar` : t("User avatar")}
                      className="h-full w-full object-cover"
                    />
                  </span>
                  <span className="hidden pr-2 text-sm font-medium text-slate-700 lg:inline-block">
                    {user?.name || t("User")}
                  </span>
                  <svg
                    className={`hidden h-4 w-4 text-slate-500 transition-transform duration-200 lg:block ${
                      menuOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {menuOpen && (
                  <div className="dropdown-enter absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg shadow-slate-300/20">
                    <div className="border-b border-slate-100 px-4 py-2.5">
                      <div className="text-xs text-slate-400">
                        {t("Signed in as")}
                      </div>
                      <div className="truncate text-sm font-semibold text-slate-800">
                        {user?.name || t("User")}
                      </div>
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-indigo-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {t("Profile")}
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2.5 border-t border-slate-100 px-4 py-2.5 text-left text-sm text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      {t("Logout")}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* MOBILE HAMBURGER */}
            <button
              type="button"
              ref={hamburgerRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white transition-colors hover:border-indigo-300 lg:hidden"
              aria-label="Toggle menu"
            >
              <div className="relative h-3 w-4">
                <span
                  className={`absolute left-0 top-0 h-[1.5px] w-full bg-slate-700 transition-all duration-300 ${
                    mobileMenuOpen ? "translate-y-[5px] rotate-45" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[5px] h-[1.5px] w-full bg-slate-700 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                />
                <span
                  className={`absolute left-0 top-[10px] h-[1.5px] w-full bg-slate-700 transition-all duration-300 ${
                    mobileMenuOpen ? "-translate-y-[5px] -rotate-45" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* ==========================================
            MOBILE MENU
        ========================================== */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="mobile-menu-enter border-t border-slate-200 bg-white/98 backdrop-blur-xl lg:hidden"
          >
            <nav className="mx-auto max-w-6xl space-y-1 px-4 py-3">
              {navItems.map((item, idx) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`block rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    location.pathname === item.to
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  style={{
                    animation: `fadeInUp 0.3s ease-out ${idx * 50}ms both`,
                  }}
                >
                  {item.label}
                </Link>
              ))}

              <div
                className="mt-2 flex gap-2 border-t border-slate-100 pt-3"
                style={{ animation: `fadeInUp 0.3s ease-out 150ms both` }}
              >
                {!loggedIn && (
                  <Link
                    to="/login"
                    className="flex-1 rounded-full bg-indigo-600 py-2.5 text-center text-sm font-medium text-white active:scale-95"
                  >
                    {t("Login")}
                  </Link>
                )}

                {/* MOBILE LANGUAGE TOGGLE */}
                <div className="relative flex h-10 items-center rounded-full border border-slate-200 bg-slate-50 p-0.5">
                  <span
                    className={`absolute top-0.5 h-9 w-16 rounded-full bg-white shadow-sm transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      language === "en" ? "left-0.5" : "left-[4.15rem]"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setLanguage("en")}
                    className={`relative z-10 w-16 text-sm font-medium ${
                      language === "en" ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage("hi")}
                    className={`relative z-10 w-16 text-sm font-medium ${
                      language === "hi" ? "text-indigo-600" : "text-slate-500"
                    }`}
                  >
                    हिं
                  </button>
                </div>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}