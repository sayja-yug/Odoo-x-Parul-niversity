import { ArrowUpRight, MapPin, CalendarRange } from 'lucide-react'
import { motion } from 'framer-motion'

export default function TripCard({ trip }) {
  return (
    <motion.article
      whileHover={{ y: -6 }}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft transition"
    >
      <div className={`h-40 relative ${!trip.image ? `bg-gradient-to-br ${trip.gradient}` : ''}`}>
        {trip.image && (
          <img src={trip.image} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-white/90">{trip.status || 'Planned'}</p>
            <h3 className="mt-1 text-xl font-semibold text-white">{trip.title}</h3>
          </div>
          <div className="rounded-2xl border border-white/20 bg-white/15 p-2 text-white/90 backdrop-blur">
            <ArrowUpRight className="h-4 w-4" />
          </div>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <CalendarRange className="h-4 w-4 text-aqua-300" />
          {trip.dateRange}
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-300">
          <MapPin className="h-4 w-4 text-sand-300" />
          {trip.cities} cities planned
        </div>
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <p className="text-sm text-slate-400">Estimated budget</p>
          <p className="text-lg font-semibold text-white">{trip.budget}</p>
        </div>
      </div>
    </motion.article>
  )
}
