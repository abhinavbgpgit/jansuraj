import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useLanguage } from "../i18n";
import MembershipCardComponent from "../components/MembershipCardComponent";
import areaData from "../data/area.json";
import districts from "../data/districts.json";
import profileHeaderImg from "../assets/profile_header_2.png";

// ==========================================
// Backend se aane wale raw slug values
// (jaise "ward_30") ko readable text me badalta hai.
// ==========================================
function formatLabel(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b[a-zA-Z]/g, (char) => char.toUpperCase());
}

function getDistrictNode(districtId) {
  return areaData?.districts?.[districtId];
}

function getDistrictName(districtId) {
  const found = districts.find((d) => d.id === districtId);
  return found?.name || formatLabel(districtId);
}

function getBlockName(districtId, blockId) {
  const block = getDistrictNode(districtId)?.rural?.blocks?.find(
    (b) => b.id === blockId
  );
  return block?.name || formatLabel(blockId);
}

function getPanchayat(districtId, panchayatId) {
  return getDistrictNode(districtId)?.rural?.panchayats?.find(
    (p) => p.id === panchayatId
  );
}

function getLocalBody(districtId, localBodyId) {
  return getDistrictNode(districtId)?.urban?.local_bodies?.find(
    (l) => l.id === localBodyId
  );
}

function getWardName(districtId, areaType, panchayatId, localBodyId, wardId) {
  if (!wardId) return "";

  const parent =
    areaType === "urban"
      ? getLocalBody(districtId, localBodyId)
      : getPanchayat(districtId, panchayatId);

  const ward = parent?.wards?.find((w) => w.id === wardId);
  return ward?.name || formatLabel(wardId);
}

// ==========================================
// EDIT FORM OPTIONS (Join.jsx ke sath consistent)
// ==========================================
const EDUCATION_OPTIONS = [
  "Below Matric",
  "Matric Pass",
  "12th Pass",
  "Diploma / ITI",
  "Graduate",
  "Post Graduate / Masters",
  "Other",
];

const PROFESSION_OPTIONS = [
  "Farmer / Agriculture",
  "Agricultural Labourer",
  "Student",
  "Teacher / Professor",
  "Government Employee",
  "Private Employee",
  "Business / Entrepreneur",
  "Shopkeeper / Trader",
  "Self Employed",
  "Doctor / Healthcare",
  "Engineer / IT Professional",
  "Lawyer / Legal Professional",
  "Construction / Skilled Worker",
  "Driver / Transport",
  "Homemaker",
  "Retired",
  "Daily Wage Worker",
  "Social Worker",
  "Journalist / Media",
  "Other",
];

const SKILL_OPTIONS = [
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
];

// ==========================================
// SMALL INFO CARD
// ==========================================
function InfoCard({ icon, title, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
        <span>{icon}</span> {title}
      </p>
      <p className="mt-1.5 text-base font-medium text-slate-900">
        {value || "—"}
      </p>
    </div>
  );
}

