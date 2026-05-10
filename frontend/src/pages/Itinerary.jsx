import { useState } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Plus, Route } from 'lucide-react'
import TripMap from '../components/TripMap.jsx'
import { itineraryStops } from '../data/mock.js'

export default function Itinerary() {
  const [stops, setStops] = useState(itineraryStops)

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Itinerary builder</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Arrange cities and activities on the route</h1>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 shadow-glow">
            <Plus className="h-4 w-4" /> Add stop
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {stops.map((stop, index) => (
            <motion.div key={stop.city} whileHover={{ y: -2 }} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua-200">
                  <GripVertical className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold text-white">{index + 1}. {stop.city}</p>
                  <p className="text-sm text-slate-400">{stop.country}</p>
                </div>
              </div>
              <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10">Activities</button>
            </motion.div>
          ))}
        </div>
      </section>
      <TripMap />
      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-aqua-200"><Route className="h-4 w-4" /> Route controls</div>
        <p className="mt-3 text-slate-300">Use this space for drag-and-drop reordering, modal city search, and nested activity editors.</p>
      </section>
    </div>
  )
}
