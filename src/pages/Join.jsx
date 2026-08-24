import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProgressStepper from "../components/ProgressStepper";
import areaData from "../data/area.json";
import districts from "../data/districts.json";
import axios from "axios";
import AddressConfirmModal from "../popups/AddressConfirmModal";
import { useLanguage } from "../i18n";

function LocationPicker({
  districtId,
  areaType,
  value,
  onChange,
  type = "localBody",
}) {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const district = areaData?.districts?.[districtId];

  const locations =
    type === "district"
      ? districts
      : areaType === "rural"
      ? district?.rural?.panchayats || []
      : district?.urban?.local_bodies || [];

  const selected = locations.find((item) => item.id === value);
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = locations.filter((item) => {
    const hindiName = String(item.name || "").toLowerCase();
    const englishName = String(item.name_en || "").toLowerCase();

    if (!normalizedSearch) return true;

    return (
      hindiName.includes(normalizedSearch) ||
      englishName.includes(normalizedSearch)
    );
  });

  const title =
    type === "district"
      ? "जिला"
      : areaType === "rural"
      ? "ग्राम पंचायत"
      : "नगर निकाय";

  const placeholder =
    type === "district"
      ? "जिला खोजें / Search district"
      : areaType === "rural"
      ? "ग्राम पंचायत खोजें..."
      : "नगर निकाय खोजें...";

  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {title} <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        <div className="relative">
          <input
            type="text"
            value={value ? inputValue || selected?.name || "" : search}
            placeholder={placeholder}
            onFocus={() => {
              setOpen(true);

              if (value && selected) {
                const selectedName = selected.name || "";

                setInputValue(selectedName);
                setSearch(selectedName);
              }
            }}
            onChange={(e) => {
              const nextValue = e.target.value;

              setInputValue(nextValue);
              setSearch(nextValue);

              if (value) {
                onChange("");
              }

              setOpen(true);
            }}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-11 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
          />

          <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>
        </div>

        {open && !value && (
          <>
            <div
              className="fixed inset-0 z-20"
              onClick={() => setOpen(false)}
            />
            <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-64 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl">
              {filtered.length > 0 ? (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onChange(item.id);
                      setInputValue(item.name || "");
                      setSearch("");
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-left transition hover:bg-green-50"
                  >
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {item.name}
                      </p>
                      {item.name_en && (
                        <p className="mt-0.5 text-xs text-slate-400">
                          {item.name_en}
                        </p>
                      )}
                    </div>
                    <span className="text-slate-300">›</span>
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-center">
                  <div className="text-2xl">🔎</div>
                  <p className="mt-2 text-sm font-medium text-slate-600">
                    कोई परिणाम नहीं मिला
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    नाम दोबारा जाँचकर लिखें।
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      <p className="mt-1.5 text-xs text-slate-400">
        नाम लिखकर खोजें या सूची में से चुनें।
      </p>
    </div>
  );
}

function WardPicker({ value, onChange }) {
  return (
    <div className="mt-4">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        वार्ड <span className="text-red-500">*</span>
      </label>

      <div className="relative">
        {/* Permanent "वार्ड" text */}
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
          वार्ड
        </span>

        <input
          type="text"
          inputMode="numeric"
          value={value || ""}
          onChange={(e) => {
            // केवल number allow होगा
            const wardNumber = e.target.value.replace(/\D/g, "");
            onChange(wardNumber);
          }}
          placeholder="नंबर लिखें"
          className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
        />
      </div>

      <p className="mt-2 text-xs text-slate-400">अपना वार्ड नंबर लिखें</p>
    </div>
  );
}

export default function Join() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    photo: "",
    name: "",
    education: "",
    profession: "",
    skills: "",
    social: "",
    // aadhaar: "",
    district: "",
    block: "",
    panchayat: "",
    village: "",
    areaType: "",
    localBody: "",
    ward: "",
    location: null,
    phone: "",
  });
  const [errors, setErrors] = useState({});
  // const [otp, setOtp] = useState("");
  const [memberId, setMemberId] = useState("");
  // const [sessionInfo, setSessionInfo] = useState("");
  // const [firebaseUid, setFirebaseUid] = useState("");
  const [loading, setLoading] = useState(false);

  const [showAddressConfirm, setShowAddressConfirm] = useState(false);
  // const [authStage, setAuthStage] = useState("phone");
  // const [authError, setAuthError] = useState("");

  const districtData = useMemo(() => areaData?.district, []);
  const areaOptions = useMemo(
    () => areaData?.district?.selection?.area_type || [],
    []
  );

  function update(field, value) {
    setForm((f) => {
      const next = { ...f, [field]: value };
      if (["firstName", "middleName", "lastName"].includes(field)) {
        next.name = [next.firstName, next.middleName, next.lastName]
          .filter(Boolean)
          .join(" ")
          .trim();
      }
      return next;
    });
    setErrors((e) => ({ ...e, [field]: undefined }));
    // if (field === "phone") {
    //   setAuthError("");
    // }
  }

  function compressImage(file, maxWidth = 1200, quality = 0.75) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();

        img.onload = () => {
          let width = img.width;
          let height = img.height;

          // Image ko max 1200px width tak resize karo
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext("2d");

          if (!ctx) {
            reject(new Error("Image processing failed"));
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);

          // JPEG me compress
          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);

          resolve(compressedDataUrl);
        };

        img.onerror = () => {
          reject(new Error("Invalid image"));
        };

        img.src = event.target.result;
      };

      reader.onerror = () => {
        reject(new Error("Unable to read image"));
      };

      reader.readAsDataURL(file);
    });
  }

  async function handlePhotoChange(e) {
    const file = e.target.files && e.target.files[0];

    if (!file) return;

    const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

    // Allowed file types
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    // ==============================
    // FILE TYPE CHECK
    // ==============================

    if (!allowedTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        photo: "Sirf JPG, PNG ya WEBP image upload karein.",
      }));

      e.target.value = "";
      return;
    }

    // ==============================
    // FILE SIZE CHECK
    // ==============================

    if (file.size > MAX_SIZE) {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);

      setErrors((prev) => ({
        ...prev,
        photo: `Image ${sizeMB} MB ki hai. Maximum 5 MB allowed hai.`,
      }));

      setForm((prev) => ({
        ...prev,
        photo: "",
      }));

      e.target.value = "";
      return;
    }

    try {
      // ==============================
      // COMPRESS IMAGE
      // ==============================

      const compressedImage = await compressImage(file, 1200, 0.75);

      // Error clear
      setErrors((prev) => ({
        ...prev,
        photo: undefined,
      }));

      // Compressed image save
      update("photo", compressedImage);
    } catch (error) {
      console.error("Image compression error:", error);

      setErrors((prev) => ({
        ...prev,
        photo: "Image process nahi ho payi. Dusri image try karein.",
      }));

      setForm((prev) => ({
        ...prev,
        photo: "",
      }));
    }

    e.target.value = "";
  }

  function validateStep(s) {
    const nextErrors = {};
    if (s === 1) {
      // profile photo optional
    }
    if (s === 2) {
      if (!form.firstName?.trim())
        nextErrors.firstName = "First name is required";
      if (!form.education) nextErrors.education = "Please select education";
      if (!form.profession) nextErrors.profession = "Please select profession";
      // if (!form.aadhaar || form.aadhaar.length !== 12)
      //   nextErrors.aadhaar = "Aadhaar number must be 12 digits";
    }
    if (s === 3) {
      // if (!form.areaType)
      //   nextErrors.areaType = "Please select rural or urban area";
      // if (!form.localBody) nextErrors.localBody = "Please select a local body";
      // if (!form.ward) nextErrors.ward = "Please select a ward";
      if (!form.district) nextErrors.district = "कृपया अपना जिला चुनें";

      if (!form.areaType)
        nextErrors.areaType = "कृपया ग्रामीण या शहरी क्षेत्र चुनें";

      if (!form.localBody)
        nextErrors.localBody = "कृपया ग्राम पंचायत / नगर निकाय चुनें";

      if (!form.ward) nextErrors.ward = "कृपया अपना वार्ड नंबर लिखें";
    }
    if (s === 4) {
      const normalized = form.phone.replace(/\D/g, "");
      if (normalized.length !== 10)
        nextErrors.phone = "Please enter a valid 10-digit phone number.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function next(skipAddressConfirmation = false) {
    if (!validateStep(step)) return;

    if (step === 3 && !skipAddressConfirmation) {
      setShowAddressConfirm(true);
      return;
    }

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      // STEP 1: Create member
      if (step === 1 && !memberId) {
        const formData = new FormData();

        if (form.photo) {
          const blob = await fetch(form.photo).then((res) => res.blob());

          formData.append("photo", blob, "profile-photo.jpg");
        }

        const response = await axios.post(
          `${backendUrl}/api/members`,
          formData
        );

        //Create member

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to create member");
        }

        // backend response memberId
        setMemberId(response.data.memberId);
      }

      // STEP 2: Profile
      if (step === 2) {
        const response = await axios.put(
          `${backendUrl}/api/members/${memberId}/profile`,
          {
            firstName: form.firstName,
            middleName: form.middleName,
            lastName: form.lastName,
            name: form.name,
            education: form.education,
            profession: form.profession,
            skills: form.skills,
            // aadhaar: form.aadhaar,
          }
        );

        // Profile update

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update profile");
        }
      }

      // STEP 3: Location
      if (step === 3) {
        const response = await axios.put(
          `${backendUrl}/api/members/${memberId}/location`,
          {
            district: form.district,
            areaType: form.areaType,
            localBody: form.localBody,
            ward: form.ward,
          }
        );

        //Location update

        if (!response.data.success) {
          throw new Error(response.data.message || "Failed to update location");
        }
      }

      setStep((s) => Math.min(4, s + 1));
    } catch (error) {
      console.error("Join API error:", error.response?.data || error.message);

      setErrors({
        api:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  }

  async function completeJoin() {
    setErrors({});

    if (!validateStep(4)) {
      return;
    }

    try {
      setLoading(true);

      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        throw new Error("Backend URL is not configured");
      }

      if (!memberId) {
        throw new Error(
          "Member profile was not created. Please go back and try again."
        );
      }

      const normalizedPhone = form.phone.replace(/\D/g, "").slice(-10);

      // ==========================================
      // COMPLETE MEMBER REGISTRATION
      // ==========================================

      const response = await axios.put(
        `${backendUrl}/api/members/${memberId}/complete`,
        {
          phone: `+91${normalizedPhone}`,
        },
        {
          withCredentials: true,
        }
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message || "Failed to complete registration"
        );
      }

      // Header ko authentication change batao
      window.dispatchEvent(new Event("jansuraaj_auth_change"));

      // Home
      navigate("/home");
    } catch (error) {
      console.error(
        "Complete join error:",
        error.response?.data || error.message
      );

      setErrors({
        api:
          error.response?.data?.message ||
          error.message ||
          "Failed to complete registration",
      });
    } finally {
      setLoading(false);
    }
  }

  function prev() {
    if (step === 1) {
      navigate("/");
      return;
    }
    // if (step === 4) {
    //   setAuthStage("phone");
    //   setOtp("");
    //   setSessionInfo("");
    //   setAuthError("");
    // }
    setStep((s) => Math.max(1, s - 1));
  }

  // async function sendOtp(e) {
  //   e.preventDefault();
  //   setAuthError("");

  //   if (!validateStep(4)) return;

  //   try {
  //     setLoading(true);

  //     const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //     const normalized = form.phone.replace(/\D/g, "");

  //     const response = await axios.post(`${backendUrl}/api/auth/send-otp`, {
  //       phone: `+91${normalized}`,
  //     });

  //     //Send OTP

  //     if (!response.data.success) {
  //       throw new Error(response.data.message || "Failed to send OTP");
  //     }

  //     setSessionInfo(response.data.sessionInfo);
  //     setAuthStage("otp");
  //   } catch (error) {
  //     console.error("Send OTP error:", error.response?.data || error.message);

  //     setAuthError(
  //       error.response?.data?.message || error.message || "Failed to send OTP"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  //  async function verifyOtp(e) {
  //   e.preventDefault();
  //   setAuthError("");

  //   if (!otp.trim()) {
  //     setAuthError("Please enter the OTP.");
  //     return;
  //   }

  //   if (!sessionInfo) {
  //     setAuthError("OTP session expired. Please send OTP again.");
  //     return;
  //   }

  //   if (!memberId) {
  //     setAuthError("Member profile was not created. Please go back.");
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     const backendUrl = import.meta.env.VITE_BACKEND_URL;

  //     // ==========================================
  //     // 1. VERIFY OTP
  //     // ==========================================
  //     const otpResponse = await axios.post(
  //       `${backendUrl}/api/auth/verify-otp`,
  //       {
  //         sessionInfo,
  //         code: otp,
  //       },
  //       {
  //         withCredentials: true,
  //       }
  //     );

  //     if (!otpResponse.data.success) {
  //       throw new Error(
  //         otpResponse.data.message ||
  //           "OTP verification failed"
  //       );
  //     }

  //     const memberResponse = await axios.put(
  //   `${backendUrl}/api/members/${memberId}/firebase`,
  //   {},
  //   {
  //     withCredentials: true,
  //   }
  // );

  //     if (!memberResponse.data.success) {
  //       throw new Error(
  //         memberResponse.data.message ||
  //           "Failed to connect Firebase account"
  //       );
  //     }

  //     // ==========================================
  //     // IMPORTANT
  //     // ==========================================
  //     // Yahan token/user ko localStorage me SAVE
  //     // NAHI karna hai.
  //     //
  //     // Authentication HttpOnly cookie se handle hogi.

  //     // Header ko login change batana
  //     window.dispatchEvent(
  //       new Event("jansuraaj_auth_change")
  //     );

  //     // ==========================================
  //     // HOME
  //     // ==========================================
  //     navigate("/home");

  //   } catch (error) {
  //     console.error(
  //       "Join OTP error:",
  //       error.response?.data || error.message
  //     );

  //     setAuthError(
  //       error.response?.data?.message ||
  //         error.message ||
  //         "OTP verification failed"
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // }

  return (
    <div className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-slate-50 px-4 py-8 font-sans">
      <div className="w-full max-w-3xl rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">{t("Join Jansuraaj")}</h1>
        <p className="mt-1 text-sm font-normal text-slate-600">
          Create your member profile and verify your phone for login.
        </p>
        <div className="mt-4">
          <ProgressStepper step={step} max={4} />
        </div>

        <div className="mt-4 space-y-4">
          {step === 1 && (
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Profile Photo
                <span className="ml-1 text-xs font-normal text-slate-400">
                  (optional)
                </span>
              </label>

              <div className="mt-3 flex items-center gap-5 rounded-xl border border-slate-200 bg-white p-4">
                {/* Profile Preview */}
                <div className="relative shrink-0">
                  <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-slate-100 shadow-md ring-1 ring-slate-200">
                    {form.photo ? (
                      <img
                        src={form.photo}
                        alt="Profile"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-400">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-8 w-8"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a7.5 7.5 0 0115 0"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Camera badge */}
                  <label
                    htmlFor="profile-photo"
                    className="absolute bottom-0 right-0 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-blue-600 text-white shadow-md transition hover:bg-blue-700"
                    title="Change photo"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6.75 7.5h1.386a1.5 1.5 0 001.342-.83l.474-.95A1.5 1.5 0 0111.294 4.5h1.412a1.5 1.5 0 011.342.83l.474.95a1.5 1.5 0 001.342.83h1.386A2.25 2.25 0 0119.5 9.75v7.5a2.25 2.25 0 01-2.25 2.25h-10.5a2.25 2.25 0 01-2.25-2.25v-7.5A2.25 2.25 0 016.75 7.5z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 13.5a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                      />
                    </svg>
                  </label>
                </div>

                {/* Upload Area */}
                <div className="min-w-0">
                  <label
                    htmlFor="profile-photo"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 16.5V3.75m0 0L7.5 8.25M12 3.75l4.5 4.5M4.5 15.75v1.5A3 3 0 007.5 20.25h9a3 3 0 003-3v-1.5"
                      />
                    </svg>

                    {form.photo ? "Change Photo" : "Upload Photo"}
                  </label>

                  <input
                    id="profile-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-xs text-slate-400">
                    JPG, PNG or WEBP · Max 5MB
                  </p>
                  {errors.photo && (
                    <div className="mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
                      <p className="text-xs font-medium text-red-600">
                        ⚠️ {errors.photo}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              {/* नाम */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  नाम <span className="text-red-500">*</span>
                </label>

                <div className="grid gap-3 sm:grid-cols-3">
                  <input
                    type="text"
                    placeholder="पहला नाम"
                    value={form.firstName || ""}
                    onChange={(e) => update("firstName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <input
                    type="text"
                    placeholder="मध्य नाम"
                    value={form.middleName || ""}
                    onChange={(e) => update("middleName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />

                  <input
                    type="text"
                    placeholder="अंतिम नाम"
                    value={form.lastName || ""}
                    onChange={(e) => update("lastName", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  />
                </div>

                {errors.firstName ? (
                  <p className="mt-1.5 text-xs font-medium text-red-500">
                    {errors.firstName}
                  </p>
                ) : (
                  <p className="mt-1.5 text-xs text-slate-400">
                    पहला नाम भरना आवश्यक है।
                  </p>
                )}
              </div>

              {/* शिक्षा और पेशा */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* शिक्षा */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    शिक्षा <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.education || ""}
                    onChange={(e) => update("education", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">शिक्षा चुनें</option>
                    <option value="Below Matric">मैट्रिक से कम</option>
                    <option value="Matric Pass">मैट्रिक पास (10वीं)</option>
                    <option value="12th Pass">12वीं पास</option>
                    <option value="Diploma / ITI">डिप्लोमा / आईटीआई</option>
                    <option value="Graduate">स्नातक</option>
                    <option value="Post Graduate / Masters">
                      स्नातकोत्तर / मास्टर्स
                    </option>
                    <option value="Other">अन्य</option>
                  </select>
                  {errors.education ? (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.education}
                    </p>
                  ) : null}
                </div>

                {/* पेशा */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    पेशा <span className="text-red-500">*</span>
                  </label>

                  <select
                    value={form.profession || ""}
                    onChange={(e) => update("profession", e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                  >
                    <option value="">अपना पेशा चुनें</option>

                    <option value="Farmer / Agriculture">किसान / कृषि</option>

                    <option value="Agricultural Labourer">कृषि मजदूर</option>

                    <option value="Student">विद्यार्थी</option>

                    <option value="Teacher / Professor">
                      शिक्षक / प्रोफेसर
                    </option>

                    <option value="Government Employee">सरकारी कर्मचारी</option>

                    <option value="Private Employee">निजी कर्मचारी</option>

                    <option value="Business / Entrepreneur">
                      व्यवसायी / उद्यमी
                    </option>

                    <option value="Shopkeeper / Trader">
                      दुकानदार / व्यापारी
                    </option>

                    <option value="Self Employed">स्वरोजगार</option>

                    <option value="Doctor / Healthcare">
                      डॉक्टर / स्वास्थ्य सेवा
                    </option>

                    <option value="Engineer / IT Professional">
                      इंजीनियर / आईटी
                    </option>

                    <option value="Lawyer / Legal Professional">
                      वकील / कानूनी सेवा
                    </option>

                    <option value="Construction / Skilled Worker">
                      निर्माण कार्य / कुशल कारीगर
                    </option>

                    <option value="Driver / Transport">चालक / परिवहन</option>

                    <option value="Homemaker">गृहिणी / गृहस्थ</option>

                    <option value="Retired">सेवानिवृत्त</option>

                    <option value="Daily Wage Worker">दैनिक मजदूर</option>

                    <option value="Social Worker">सामाजिक कार्यकर्ता</option>

                    <option value="Journalist / Media">
                      पत्रकारिता / मीडिया
                    </option>

                    <option value="Other">अन्य</option>
                  </select>
                  {errors.profession ? (
                    <p className="mt-1.5 text-xs font-medium text-red-500">
                      {errors.profession}
                    </p>
                  ) : null}
                </div>
              </div>

              {/* कौशल */}
              <div>
                <div className="mb-3">
                  <label className="block text-sm font-semibold text-slate-700">
                    आपकी विशेषताएँ / कौशल
                  </label>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    आप जिस चीज़ में बढ़िया हैं, उसे चुनिए। इससे जनसुराज में आपकी
                    महत्ता और आपकी उपयोगिता बढ़ेगी।
                  </p>
                </div>

                {/* Skill Capsules */}
                <div className="flex flex-wrap gap-2.5">
                  {[
                    "शिक्षण एवं प्रशिक्षण",
                    "कृषि",
                    "पशुपालन",
                    "स्वास्थ्य सेवा",
                    "आईटी एवं तकनीक",
                    "कानूनी जानकारी",
                    "लेखा एवं वित्त",
                    "सामाजिक कार्य",
                    "जनसंपर्क",
                    "भाषण एवं वक्तृत्व",
                    "लेखन",
                    "फोटोग्राफी",
                    "वीडियो निर्माण",
                    "सोशल मीडिया",
                    "कार्यक्रम प्रबंधन",
                    "युवा कार्य",
                    "महिला एवं सामुदायिक कार्य",
                    "आपदा राहत",
                    "अनुसंधान एवं डेटा",
                    "व्यवसाय एवं उद्यमिता",
                    "अन्य",
                  ].map((skill) => {
                    const selected = (form.skills || []).includes(skill);

                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          const currentSkills = form.skills || [];

                          const updatedSkills = selected
                            ? currentSkills.filter((item) => item !== skill)
                            : [...currentSkills, skill];

                          update("skills", updatedSkills);
                        }}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                          selected
                            ? "border-green-600 bg-green-600 text-white shadow-sm hover:bg-green-700"
                            : "border-slate-200 bg-white text-slate-600 hover:border-green-400 hover:bg-green-50 hover:text-green-700"
                        }`}
                      >
                        {selected && <span className="mr-1.5">✓</span>}

                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* आधार */}
              {/* <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  आधार संख्या <span className="text-red-500">*</span>
                </label>

                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={14}
                  placeholder="1234-5678-9012"
                  value={
                    form.aadhaar
                      ? form.aadhaar
                          .replace(/\D/g, "")
                          .replace(/(\d{4})(?=\d)/g, "$1-")
                      : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 12);

                    update("aadhaar", value);
                  }}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm tracking-wider outline-none transition placeholder:tracking-normal placeholder:text-slate-400 focus:border-green-500 focus:ring-4 focus:ring-green-100"
                />

                <p className="mt-1.5 text-xs text-slate-400">
                  पहचान सत्यापन के लिए 12 अंकों की आधार संख्या आवश्यक है।
                </p>

                {errors.aadhaar ? (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.aadhaar}
                  </p>
                ) : form.aadhaar && form.aadhaar.length !== 12 ? (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    आधार संख्या 12 अंकों की होनी चाहिए।
                  </p>
                ) : null}
              </div> */}
            </div>
          )}

          {step === 3 && (
            <div className="mt-6">
              {/* ================= DISTRICT ================= */}
              <div className="mb-6">
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-slate-800">
                    सबसे पहले अपना जिला चुनें
                  </h3>

                  <p className="mt-1 text-sm text-slate-500">
                    अपना जिला चुनने के बाद ही आगे का क्षेत्र दिखाई देगा।
                  </p>
                </div>

                <LocationPicker
                  type="district"
                  value={form.district}
                  onChange={(value) => {
                    update("district", value);
                    update("areaType", "");
                    update("localBody", "");
                    update("ward", "");
                  }}
                />

                {errors.district ? (
                  <div className="mt-2 text-xs text-rose-600">
                    {errors.district}
                  </div>
                ) : null}
              </div>

              {/* ================= AREA TYPE ================= */}
              {form.district && (
                <>
                  <div className="mb-5">
                    <h3 className="text-base font-semibold text-slate-800">
                      आप कहाँ रहते हैं?
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      अपना क्षेत्र चुनें, फिर स्थानीय निकाय और वार्ड चुनें।
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    {/* RURAL */}
                    <button
                      type="button"
                      onClick={() => {
                        update("areaType", "rural");
                        update("localBody", "");
                        update("ward", "");
                      }}
                      className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                        form.areaType === "rural"
                          ? "border-green-500 bg-green-50 ring-2 ring-green-100"
                          : "border-slate-200 bg-white hover:border-green-300 hover:bg-green-50/50"
                      }`}
                    >
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                          form.areaType === "rural"
                            ? "bg-green-600"
                            : "bg-green-50"
                        }`}
                      >
                        🌾
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        ग्रामीण क्षेत्र
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        गाँव / ग्राम पंचायत
                      </p>
                    </button>

                    {/* URBAN */}
                    <button
                      type="button"
                      onClick={() => {
                        update("areaType", "urban");
                        update("localBody", "");
                        update("ward", "");
                      }}
                      className={`group rounded-2xl border p-4 text-left transition-all duration-200 ${
                        form.areaType === "urban"
                          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                          : "border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
                      }`}
                    >
                      <div
                        className={`mb-2 flex h-10 w-10 items-center justify-center rounded-xl text-xl ${
                          form.areaType === "urban"
                            ? "bg-blue-600"
                            : "bg-blue-50"
                        }`}
                      >
                        🏙️
                      </div>

                      <p className="text-sm font-semibold text-slate-800">
                        शहरी क्षेत्र
                      </p>

                      <p className="mt-1 text-xs text-slate-500">नगर निकाय</p>
                    </button>
                  </div>

                  {errors.areaType ? (
                    <div className="mt-2 text-xs text-rose-600">
                      {errors.areaType}
                    </div>
                  ) : null}

                  {/* ================= LOCAL BODY ================= */}
                  {form.areaType && (
                    <LocationPicker
                      districtId={form.district}
                      areaType={form.areaType}
                      value={form.localBody}
                      onChange={(value) => {
                        update("localBody", value);
                        update("ward", "");
                      }}
                    />
                  )}

                  {/* ================= WARD ================= */}
                  {form.localBody && (
                    <WardPicker
                      // districtId={form.district}
                      //   areaType={form.areaType}
                      //   localBodyId={form.localBody}
                      value={form.ward}
                      onChange={(value) => update("ward", value)}
                    />
                  )}

                  {errors.localBody ? (
                    <div className="mt-2 text-xs text-rose-600">
                      {errors.localBody}
                    </div>
                  ) : null}

                  {errors.ward ? (
                    <div className="mt-2 text-xs text-rose-600">
                      {errors.ward}
                    </div>
                  ) : null}
                </>
              )}
            </div>
          )}

          {/* {step === 4 && (
            <div>
              <h3 className="block text-sm font-semibold">{t("Verify your phone")}</h3>
              <p className="mt-2 text-sm text-slate-600">
                यह नंबर आपके लॉगिन और OTP verification के लिए उपयोग होगा।
              </p>

              {authStage === "phone" ? (
                <form
                  onSubmit={sendOtp}
                  className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number
                  </label>
                  <div className="mt-2 flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                    <span className="text-sm text-slate-500">+91</span>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                      placeholder="98765 43210"
                      className="w-full border-none bg-transparent text-sm text-slate-900 outline-none"
                    />
                  </div>
                  {errors.phone ? (
                    <div className="text-xs text-rose-600">{errors.phone}</div>
                  ) : null}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </form>
              ) : (
                <form
                  onSubmit={verifyOtp}
                  className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5"
                >
                  <div>
                    <p className="text-sm text-slate-600">
                      OTP sent to +91 {form.phone.replace(/\D/g, "")}
                    </p>
                    <p className="mt-2 text-sm text-slate-500">
                      Enter the 6-digit verification code sent to your mobile
                      number.
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="6-digit code"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none"
                    />
                  </div>

                  {authError ? (
                    <div className="text-xs text-rose-600">{authError}</div>
                  ) : null}

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthStage("phone");
                        setOtp("");
                        setSessionInfo("");
                        setAuthError("");
                      }}
                      className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      Change number
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="rounded-2xl bg-[#0ea5a4] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#0bb99b] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? "Verifying..." : "Verify OTP & Join"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )} */}
          {step === 4 && (
            <div>
              <h3 className="block text-sm font-semibold">{t("Verify your phone")}</h3>

              <p className="mt-2 text-sm text-slate-600">
                यह मोबाइल नंबर आपके लॉगिन के लिए उपयोग होगा।
              </p>

              <div className="mt-5 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <label className="block text-sm font-medium text-slate-700">
                  Phone number
                </label>

                <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                  <span className="text-sm text-slate-500">+91</span>

                  <input
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);

                      update("phone", value);
                    }}
                    placeholder="98765 43210"
                    maxLength={10}
                    className="w-full border-none bg-transparent text-sm text-slate-900 outline-none"
                  />
                </div>

                {errors.phone && (
                  <div className="text-xs text-rose-600">{errors.phone}</div>
                )}

                {errors.api && (
                  <div className="text-xs text-rose-600">{errors.api}</div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button onClick={prev} className="rounded-full border px-4 py-2">
            Back
          </button>
          {step < 4 ? (
            <button
              onClick={() => next()}
              disabled={loading}
              className="rounded-full bg-sky-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Please wait..." : "Next"}
            </button>
          ) : (
            // <button
            //   onClick={authStage === "phone" ? sendOtp : verifyOtp}
            //   disabled={loading}
            //   className="rounded-full bg-emerald-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            // >
            //   {loading
            //     ? "Please wait..."
            //     : authStage === "phone"
            //     ? "Send OTP"
            //     : "Verify OTP & Join"}
            // </button>
            <button
              onClick={completeJoin}
              disabled={loading}
              className="rounded-full bg-emerald-600 px-4 py-2 text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Joining..." : "Join Jansuraaj"}
            </button>
          )}
        </div>

        {/* =========popup======= */}

        {showAddressConfirm && (
          <AddressConfirmModal
            form={form}
            districts={districts}
            areaData={areaData}
            loading={loading}
            onBack={() => setShowAddressConfirm(false)}
            onConfirm={() => {
              setShowAddressConfirm(false);
              next(true);
            }}
          />
        )}
      </div>
    </div>
  );
}
