import React, { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix leaflet's default icon paths for bundlers like Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
})

function LocationMarker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng)
    },
  })
  return position ? <Marker position={position} /> : null
}

export default function MapPicker({ initialPosition = [25.6, 85.1], onLocationSelect }) {
  const [pos, setPos] = useState(null)

  useEffect(() => {
    if (onLocationSelect) onLocationSelect(pos)
  }, [pos])

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/60 p-4 shadow-sm">
      <MapContainer center={initialPosition} zoom={12} style={{ height: '320px' }} className="rounded-lg overflow-hidden">
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <LocationMarker position={pos} setPosition={setPos} />
      </MapContainer>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
        <div>Click map to pick location</div>
        <div>{pos ? `${pos.lat.toFixed(4)}, ${pos.lng.toFixed(4)}` : 'No location'}</div>
      </div>
    </div>
  )
}
