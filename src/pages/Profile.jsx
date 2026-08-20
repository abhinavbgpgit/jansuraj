import React, { useEffect, useState } from "react";
import MembershipCardComponent from "../components/MembershipCardComponent";
import axios from "axios";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        if (!backendUrl) {
          setError("Backend URL is not configured.");
          return;
        }

        // HttpOnly cookie automatically send hogi
        const response = await axios.get(
          `${backendUrl}/api/members/me`,
          {
            withCredentials: true,
          }
        );

        if (response.data?.success) {
          setUser(response.data.member);
        } else {
          setError(
            response.data?.message ||
              "Failed to load profile."
          );
        }
      } catch (error) {
        console.error(
          "Profile fetch error:",
          error.response?.data || error.message
        );

        if (error.response?.status === 401) {
          setError("Please login first.");
          return;
        }

        setError(
          error.response?.data?.message ||
            "Failed to load profile."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-slate-600">
          Loading profile...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <div className="rounded-2xl border border-red-100 bg-red-50 p-6">
          <p className="text-rose-600">
            {error}
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // NO USER
  // ==========================================
  if (!user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-slate-600">
          Profile not found.
        </p>
      </div>
    );
  }

  // ==========================================
  // PROFILE
  // ==========================================
  return (
    <div className="mx-auto max-w-3xl px-4 py-6">

      <h1 className="text-xl font-semibold text-slate-900">
        Profile
      </h1>

      <div className="mt-4 grid gap-4 md:grid-cols-2">

        {/* Membership Card */}
        <div>
          <MembershipCardComponent member={user} />
        </div>

        {/* Other Information */}
        <div>

          <div className="rounded-xl border border-slate-200 bg-white p-4">
            Reported Issues
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-4">
            Volunteer History
          </div>

        </div>

      </div>
    </div>
  );
}