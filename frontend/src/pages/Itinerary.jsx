import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GripVertical, Plus, Route } from 'lucide-react'
import { useParams } from 'react-router-dom'
import TripMap from '../components/TripMap.jsx'
import { api } from '../api/client.js'

export default function Itinerary() {
  const { tripId } = useParams()
  const [stops, setStops] = useState([])
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadTrip() {
      try {
        const tripData = await api.trips.get(tripId)
        setTrip(tripData)
        setStops(tripData.stops || [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadTrip()
  }, [tripId])

  if (loading) {
    return (
      <div className="space-y-6">
        <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
          <div className="h-8 w-32 animate-pulse rounded bg-white/10"></div>
          <div className="mt-4 h-12 w-64 animate-pulse rounded bg-white/10"></div>
        </section>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="text-lg font-semibold text-red-200">Error loading trip</h2>
          <p className="mt-2 text-red-100">{error}</p>
        </section>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="space-y-6">
        <section className="rounded-[2rem] border border-yellow-500/20 bg-yellow-500/10 p-6">
          <h2 className="text-lg font-semibold text-yellow-200">Trip not found</h2>
        </section>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Itinerary builder</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">{trip.title}</h1>
            {trip.description && <p className="mt-2 text-slate-300">{trip.description}</p>}
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 shadow-glow">
            <Plus className="h-4 w-4" /> Add stop
          </button>
        </div>
        <div className="mt-6 space-y-3">
          {stops && stops.length > 0 ? (
            stops.map((stop, index) => (
              <motion.div key={stop.id} whileHover={{ y: -2 }} className="flex items-center justify-between rounded-3xl border border-white/10 bg-white/5 px-4 py-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-aqua-200">
                    <GripVertical className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="font-semibold text-white">{index + 1}. {stop.city_name}</p>
                    <p className="text-sm text-slate-400">{stop.country}</p>
                  </div>
                </div>
                <button className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300 hover:bg-white/10">Activities</button>
              </motion.div>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 p-8 text-center">
              <p className="text-slate-400">No stops added yet. Click "Add stop" to start building your itinerary.</p>
            </div>
          )}
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
