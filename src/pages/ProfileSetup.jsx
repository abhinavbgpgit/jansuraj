import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth, db } from "../firebase/firebase";

import {
  doc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

const ProfileSetup = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    fatherName: "",
    district: "",
    block: "",
    panchayat: "",
    gender: "",
    age: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!auth.currentUser) {
      navigate("/join", { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitProfile = async (e) => {
    e.preventDefault();

    setError("");

    const user = auth.currentUser;

    if (!user) {
      navigate("/join");
      return;
    }

    if (!formData.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!formData.district.trim()) {
      setError("Please enter your district.");
      return;
    }

    if (!formData.gender) {
      setError("Please select gender.");
      return;
    }

    try {
      setLoading(true);

      const userRef = doc(db, "users", user.uid);

      await setDoc(userRef, {
        uid: user.uid,

        name: formData.name.trim(),

        fatherName: formData.fatherName.trim(),

        phone: user.phoneNumber || "",

        district: formData.district.trim(),

        block: formData.block.trim(),

        panchayat: formData.panchayat.trim(),

        gender: formData.gender,

        age: formData.age
          ? Number(formData.age)
          : null,

        createdAt: serverTimestamp(),

        updatedAt: serverTimestamp(),
      });

      alert("Welcome to Jansuraaj!");

      navigate("/", {
        replace: true,
      });

    } catch (error) {
      console.error("Profile save error:", error);

      setError(
        error.message ||
        "Failed to create your profile."
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-cyan-50 px-4 py-8">

      <div className="max-w-xl mx-auto bg-white rounded-3xl shadow-xl p-7">

        <div className="flex justify-center mb-5">

          <div className="w-20 h-20 rounded-full overflow-hidden shadow-md">

            <img
              src="/jansuraaj-logo.png"
              alt="Jansuraaj"
              className="w-full h-full object-cover"
            />

          </div>

        </div>

        <h1 className="text-3xl font-semibold text-center">
          Complete Your Profile
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Welcome to Jansuraaj
        </p>

        <form
          onSubmit={submitProfile}
          className="mt-8 space-y-5"
        >

          {/* Name */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Full Name *
            </label>

            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* Father Name */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Father's Name
            </label>

            <input
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              placeholder="Enter father's name"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* District */}
          <div>

            <label className="block text-sm font-medium mb-2">
              District *
            </label>

            <input
              name="district"
              value={formData.district}
              onChange={handleChange}
              placeholder="Enter district"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* Block */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Block
            </label>

            <input
              name="block"
              value={formData.block}
              onChange={handleChange}
              placeholder="Enter block"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* Panchayat */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Panchayat
            </label>

            <input
              name="panchayat"
              value={formData.panchayat}
              onChange={handleChange}
              placeholder="Enter panchayat"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* Age */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Age
            </label>

            <input
              name="age"
              type="number"
              min="1"
              max="120"
              value={formData.age}
              onChange={handleChange}
              placeholder="Enter age"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            />

          </div>

          {/* Gender */}
          <div>

            <label className="block text-sm font-medium mb-2">
              Gender *
            </label>

            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-cyan-400"
            >

              <option value="">
                Select gender
              </option>

              <option value="male">
                Male
              </option>

              <option value="female">
                Female
              </option>

              <option value="other">
                Other
              </option>

            </select>

          </div>

          {error && (
            <p className="text-red-500 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 text-white py-3.5 rounded-xl font-semibold disabled:opacity-60"
          >
            {loading
              ? "Creating Account..."
              : "CREATE ACCOUNT"}
          </button>

        </form>

      </div>

    </div>
  );
};

export default ProfileSetup;