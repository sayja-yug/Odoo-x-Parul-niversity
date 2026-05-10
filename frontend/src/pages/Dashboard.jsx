import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Wallet, MapPinned, Users } from 'lucide-react'
import StatCard from '../components/StatCard.jsx'
import TripCard from '../components/TripCard.jsx'
import BudgetChart from '../components/BudgetChart.jsx'
import TripMap from '../components/TripMap.jsx'
import { api } from '../api/client.js'
import { budgetSeries } from '../data/mock.js'

export default function Dashboard() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.trips.list()
      .then(setTrips)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="glass overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-glow sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.3fr,0.7fr] lg:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-aqua-400/20 bg-aqua-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-aqua-200">
              <Sparkles className="h-3.5 w-3.5" />
              Premium travel planning
            </div>
            <h1 className="mt-5 max-w-2xl text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Build beautiful multi-city itineraries without losing the plot.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Traveloop keeps your route, budget, packing list, notes, and shareable trip plan in one polished workspace.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/trips/new" className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:scale-[1.01]">
                Create new trip
                <ArrowRight className="h-4 w-4" />
              </Link>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Explore sample itinerary
              </button>
            </div>
          </div>
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[1.8rem] border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Today</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">Next departure</p>
                <p className="mt-1 text-2xl font-semibold text-white">None scheduled</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Cities planned</p>
                  <p className="mt-2 text-2xl font-semibold text-white">{trips.length}</p>
                </div>
                <div className="rounded-2xl bg-white/5 p-4">
                  <p className="text-sm text-slate-400">Status</p>
                  <p className="mt-2 text-2xl font-semibold text-white">Active</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Trips created" value={trips.length.toString()} detail="Real-time data" accent="from-aqua-400 to-cyan-600" />
        <StatCard title="Shared plans" value="0" detail="No shared trips" accent="from-sand-300 to-orange-500" />
        <StatCard title="Status" value="Online" detail="System ready" accent="from-emerald-300 to-teal-500" />
        <StatCard title="Budget tracking" value="Enabled" detail="Dynamic updates" accent="from-sky-300 to-blue-600" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr,0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Recent trips</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Ready to continue planning</h2>
            </div>
            <Link to="/trips" className="text-sm font-medium text-aqua-200 hover:text-white">View all trips</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {loading ? (
              <div className="col-span-full py-12 text-center text-slate-400">Loading trips...</div>
            ) : trips.length > 0 ? (
              trips.slice(0, 3).map((trip) => (
                <TripCard key={trip.id} trip={trip} />
              ))
            ) : (
              <div className="col-span-full rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
                <p className="text-slate-400">No trips found. Create your first itinerary!</p>
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <BudgetChart data={budgetSeries} />
          <div className="glass rounded-3xl p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Trip health</p>
                <h3 className="mt-1 text-lg font-semibold text-white">Budget and map alignment</h3>
              </div>
              <Wallet className="h-5 w-5 text-sand-300" />
            </div>
            <div className="mt-5 space-y-3">
              <div>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-300"><span>Budget usage</span><span>0%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[0%] rounded-full bg-gradient-to-r from-aqua-400 to-sand-300" /></div>
              </div>
              <div>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-300"><span>Route completion</span><span>0%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 w-[0%] rounded-full bg-gradient-to-r from-emerald-300 to-teal-500" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <TripMap />
    </div>
  )
}
