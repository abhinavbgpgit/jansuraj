import { useLanguage } from "../i18n";

const AddressConfirmModal = ({
  form,
  districts,
  areaData,
  loading,
  onBack,
  onConfirm,
}) => {
  const { language, t } = useLanguage();
  const districtName =
    districts.find((item) => item.id === form.district)?.name || "-";

  const district = areaData?.districts?.[form.district];

  const locations =
    form.areaType === "rural"
      ? district?.rural?.panchayats || []
      : district?.urban?.local_bodies || [];

  const localBodyName =
    locations.find((item) => item.id === form.localBody)?.name ||
    form.localBody ||
    "-";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">

        <h3 className="text-xl font-semibold text-slate-800">
          {t("Review your address")}
        </h3>

        <p className="mt-1 text-sm text-slate-500">
          {t("Please review your information before continuing.")}
        </p>

        <div className="mt-5 space-y-3 rounded-xl bg-slate-50 p-4">

          <div className="flex justify-between gap-4">
            <span className="text-sm text-slate-500">
              {t("District")}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
              {districtName}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-slate-500">
              {t("Area")}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
              {form.areaType === "rural"
                ? t("Rural area")
                : form.areaType === "urban"
                ? t("Urban area")
                : "-"}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-slate-500">
              {form.areaType === "rural"
                ? t("Gram panchayat")
                : t("Urban local body")}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
              {localBodyName}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="text-sm text-slate-500">
              {t("Ward")}
            </span>

            <span className="text-right text-sm font-medium text-slate-800">
              {form.ward ? `${t("Ward")} ${form.ward}` : "-"}
            </span>
          </div>

        </div>

        <p className="mt-4 text-sm font-medium text-slate-700">
          {t("Is this information correct?")}
        </p>

        <div className="mt-5 flex justify-end gap-3">

          <button
            type="button"
            onClick={onBack}
            className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            {t("Go back and edit")}
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={onConfirm}
            className="rounded-full bg-green-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-60"
          >
            {loading ? t("Please wait...") : language === "hi" ? "ठीक है" : t("Confirm")}
          </button>

        </div>
      </div>
    </div>
  );
};

export default AddressConfirmModal;