export default function Profile() {
  const { t } = useLanguage();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // ==========================================
  // FETCH PROFILE
  // ==========================================
  const fetchProfile = async () => {
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      if (!backendUrl) {
        setError("Backend URL is not configured.");
        return;
      }

      // HttpOnly cookie automatically send hogi
      const response = await axios.get(`${backendUrl}/api/members/me`, {
        withCredentials: true,
      });

      if (response.data?.success) {
        setUser(response.data.member);
      } else {
        setError(response.data?.message || "Failed to load profile.");
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

      setError(error.response?.data?.message || "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ==========================================
  // EDIT MODE
  // ==========================================
  function startEditing() {
    setEditForm({
      firstName: user.firstName || "",
      middleName: user.middleName || "",
      lastName: user.lastName || "",
      education: user.education || "",
      profession: user.profession || "",
      skills: Array.isArray(user.skills) ? [...user.skills] : [],
      areaType: user.areaType || "rural",
      block: user.block || "",
      panchayat: user.panchayat || "",
      localBody: user.localBody || "",
      ward: user.ward || "",
    });
    setSaveError("");
    setSaveSuccess(false);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setEditForm(null);
    setSaveError("");
  }

  function updateField(field, value) {
    setEditForm((f) => ({ ...f, [field]: value }));
  }

  function toggleSkill(skill) {
    setEditForm((f) => {
      const has = f.skills.includes(skill);
      return {
        ...f,
        skills: has
          ? f.skills.filter((s) => s !== skill)
          : [...f.skills, skill],
      };
    });
  }

  async function handleSave() {
    if (!editForm.firstName.trim()) {
      setSaveError("पहला नाम भरना आवश्यक है।");
      return;
    }

    setSaving(true);
    setSaveError("");

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL;

      const name = [editForm.firstName, editForm.middleName, editForm.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      // PROFILE FIELDS
      const profileResponse = await axios.put(
        `${backendUrl}/api/members/${user._id}/profile`,
        {
          firstName: editForm.firstName,
          middleName: editForm.middleName,
          lastName: editForm.lastName,
          name,
          education: editForm.education,
          profession: editForm.profession,
          skills: editForm.skills,
        },
        { withCredentials: true }
      );

      if (!profileResponse.data?.success) {
        throw new Error(
          profileResponse.data?.message || "Failed to update profile."
        );
      }

      // LOCATION FIELDS
      const locationResponse = await axios.put(
        `${backendUrl}/api/members/${user._id}/location`,
        {
          district: user.district,
          areaType: editForm.areaType,
          block: editForm.areaType === "rural" ? editForm.block : "",
          panchayat: editForm.areaType === "rural" ? editForm.panchayat : "",
          localBody: editForm.areaType === "urban" ? editForm.localBody : "",
          ward: editForm.ward,
        },
        { withCredentials: true }
      );

      if (!locationResponse.data?.success) {
        throw new Error(
          locationResponse.data?.message || "Failed to update address."
        );
      }

      await fetchProfile();
      setIsEditing(false);
      setSaveSuccess(true);
    } catch (err) {
      console.error(
        "Profile update error:",
        err.response?.data || err.message
      );

      setSaveError(
        err.response?.data?.message || err.message || "Failed to save changes."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4 text-center">
        <p className="text-slate-600">{t("Loading profile...")}</p>
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
          <p className="text-rose-600">{error}</p>
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
        <p className="text-slate-600">{t("Profile not found.")}</p>
      </div>
    );
  }

  // ==========================================
  // DERIVED DISPLAY VALUES
  // ==========================================
  const districtNode = getDistrictNode(user.district);
  const blockOptions = districtNode?.rural?.blocks || [];
  const panchayatOptions = districtNode?.rural?.panchayats || [];
  const localBodyOptions = districtNode?.urban?.local_bodies || [];

  const districtName = getDistrictName(user.district);
  const blockName = user.block ? getBlockName(user.district, user.block) : "";
  const panchayatName = user.panchayat
    ? getPanchayat(user.district, user.panchayat)?.name ||
      formatLabel(user.panchayat)
    : "";
  const localBodyName = user.localBody
    ? getLocalBody(user.district, user.localBody)?.name ||
      formatLabel(user.localBody)
    : "";
  const wardName = getWardName(
    user.district,
    user.areaType,
    user.panchayat,
    user.localBody,
    user.ward
  );

  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("hi-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <div className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
      {/* ==========================================
          HERO
      ========================================== */}
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div
          className="relative aspect-[1942/623] w-full bg-slate-200 bg-cover bg-center"
          style={{ backgroundImage: `url(${profileHeaderImg})` }}
        >
          <div className="absolute inset-0 bg-black/30" />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 px-4 text-center">
            <h1 className="text-2xl font-bold text-white drop-shadow-md sm:text-3xl">
              {user.name}
            </h1>

            <div className="inline-flex items-center gap-2 text-sm font-medium text-white drop-shadow-md">
              <span>📱</span>
              <span>{user.phone}</span>
            </div>
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-8">
          <div className="-mt-12 flex flex-col items-center gap-4 sm:-mt-14 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-end">
              {user.photo ? (
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover shadow-lg sm:h-28 sm:w-28"
                />
              ) : (
                <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-2xl font-bold text-slate-500 shadow-lg sm:h-28 sm:w-28">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </div>
              )}

              <div className="text-center sm:pb-1 sm:text-left">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  {user.registrationStatus === "completed" && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                      ✓ सत्यापित सदस्य
                    </span>
                  )}

                  {memberSince && (
                    <span className="text-xs text-slate-500">
                      सदस्य बने: {memberSince}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isEditing && (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex shrink-0 items-center gap-2 rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-700 sm:mb-1"
              >
                ✏️ प्रोफ़ाइल संपादित करें
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ==========================================
          SAVE FEEDBACK
      ========================================== */}
      {saveSuccess && !isEditing && (
        <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          ✓ आपकी प्रोफ़ाइल अपडेट हो गई है।
        </div>
      )}

      {/* ==========================================
          EDIT MODE
      ========================================== */}
      {isEditing ? (
        <div className="mt-6 space-y-5 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-slate-50 p-5 sm:p-6">
          {/* NAME */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              नाम <span className="text-red-500">*</span>
            </label>

            <div className="grid gap-3 sm:grid-cols-3">
              <input
                type="text"
                placeholder="पहला नाम"
                value={editForm.firstName}
                onChange={(e) => updateField("firstName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />

              <input
                type="text"
                placeholder="मध्य नाम"
                value={editForm.middleName}
                onChange={(e) => updateField("middleName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />

              <input
                type="text"
                placeholder="अंतिम नाम"
                value={editForm.lastName}
                onChange={(e) => updateField("lastName", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          {/* EDUCATION + PROFESSION */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                शिक्षा
              </label>

              <select
                value={editForm.education}
                onChange={(e) => updateField("education", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">{t("Select education")}</option>
                {EDUCATION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(opt)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                पेशा
              </label>

              <select
                value={editForm.profession}
                onChange={(e) => updateField("profession", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">{t("Select your profession")}</option>
                {PROFESSION_OPTIONS.map((opt) => (
                  <option key={opt} value={opt}>
                    {t(opt)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* SKILLS */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              कौशल
            </label>

            <div className="flex flex-wrap gap-2.5">
              {SKILL_OPTIONS.map((skill) => {
                const selected = editForm.skills.includes(skill);

                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition-all duration-200 ${
                      selected
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700"
                    }`}
                  >
                    {selected && <span className="mr-1.5">✓</span>}
                    {t(skill)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* AREA TYPE */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              क्षेत्र प्रकार
            </label>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  updateField("areaType", "rural");
                  updateField("block", "");
                  updateField("panchayat", "");
                  updateField("localBody", "");
                }}
                className={`rounded-2xl border p-3 text-sm font-semibold transition-all duration-200 ${
                  editForm.areaType === "rural"
                    ? "border-green-500 bg-green-50 text-green-700 ring-2 ring-green-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-green-300"
                }`}
              >
                🌾 ग्रामीण क्षेत्र
              </button>

              <button
                type="button"
                onClick={() => {
                  updateField("areaType", "urban");
                  updateField("block", "");
                  updateField("panchayat", "");
                  updateField("localBody", "");
                }}
                className={`rounded-2xl border p-3 text-sm font-semibold transition-all duration-200 ${
                  editForm.areaType === "urban"
                    ? "border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100"
                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-300"
                }`}
              >
                🏙️ शहरी क्षेत्र
              </button>
            </div>
          </div>

          {/* DISTRICT - fixed, not editable */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              जिला
            </label>

            <input
              type="text"
              value={districtName}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
            />
          </div>

          {/* BLOCK + PANCHAYAT (rural) OR LOCAL BODY (urban) */}
          {editForm.areaType === "rural" ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  प्रखंड
                </label>

                <select
                  value={editForm.block}
                  onChange={(e) => updateField("block", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">चुनें</option>
                  {blockOptions.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  ग्राम पंचायत
                </label>

                <select
                  value={editForm.panchayat}
                  onChange={(e) => updateField("panchayat", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                >
                  <option value="">चुनें</option>
                  {panchayatOptions.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                नगर निकाय
              </label>

              <select
                value={editForm.localBody}
                onChange={(e) => updateField("localBody", e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              >
                <option value="">चुनें</option>
                {localBodyOptions.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* WARD */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              वार्ड नंबर
            </label>

            <input
              type="text"
              inputMode="numeric"
              placeholder="जैसे 12"
              value={editForm.ward}
              onChange={(e) =>
                updateField("ward", e.target.value.replace(/\D/g, ""))
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
            />
          </div>

          {/* PHONE - read only */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-slate-700">
              फ़ोन नंबर
            </label>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500">
              <span>🔒</span>
              <span>{user.phone}</span>
              <span className="ml-auto text-xs">बदला नहीं जा सकता</span>
            </div>
          </div>

          {saveError && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              ⚠️ {saveError}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={cancelEditing}
              disabled={saving}
              className="rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              रद्द करें
            </button>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "सेव हो रहा है..." : "बदलाव सहेजें"}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* ==========================================
              VIEW MODE
          ========================================== */}
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <InfoCard icon="🎓" title="शिक्षा" value={user.education} />
            <InfoCard icon="💼" title="पेशा" value={user.profession} />
          </div>

          {/* ADDRESS */}
          <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
            <h3 className="flex items-center gap-2 font-semibold text-slate-900">
              📍 पता
            </h3>

            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm text-slate-700">
              <span>
                <span className="font-bold text-slate-900">जिला:</span>{" "}
                {districtName}
              </span>

              {user.areaType === "urban" ? (
                localBodyName && (
                  <>
                    <span className="text-slate-300">•</span>
                    <span>
                      <span className="font-bold text-slate-900">
                        नगर निकाय:
                      </span>{" "}
                      {localBodyName}
                    </span>
                  </>
                )
              ) : (
                <>
                  {blockName && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>
                        <span className="font-bold text-slate-900">
                          प्रखंड:
                        </span>{" "}
                        {blockName}
                      </span>
                    </>
                  )}

                  {panchayatName && (
                    <>
                      <span className="text-slate-300">•</span>
                      <span>
                        <span className="font-bold text-slate-900">
                          ग्राम पंचायत:
                        </span>{" "}
                        {panchayatName}
                      </span>
                    </>
                  )}
                </>
              )}

              {wardName && (
                <>
                  <span className="text-slate-300">•</span>
                  <span>
                    <span className="font-bold text-slate-900">वार्ड:</span>{" "}
                    {wardName}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* SKILLS */}
          {Array.isArray(user.skills) && user.skills.length > 0 && (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-5">
              <h3 className="font-semibold text-slate-900">🛠️ कौशल</h3>

              <div className="mt-3 flex flex-wrap gap-2">
                {user.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* QUICK ACTIONS */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <Link
              to="/report"
              className="flex items-center justify-between rounded-2xl border border-sky-100 bg-sky-50 p-4 transition hover:border-sky-300 hover:bg-sky-100"
            >
              <div>
                <p className="text-sm font-semibold text-sky-900">
                  नई समस्या दर्ज करें
                </p>
                <p className="mt-0.5 text-xs text-sky-700">
                  किसी सार्वजनिक समस्या की रिपोर्ट करें
                </p>
              </div>
              <span className="text-sky-500">→</span>
            </Link>

            <Link
              to="/issues"
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300 hover:bg-slate-50"
            >
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  अपने क्षेत्र की समस्याएं
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  दर्ज हुई समस्याओं की स्थिति देखें
                </p>
              </div>
              <span className="text-slate-400">→</span>
            </Link>
          </div>

          {/* MEMBERSHIP CARD */}
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">
              {t("Membership Card")}
            </h2>

            <MembershipCardComponent
              member={{
                ...user,
                district: districtName,
                ward: wardName || user.ward,
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}
