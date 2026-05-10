import { motion } from 'framer-motion'
import L from 'leaflet'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import { itineraryStops } from '../data/mock.js'

const markerIcon = L.divIcon({
  className: '',
  html: '<div style="width:16px;height:16px;border-radius:9999px;background:linear-gradient(135deg,#22d3ee,#fcd34d);box-shadow:0 0 0 8px rgba(34,211,238,.15)"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8],
})

export default function TripMap() {
  const route = itineraryStops.map((stop) => [stop.lat, stop.lng])

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Route map</p>
          <h3 className="mt-1 text-lg font-semibold text-white">OpenStreetMap preview</h3>
        </div>
        <p className="text-sm text-slate-400">Zoom, pan, and inspect stops</p>
      </div>
      <MapContainer center={[41.2, 2.2]} zoom={5} className="h-[340px] w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Polyline positions={route} pathOptions={{ color: '#22d3ee', weight: 4, opacity: 0.85 }} />
        {itineraryStops.map((stop) => (
          <Marker key={stop.city} position={[stop.lat, stop.lng]} icon={markerIcon}>
            <Popup>
              <div className="min-w-[180px]">
                <p className="text-sm font-semibold">{stop.city}</p>
                <p className="text-xs text-slate-500">{stop.country}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </motion.div>
  )
}
