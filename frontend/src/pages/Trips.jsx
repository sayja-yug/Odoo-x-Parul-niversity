import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Filter, Plus } from 'lucide-react'
import TripCard from '../components/TripCard.jsx'
import SkeletonCard from '../components/SkeletonCard.jsx'
import { api } from '../api/client.js'
import { recentTrips } from '../data/mock.js'

export default function Trips() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    api.trips
      .list()
      .then((data) => {
        if (active) setTrips(data)
      })
      .catch(() => {
        if (active) setTrips(recentTrips)
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">My trips</p>
          <h1 className="mt-1 text-3xl font-semibold text-white">Everything in one place</h1>
          <p className="mt-2 max-w-2xl text-slate-300">Filter, sort, and jump back into any itinerary without losing context.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white hover:bg-white/10">
            <Filter className="h-4 w-4" />
            Sort
          </button>
          <Link to="/trips/new" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 shadow-glow">
            <Plus className="h-4 w-4" />
            Create trip
          </Link>
        </div>
      </div>

      {error ? <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-4 text-sm text-red-100">{error}</div> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {loading ? Array.from({ length: 3 }).map((_, index) => <SkeletonCard key={index} />) : trips.map((trip) => <TripCard key={trip.id} trip={trip} />)}
      </div>

      {!loading && trips.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-[2rem] border border-dashed border-white/15 bg-white/5 p-10 text-center">
          <p className="text-xl font-semibold text-white">No trips yet</p>
          <p className="mt-2 text-slate-400">Create your first itinerary and start adding cities, activities, and budget lines.</p>
        </motion.div>
      ) : null}
    </div>
  )
}
