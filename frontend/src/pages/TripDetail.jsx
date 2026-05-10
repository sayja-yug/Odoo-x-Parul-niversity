import { useEffect, useState, useMemo } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarDays, MapPin, Pencil, Share2, Wallet, Package, CheckCircle2, TrendingUp, Clock } from 'lucide-react'
import { api } from '../api/client.js'

function formatDateRange(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 'Date not set'
  return `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
}

export default function TripDetail() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [budgetData, setBudgetData] = useState(null)
  const [packingItems, setPackingItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    
    async function loadAllData() {
      try {
        const [tripRes, budgetRes, packingRes] = await Promise.all([
          api.trips.get(tripId),
          api.budgets.getForTrip(tripId),
          api.packingItems.getForTrip(tripId)
        ])
        
        if (active) {
          setTrip(tripRes)
          setBudgetData(budgetRes)
          setPackingItems(packingRes)
        }
      } catch (err) {
        if (active) setError(err.message || 'Failed to load trip details')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadAllData()
    return () => { active = false }
  }, [tripId])

  const stats = useMemo(() => {
    if (!trip) return null
    
    // Packing stats
    const packedCount = packingItems.filter(i => i.is_packed).length
    const packingPercent = packingItems.length > 0 ? Math.round((packedCount / packingItems.length) * 100) : 0
    
    // Budget stats
    const totalSpent = budgetData?.totals?.actual || 0
    const plannedBudget = Number(trip.total_budget) || 0
    const budgetPercent = plannedBudget > 0 ? Math.round((totalSpent / plannedBudget) * 100) : 0
    
    // Route stats
    const citiesCount = trip.stops?.length || 0
    const daysCount = trip.start_date && trip.end_date 
      ? Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)) + 1 
      : 0

    return { packingPercent, packedCount, totalPacking: packingItems.length, totalSpent, plannedBudget, budgetPercent, citiesCount, daysCount }
  }, [trip, budgetData, packingItems])

  if (loading) return <div className="p-10 text-center text-slate-400">Loading your journey...</div>
  if (error) return <div className="rounded-[2rem] border border-red-500/20 bg-red-500/5 p-8 text-red-400">{error}</div>
  if (!trip) return <div className="p-10 text-center text-slate-400">Trip not found.</div>

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-20">
      {/* Hero Header */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="glass relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aqua-400/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-aqua-400">Adventure Overview</p>
              <h1 className="mt-2 text-5xl font-black tracking-tight text-white">{trip.title}</h1>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm font-medium">
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10">
                <CalendarDays className="h-4 w-4 text-aqua-400" />
                <span className="text-slate-200">{formatDateRange(trip.start_date, trip.end_date)}</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10">
                <MapPin className="h-4 w-4 text-sand-300" />
                <span className="text-slate-200">{stats.citiesCount} cities explored</span>
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 px-4 py-2.5 ring-1 ring-white/10">
                <Wallet className="h-4 w-4 text-emerald-400" />
                <span className="text-slate-200">${stats.plannedBudget.toLocaleString()} budget</span>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Link 
              to={`/trips/${tripId}/itinerary`} 
              className="flex items-center gap-2 rounded-2xl bg-aqua-500 px-6 py-4 font-bold text-slate-900 transition-all hover:bg-aqua-400 hover:scale-[1.02] active:scale-95 shadow-lg shadow-aqua-500/20"
            >
              <Pencil className="h-5 w-5" />
              Open builder
            </Link>
            <button className="flex items-center gap-2 rounded-2xl bg-white/5 px-6 py-4 font-bold text-white ring-1 ring-white/10 transition-all hover:bg-white/10 active:scale-95">
              <Share2 className="h-5 w-5" />
              Share
            </button>
          </div>
        </div>
      </motion.section>

      {/* Insight Grid */}
      <section className="grid gap-6 md:grid-cols-3">
        {/* Route Timeline Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass group rounded-[2rem] p-6 transition-all hover:ring-1 hover:ring-aqua-500/30 shadow-soft"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-aqua-500/10 text-aqua-400">
            <Clock className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Route Timeline</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.daysCount}</span>
            <span className="text-lg font-medium text-slate-400">Days</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            You have {stats.citiesCount} stops planned over a {stats.daysCount}-day journey through {trip.title}.
          </p>
          <Link to={`/trips/${tripId}/itinerary`} className="mt-6 flex items-center gap-2 text-sm font-bold text-aqua-400 group-hover:underline">
            View full route <TrendingUp className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Budget Highlight Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass group rounded-[2rem] p-6 transition-all hover:ring-1 hover:ring-emerald-500/30 shadow-soft"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400">
            <Wallet className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Budget Spent</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.budgetPercent}%</span>
            <span className="text-sm font-medium text-slate-400">of ${stats.plannedBudget.toLocaleString()}</span>
          </div>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(stats.budgetPercent, 100)}%` }}
              className={`h-full ${stats.budgetPercent > 100 ? 'bg-red-500' : 'bg-emerald-500'}`}
            />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            You've logged ${stats.totalSpent.toLocaleString()} in expenses so far.
          </p>
          <Link to={`/trips/${tripId}/budget`} className="mt-6 flex items-center gap-2 text-sm font-bold text-emerald-400 group-hover:underline">
            Manage budget <TrendingUp className="h-3.5 w-3.5" />
          </Link>
        </motion.div>

        {/* Packing Readiness Card */}
        <motion.div 
          whileHover={{ y: -5 }}
          className="glass group rounded-[2rem] p-6 transition-all hover:ring-1 hover:ring-purple-500/30 shadow-soft"
        >
          <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
            <Package className="h-6 w-6" />
          </div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Packing Readiness</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-black text-white">{stats.packingPercent}%</span>
            <span className="text-lg font-medium text-slate-400">Ready</span>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-purple-400" />
            <span className="text-sm text-slate-400">{stats.packedCount} of {stats.totalPacking} items packed</span>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">
            Ensure you have everything ready for your departure on {new Date(trip.start_date).toLocaleDateString()}.
          </p>
          <Link to={`/trips/${tripId}/packing`} className="mt-6 flex items-center gap-2 text-sm font-bold text-purple-400 group-hover:underline">
            Open checklist <TrendingUp className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </section>
    </div>
  )
}
