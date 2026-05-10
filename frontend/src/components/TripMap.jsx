import { motion } from 'framer-motion'
import L from 'leaflet'
import { MapContainer, Marker, Popup, Polyline, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for leaflet markers in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const customMarker = L.divIcon({
  className: '',
  html: '<div style="width:20px;height:20px;border-radius:9999px;background:linear-gradient(135deg,#22d3ee,#fcd34d);box-shadow:0 0 0 4px rgba(34,211,238,.15);border:2px solid white"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
})

export default function TripMap({ stops = [] }) {
  // Filter out stops without coordinates
  const validStops = stops.filter(s => s.lat && s.lng)
  const route = validStops.map((stop) => [stop.lat, stop.lng])
  
  // Center on first stop or default to middle of the world
  const center = route.length > 0 ? route[0] : [20, 0]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-soft"
    >
      <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-aqua-200">Interactive Map</p>
          <h3 className="text-sm font-semibold text-white">OpenStreetMap Route</h3>
        </div>
        <div className="h-2 w-2 rounded-full bg-aqua-400 animate-pulse" />
      </div>
      
      <div className="h-[400px] w-full z-0">
        <MapContainer 
          center={center} 
          zoom={route.length > 1 ? 4 : 10} 
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {route.length > 1 && (
            <Polyline positions={route} pathOptions={{ color: '#22d3ee', weight: 3, opacity: 0.6, dashArray: '8, 8' }} />
          )}
          {validStops.map((stop) => (
            <Marker key={stop.id} position={[stop.lat, stop.lng]} icon={customMarker}>
              <Popup>
                <div className="p-1">
                  <p className="text-sm font-bold text-ink-950">{stop.city_name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{stop.country}</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </motion.div>
  )
}
