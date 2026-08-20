import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import logo from "../assets/jansuraj_logo.png";
import userFemale from "../assets/user_female.jpg";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const menuRef = useRef(null);

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
      {
        withCredentials: true,
      }
    );

    if (
      response.data?.success &&
      response.data?.member
    ) {
      setLoggedIn(true);
      setUser(response.data.member);
    } else {
      setLoggedIn(false);
      setUser(null);
    }
  } catch (error) {
    // Logged-out user ke liye 401 normal hai.
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

  // ==========================================
  // INITIAL LOGIN CHECK
  // ==========================================
  useEffect(() => {
    checkCurrentUser();
  }, []);

  // ==========================================
  // LOGIN / LOGOUT EVENT
  // ==========================================
  useEffect(() => {
    const handleAuthChange = () => {
      checkCurrentUser();
    };

    window.addEventListener(
      "jansuraaj_auth_change",
      handleAuthChange
    );

    return () => {
      window.removeEventListener(
        "jansuraaj_auth_change",
        handleAuthChange
      );
    };
  }, []);

  // ==========================================
  // CLOSE MENU WHEN CLICK OUTSIDE
  // ==========================================
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // ==========================================
  // LOGOUT
  // ==========================================
  const handleLogout = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        {
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data || error.message
      );
    } finally {
      // Frontend state clear
      setLoggedIn(false);
      setUser(null);
      setMenuOpen(false);

      // Home par bhejo
      navigate("/");

      // Kisi bhi localStorage token/user ko touch nahi karna
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/60 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">

        {/* ==========================================
            LOGO
        ========================================== */}
        <Link to="/" className="flex items-center gap-3">
          <img
            src={logo}
            alt="Jansuraaj logo"
            className="h-10 w-10 rounded-xl object-cover"
          />

          <div>
            <div className="text-sm font-semibold">
              Jansuraaj
            </div>
          </div>
        </Link>

        {/* ==========================================
            NAVIGATION
        ========================================== */}
        <nav className="hidden items-center gap-4 md:flex">

          <Link
            to="/home"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Home
          </Link>

          <Link
            to="/purpose"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Purpose
          </Link>

          <Link
            to="/issues"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Issues
          </Link>

          <Link
            to="/notifications"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Alerts
          </Link>

          <Link
            to="/bihar-dashboard"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Dashboard
          </Link>

          <Link
            to="/search"
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Search
          </Link>

        </nav>

        {/* ==========================================
            LOGIN / PROFILE
        ========================================== */}
        <div
          className="flex items-center gap-3"
          ref={menuRef}
        >

          {!loggedIn ? (

            <Link
              to="/login"
              className="rounded-full border border-slate-200/60 bg-white px-3 py-1 text-sm text-slate-700 transition hover:border-slate-300"
            >
              Login
            </Link>

          ) : (

            <div className="relative">

              {/* PROFILE BUTTON */}
              <button
                type="button"
                onClick={() =>
                  setMenuOpen((open) => !open)
                }
                className="flex items-center gap-2 rounded-full border border-slate-200/60 bg-white px-2 py-1 transition hover:border-slate-300"
              >

                {/* PROFILE PHOTO */}
                <span className="inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-slate-200">

                  <img
                    src={user?.photo || userFemale}
                    alt={
                      user?.name
                        ? `${user.name} avatar`
                        : "User avatar"
                    }
                    className="h-full w-full object-cover"
                  />

                </span>

                {/* NAME */}
                <span className="hidden pr-4 text-sm font-medium text-slate-700 md:inline-block">
                  {user?.name || "User"}
                </span>

                {/* THREE DOTS */}
                <span className="flex items-center gap-1 pr-2 text-xl leading-none text-slate-600">

                  <span>·</span>
                  <span>·</span>
                  <span>·</span>

                </span>

              </button>

              {/* ======================================
                  DROPDOWN
              ====================================== */}
              <div
                className={`absolute right-0 mt-2 w-48 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl transition ${
                  menuOpen
                    ? "block"
                    : "hidden"
                }`}
              >

                <Link
                  to="/profile"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Profile
                </Link>

                <Link
                  to="/notifications"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Notifications
                </Link>

                <Link
                  to="/bihar-dashboard"
                  onClick={() =>
                    setMenuOpen(false)
                  }
                  className="block px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-50"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left text-sm text-rose-600 transition hover:bg-slate-50"
                >
                  Logout
                </button>

              </div>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}