import { useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Copy, Globe2, MapPin, ShieldAlert } from 'lucide-react'
import { itineraryStops } from '../data/mock.js'

export default function SharedItinerary() {
  const { shareToken } = useParams()

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-[2rem] p-6 shadow-glow sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.22em] text-aqua-200">
              <Globe2 className="h-3.5 w-3.5" />
              Public itinerary
            </div>
            <h1 className="mt-4 text-4xl font-semibold text-white">Coastal Europe Loop</h1>
            <p className="mt-3 max-w-2xl text-slate-300">This read-only view hides sensitive budget details while preserving route, cities, and activities.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 shadow-glow">
            <Copy className="h-4 w-4" />
            Copy trip
          </button>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr,0.7fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-aqua-200">
              <MapPin className="h-4 w-4" />
              Shared route
            </div>
            <div className="mt-4 space-y-3">
              {itineraryStops.map((stop, index) => (
                <div key={stop.city} className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 px-4 py-3">
                  <div>
                    <p className="font-medium text-white">{index + 1}. {stop.city}</p>
                    <p className="text-sm text-slate-400">{stop.country}</p>
                  </div>
                  <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-300">Stop {index + 1}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-sand-200">
              <ShieldAlert className="h-4 w-4" />
              Privacy
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-300">Share token: {shareToken}</p>
            <p className="mt-3 text-sm leading-6 text-slate-300">Budget values remain hidden in this view. Logged-in users can copy the trip into their own workspace.</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
