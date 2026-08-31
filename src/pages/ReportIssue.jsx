import React, { useEffect, useState } from "react";
import axios from "axios";
import IssueSuccessModal from "../popups/IssueSuccessModal";
import VideoLinksInput from "../components/VideoLinksInput";
import { useLanguage } from "../i18n";
// import MapPicker from "../components/MapPicker";

export default function ReportIssue() {
  const { t } = useLanguage();
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [videoLinks, setVideoLinks] = useState([""]);

  // const [location, setLocation] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // ==========================================
  // IMAGE PREVIEW URLS
  // ==========================================
  useEffect(() => {
    const urls = images.map((file) => URL.createObjectURL(file));
    setImagePreviews(urls);

    return () => {
      urls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  // ==========================================
  // SUBMIT PROBLEM
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!category) {
      setError(t("Please select a category."));
      return;
    }

    if (!description.trim()) {
      setError(t("Please enter problem description."));
      return;
    }

    if (description.trim().length > 2000) {
      setError(t("Description cannot exceed 2000 characters."));
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
      // VIDEO LINKS
      // ==========================================

      const cleanVideoLinks = videoLinks
        .map((link) => link.trim())
        .filter(Boolean);

      formData.append("videoLinks", JSON.stringify(cleanVideoLinks));

      // ==========================================
      // DEBUG
      // ==========================================

      console.log("Submitting problem:", {
        category,
        description: description.trim(),
        // latitude: location.latitude,
        // longitude: location.longitude,
        images: images.length,
        videoLinks: cleanVideoLinks,
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
        setShowSuccessModal(true);
        // Reset form
        setCategory("");
        setDescription("");
        setImages([]);
        setVideoLinks([""]);
        // setLocation(null);

        // Reset image input
        const imageInput = document.getElementById("problem-images");
        if (imageInput) {
          imageInput.value = "";
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

    setImages((prev) => {
      const combined = [...prev, ...files];

      if (combined.length > 5) {
        setError(t("Maximum 5 images can be uploaded."));
        return combined.slice(0, 5);
      }

      setError("");
      return combined;
    });

    e.target.value = "";
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white px-4 py-8">
      <div className="mx-auto max-w-3xl">
        {/* ======================================
            HEADER
        ====================================== */}

        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
          {t("Report an Issue")}
        </h1>

        <p className="mt-1 text-sm text-slate-600">
          {t("Upload photos, add video links, and submit your issue.")}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* ====================================
              IMAGES
          ==================================== */}

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5">
            <label
              htmlFor="problem-images"
              className="block text-sm font-semibold text-slate-700"
            >
              {t("Upload Images")}
            </label>

            <p className="mt-1 text-xs text-slate-500">
              {t("JPG, PNG or WEBP · Max 5MB")}
            </p>

            <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {imagePreviews.map((src, index) => (
                <div
                  key={src}
                  className="group relative aspect-square overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"
                >
                  <img
                    src={src}
                    alt={`Preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />

                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-sm leading-none text-white transition hover:bg-black/75"
                    aria-label={`Remove image ${index + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}

              {images.length < 5 && (
                <label
                  htmlFor="problem-images"
                  className="flex aspect-square cursor-pointer flex-col items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 text-slate-400 transition hover:border-indigo-400 hover:bg-indigo-50/50 hover:text-indigo-500"
                >
                  <span className="text-2xl leading-none">+</span>
                  <span className="text-xs font-medium">{t("Upload Photo")}</span>
                </label>
              )}
            </div>

            <input
              id="problem-images"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              onChange={handleImageChange}
            />

            {images.length > 0 && (
              <p className="mt-3 text-xs text-slate-500">
                {images.length}/5 {t("selected")}
              </p>
            )}
          </div>

          {/* ====================================
              VIDEO LINKS
          ==================================== */}

          <VideoLinksInput value={videoLinks} onChange={setVideoLinks} />

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

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5">
            <label
              htmlFor="category"
              className="block text-sm font-semibold text-slate-700"
            >
              {t("Category")} <span className="text-red-500">*</span>
            </label>

            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            >
              <option value="">{t("Select category")}</option>

              <option value="road">{t("Road")}</option>

              <option value="sanitation">{t("Sanitation")}</option>

              <option value="health">{t("Health")}</option>

              <option value="electricity">{t("Electricity")}</option>

              <option value="water">{t("Water")}</option>

              <option value="education">{t("Education")}</option>

              <option value="other">{t("Other")}</option>
            </select>
          </div>

          {/* ====================================
              DESCRIPTION
          ==================================== */}

          <div className="rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5">
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-slate-700"
            >
              {t("Description")} <span className="text-red-500">*</span>
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              rows={4}
              maxLength={2000}
              placeholder={t("Describe the problem...")}
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {description.length}/2000
            </p>
          </div>

          {/* ====================================
              ERROR
          ==================================== */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {error}
            </div>
          )}

          {/* ====================================
              SUBMIT
          ==================================== */}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? t("Submitting...") : t("Submit")}
            </button>
          </div>
        </form>

        {showSuccessModal && (
          <IssueSuccessModal
            onReportAnother={() => {
              setShowSuccessModal(false);
            }}
            onDashboard={() => {
              window.location.href = "/home";
            }}
          />
        )}
      </div>
    </div>
  );
}
