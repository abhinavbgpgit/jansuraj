import React, { useState } from "react";
import axios from "axios";
import IssueSuccessModal from "../popups/IssueSuccessModal";
// import MapPicker from "../components/MapPicker";

export default function ReportIssue() {
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [videos, setVideos] = useState([]);

  // const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ==========================================
  // SUBMIT PROBLEM
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!category) {
      setError("Please select a category.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter problem description.");
      return;
    }

    if (description.trim().length > 2000) {
      setError("Description cannot exceed 2000 characters.");
      return;
    }

    // if (
    //   location?.latitude === undefined ||
    //   location?.latitude === null ||
    //   location?.longitude === undefined ||
    //   location?.longitude === null
    // ) {
    //   setError("Please select problem location on the map.");
    //   return;
    // }

    // ==========================================
    // SUBMIT
    // ==========================================

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setError("Backend URL is not configured.");
        return;
      }

      // ==========================================
      // FORM DATA
      // ==========================================

      const formData = new FormData();

      // Problem category
      formData.append("category", category);

      // Problem description
      formData.append("description", description.trim());

      // Latitude
      // formData.append(
      //   "latitude",
      //   String(location.latitude)
      // );

      // Longitude
      // formData.append(
      //   "longitude",
      //   String(location.longitude)
      // );

      // ==========================================
      // IMAGES
      // ==========================================

      images.forEach((file) => {
        formData.append("photos", file);
      });

      // ==========================================
      // VIDEOS
      // ==========================================

      videos.forEach((file) => {
        formData.append("videos", file);
      });

      // ==========================================
      // DEBUG
      // ==========================================

      console.log("Submitting problem:", {
        category,
        description: description.trim(),
        // latitude: location.latitude,
        // longitude: location.longitude,
        images: images.length,
        videos: videos.length,
      });

      // ==========================================
      // API REQUEST
      // ==========================================

      const response = await axios.post(
        `${backendUrl}/api/problems`,
        formData,
        {
          // HttpOnly authentication cookie
          // automatically backend ko bheji jayegi
          withCredentials: true,
        }
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      if (response.data?.success) {
        setSuccess("");
        setShowSuccessModal(true);
        // Reset form
        setCategory("");
        setDescription("");
        setImages([]);
        setVideos([]);
        // setLocation(null);

        // Reset image input
        const imageInput = document.getElementById("problem-images");

        // Reset video input
        const videoInput = document.getElementById("problem-videos");

        if (imageInput) {
          imageInput.value = "";
        }

        if (videoInput) {
          videoInput.value = "";
        }
      } else {
        setError(response.data?.message || "Failed to report problem.");
      }
    } catch (error) {
      console.error("Report problem error:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });

      // Unauthorized
      if (error.response?.status === 401) {
        setError("Your login session has expired. Please login again.");

        return;
      }

      setError(error.response?.data?.message || "Failed to report problem.");
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // IMAGE SELECT
  // ==========================================

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    setImages(files);
  };

  // ==========================================
  // VIDEO SELECT
  // ==========================================

  const handleVideoChange = (e) => {
    const files = Array.from(e.target.files || []);

    setVideos(files);
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="mx-auto max-w-3xl px-4 py-6">
      {/* ======================================
          HEADER
      ====================================== */}

      <h1 className="text-xl font-semibold">Report an Issue</h1>

      <p className="mt-1 text-sm text-slate-600">
        Upload photos/videos and submit your issue.
      </p>

      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        {/* ====================================
            IMAGES
        ==================================== */}

        <div className="rounded-xl border p-4">
          <label htmlFor="problem-images" className="block text-sm font-medium">
            Upload Images
          </label>

          <input
            id="problem-images"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="mt-2"
            onChange={handleImageChange}
          />

          {images.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {images.length} image(s) selected
            </p>
          )}
        </div>

        {/* ====================================
            VIDEOS
        ==================================== */}

        <div className="rounded-xl border p-4">
          <label htmlFor="problem-videos" className="block text-sm font-medium">
            Upload Videos
          </label>

          <input
            id="problem-videos"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            multiple
            className="mt-2"
            onChange={handleVideoChange}
          />

          {videos.length > 0 && (
            <p className="mt-2 text-xs text-slate-500">
              {videos.length} video(s) selected
            </p>
          )}
        </div>

        {/* ====================================
            LOCATION
        ==================================== */}

        {/* <MapPicker
          onLocationSelect={setLocation}
        />

        {location && (
          <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
            <span>
              Location selected:
            </span>

            <span className="ml-1 font-medium">
              {location.latitude.toFixed(6)},{" "}
              {location.longitude.toFixed(6)}
            </span>
          </div>
        )} */}

        {/* ====================================
            CATEGORY
        ==================================== */}

        <div className="rounded-xl border p-4">
          <label htmlFor="category" className="block text-sm font-medium">
            Category
          </label>

          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-2 w-full rounded border p-2"
          >
            <option value="">Select category</option>

            <option value="road">Road</option>

            <option value="sanitation">Sanitation</option>

            <option value="health">Health</option>

            <option value="electricity">Electricity</option>

            <option value="water">Water</option>

            <option value="education">Education</option>

            <option value="other">Other</option>
          </select>
        </div>

        {/* ====================================
            DESCRIPTION
        ==================================== */}

        <div className="rounded-xl border p-4">
          <label htmlFor="description" className="block text-sm font-medium">
            Description
          </label>

          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-2 w-full rounded border p-2"
            rows={4}
            maxLength={2000}
            placeholder="Describe the problem..."
          />

          <p className="mt-1 text-right text-xs text-slate-400">
            {description.length}/2000
          </p>
        </div>

        {/* ====================================
            ERROR
        ==================================== */}

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ====================================
            SUCCESS
        ==================================== */}

        {/* {success && (
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
        )} */}

        {/* ====================================
            SUBMIT
        ==================================== */}

        <div className="flex items-center justify-end">
          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-sky-600 px-5 py-2 text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
        </div>
      </form>
      {showSuccessModal && (
        <IssueSuccessModal
          onReportAnother={() => {
            setShowSuccessModal(false);
          }}
          onDashboard={() => {
            window.location.href = "/bihar-dashboard";
          }}
        />
      )}
    </div>
  );
}
