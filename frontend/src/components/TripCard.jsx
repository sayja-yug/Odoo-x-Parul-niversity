import { ArrowUpRight, MapPin, CalendarRange, Wallet } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

function classifyStatus(trip) {
  const today = new Date(); today.setHours(0,0,0,0)
  const start = new Date(trip.start_date)
  const end   = new Date(trip.end_date)
  if (end < today)   return 'Completed'
  if (start > today) return 'Up-coming'
  return 'Ongoing'
}

const GRADIENTS = [
  'from-violet-600 to-indigo-500',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-rose-500',
  'from-sky-500 to-cyan-400',
  'from-pink-500 to-purple-500',
]

export default function TripCard({ trip }) {
  const navigate    = useNavigate()
  const status      = classifyStatus(trip)
  const stopsCount  = trip.stops_count ?? (trip.stops?.length ?? 0)
  // pick a gradient based on trip id so each card has a consistent colour
  const gradient    = GRADIENTS[(trip.id ?? 0) % GRADIENTS.length]

  return (
    <motion.article
      whileHover={{ y: -6 }}
      onClick={() => navigate(`/trips/${trip.id}`)}
      className="group cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft transition"
    >
      {/* cover / gradient */}
      <div className={`relative h-40 bg-gradient-to-br ${gradient}`}>
        {trip.cover_photo && (
          <img
            src={trip.cover_photo}
            alt={trip.title}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.22em] text-white/90">{status}</p>
            <h3 className="mt-1 truncate text-xl font-semibold text-white">{trip.title}</h3>
          </div>
          <div className="shrink-0 rounded-2xl border border-white/20 bg-white/15 p-2 text-white/90 backdrop-blur">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>

      {/* details */}
      <div className="space-y-3 p-5">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CalendarRange className="h-4 w-4 text-aqua-300" />
          {fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 text-sand-300" />
          {stopsCount} {stopsCount === 1 ? 'city' : 'cities'} planned
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            <Wallet className="h-4 w-4 text-emerald-400" />
            Estimated budget
          </div>
          <p className="text-lg font-semibold text-white">${trip.total_budget ?? 0}</p>
        </div>
      </div>
    </motion.article>
  )
}
