import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Filter, ListFilter, SortAsc, Plus, MapPinned } from 'lucide-react'
import TripCard from '../components/TripCard.jsx'
import RegionCard from '../components/RegionCard.jsx'
import { api } from '../api/client.js'

const regions = [
  { name: 'Europe', image: '/images/europe.png' },
  { name: 'Asia', image: '/images/asia.png' },
  { name: 'Americas', image: '/images/americas.png' },
  { name: 'Africa', image: '/images/africa.png' },
  { name: 'Oceania', image: '/images/asia.png' }, // Reusing asia for oceania for now
]

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    api.trips.list()
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredTrips = trips.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="relative pb-24 space-y-8">
      {/* Hero Banner */}
      <section className="relative h-[300px] w-full overflow-hidden rounded-[2.5rem] border border-white/10 shadow-glow">
        <img
          src="/images/hero.png"
          alt="Travel Banner"
          className="h-full w-full object-cover brightness-75"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Where to next?
          </h1>
          <p className="mt-3 max-w-xl text-lg text-slate-200">
            Discover, plan, and share your next adventure with Traveloop's premium itinerary tools.
          </p>
        </div>
      </section>

      {/* Search & Filter Bar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bar ......"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <ListFilter className="h-4 w-4" />
            Group by
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <SortAsc className="h-4 w-4" />
            Sort by...
          </button>
        </div>
      </section>

      {/* Top Regional Selections */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white whitespace-nowrap">Top Regional Selections</h2>
          <div className="h-px w-full bg-white/10" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5 lg:gap-6">
          {regions.map((region) => (
            <RegionCard key={region.name} name={region.name} image={region.image} />
          ))}
        </div>
      </section>

      {/* Previous Trips Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-white whitespace-nowrap">Previous Trips</h2>
          <div className="h-px w-full bg-white/10" />
        </div>
        
        <div className="grid gap-6">
          {loading ? (
            <div className="py-20 text-center text-slate-400">Loading your itineraries...</div>
          ) : filteredTrips.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTrips.map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] border border-dashed border-white/15 bg-white/5 py-20 text-center">
              <MapPinned className="h-12 w-12 text-slate-500 mb-4" />
              <p className="text-xl font-medium text-white">No trips found</p>
              <p className="mt-2 text-slate-400">Time to start planning your first big adventure!</p>
            </div>
          )}
        </div>
      </section>

      {/* Floating Action Button */}
      <Link
        to="/trips/new"
        className="fixed bottom-8 right-8 z-50 flex items-center gap-3 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-6 py-4 font-bold text-ink-950 shadow-glow transition hover:scale-105 active:scale-95 sm:bottom-12 sm:right-12"
      >
        <Plus className="h-6 w-6" />
        Plan a trip
      </Link>
    </div>
  )
}
