import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// ==========================================
// Fix Leaflet default marker icons for Vite
// ==========================================
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// ==========================================
// Location Marker
// ==========================================
function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return position ? <Marker position={position} /> : null;
}

// ==========================================
// Map Picker
// ==========================================
export default function MapPicker({
  initialPosition = [25.6, 85.1],
  onLocationSelect,
}) {
  const [pos, setPos] = useState(null);

  // ==========================================
  // Send selected location to parent
  // ==========================================
  useEffect(() => {
    if (!onLocationSelect) return;

    if (pos) {
      onLocationSelect({
        latitude: pos.lat,
        longitude: pos.lng,
      });
    } else {
      onLocationSelect(null);
    }
  }, [pos, onLocationSelect]);

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm">
      <MapContainer
        center={initialPosition}
        zoom={12}
        style={{
          height: "320px",
          width: "100%",
        }}
        className="overflow-hidden rounded-lg"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <LocationMarker
          position={pos}
          setPosition={setPos}
        />
      </MapContainer>

      <div className="mt-2 flex items-center justify-between gap-4 text-xs text-slate-600">
        <div>
          Click map to pick location
        </div>

        <div className="font-medium">
          {pos
            ? `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`
            : "No location selected"}
        </div>
      </div>

      {pos && (
        <button
          type="button"
          onClick={() => setPos(null)}
          className="mt-3 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50"
        >
          Clear location
        </button>
      )}
    </div>
  );
}