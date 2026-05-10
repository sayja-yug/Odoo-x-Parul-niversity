import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Pencil, Share2, Wallet } from 'lucide-react'
import { recentTrips } from '../data/mock.js'

export default function TripDetail() {
  const { tripId } = useParams()
  const trip = recentTrips[(Number(tripId) - 1) % recentTrips.length] || recentTrips[0]

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Trip detail</p>
            <h1 className="mt-2 text-4xl font-semibold text-white">{trip.title}</h1>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><CalendarDays className="h-4 w-4 text-aqua-300" />{trip.dateRange}</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><MapPin className="h-4 w-4 text-sand-300" />{trip.cities} cities</span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2"><Wallet className="h-4 w-4 text-emerald-300" />{trip.budget}</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to={`/trips/${tripId}/itinerary`} className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 shadow-glow"><Pencil className="h-4 w-4" />Open builder</Link>
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10"><Share2 className="h-4 w-4" />Share</button>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 lg:grid-cols-3">
        {['Route timeline', 'Budget highlights', 'Packing readiness'].map((label, index) => (
          <div key={label} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">0{index + 6}</p>
            <p className="mt-2 text-sm text-slate-400">Refined trip summary with polished interactions.</p>
          </div>
        ))}
      </section>
    </div>
  )
}
