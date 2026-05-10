import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Search, SlidersHorizontal, ArrowUpDown, Filter, Plus,
  ChevronDown, ChevronRight, CalendarDays, MapPin, Wallet,
  Clock, CheckCircle2, PlaneTakeoff
} from 'lucide-react'
import { api } from '../api/client.js'

/* ─── classify ─── */
function classify(trip) {
  const today = new Date(); today.setHours(0,0,0,0)
  const s = new Date(trip.start_date), e = new Date(trip.end_date)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'upcoming'
  if (e < today)   return 'completed'
  if (s > today)   return 'upcoming'
  return 'ongoing'
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─── Trip row card ─── */
function TripCard({ trip }) {
  const status     = classify(trip)
  const stopsCount = trip.stops_count ?? (trip.stops?.length ?? 0)

  const badge = {
    ongoing:   { cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20', icon: <Clock className="h-3 w-3" /> },
    upcoming:  { cls: 'bg-blue-500/15 text-blue-300 border-blue-500/20',          icon: <CalendarDays className="h-3 w-3" /> },
    completed: { cls: 'bg-slate-500/15 text-slate-300 border-slate-500/20',       icon: <CheckCircle2 className="h-3 w-3" /> },
  }[status]

  const strip = {
    ongoing:   'from-emerald-400 to-teal-400',
    upcoming:  'from-aqua-400 to-blue-400',
    completed: 'from-slate-500 to-slate-600',
  }[status]

  return (
    <Link
      to={`/trips/${trip.id}`}
      className="group block overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft transition hover:border-white/20 hover:bg-white/[0.08] hover:-translate-y-0.5"
    >
      <div className={`h-1 w-full bg-gradient-to-r ${strip}`} />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{trip.title}</h3>
            {trip.description && (
              <p className="mt-0.5 line-clamp-1 text-sm text-slate-400">{trip.description}</p>
            )}
          </div>
          <span className={`flex shrink-0 items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] font-medium capitalize ${badge.cls}`}>
            {badge.icon} {status}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5 text-aqua-300" />
            {fmtDate(trip.start_date)} → {fmtDate(trip.end_date)}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-sand-300" />
            {stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}
          </span>
          <span className="flex items-center gap-1.5">
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            ${trip.total_budget ?? 0}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-slate-500">{trip.is_public ? '🌐 Public' : '🔒 Private'}</span>
          <Link
            to={`/trips/${trip.id}/itinerary`}
            onClick={e => e.preventDefault() || (window.location.href = `/trips/${trip.id}/itinerary`)}
            className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-aqua-300 transition hover:bg-aqua-400/10"
          >
            Open Itinerary →
          </Link>
        </div>
      </div>
    </Link>
  )
}

/* ─── Collapsible group ─── */
function TripGroup({ label, trips, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  if (trips.length === 0) return null
  return (
    <div>
      <button onClick={() => setOpen(p => !p)}
        className="mb-4 flex items-center gap-2.5">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">{label}</p>
        <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-400">{trips.length}</span>
        {open ? <ChevronDown className="h-4 w-4 text-slate-500" /> : <ChevronRight className="h-4 w-4 text-slate-500" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div key="body" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="grid gap-4 pb-2 sm:grid-cols-2 xl:grid-cols-3">
              {trips.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ════════════════════════════════════════
   Main Trips Page
════════════════════════════════════════ */
export default function Trips() {
  const [trips,      setTrips]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [search,     setSearch]     = useState('')
  const [sortBy,     setSortBy]     = useState('date')
  const [groupBy,    setGroupBy]    = useState('status')
  const [filter,     setFilter]     = useState('all')
  const [showSort,   setShowSort]   = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(() => {
    api.trips.list()
      .then(setTrips).catch(e => setError(e.message)).finally(() => setLoading(false))
  }, [])

  const processed = useMemo(() => {
    let list = [...trips]
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(t => t.title.toLowerCase().includes(q) || (t.description||'').toLowerCase().includes(q))
    }
    if (filter !== 'all') list = list.filter(t => classify(t) === filter)
    if (sortBy === 'date')   list.sort((a,b) => new Date(a.start_date) - new Date(b.start_date))
    if (sortBy === 'budget') list.sort((a,b) => (b.total_budget??0) - (a.total_budget??0))
    if (sortBy === 'title')  list.sort((a,b) => a.title.localeCompare(b.title))
    return list
  }, [trips, search, sortBy, filter])

  const ongoing   = processed.filter(t => classify(t) === 'ongoing')
  const upcoming  = processed.filter(t => classify(t) === 'upcoming')
  const completed = processed.filter(t => classify(t) === 'completed')

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">My Trips</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Everything in one place</h1>
            <p className="mt-1 text-sm text-slate-400">Filter, sort, and jump back into any itinerary.</p>
          </div>
          <Link to="/trips/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90">
            <Plus className="h-4 w-4" /> Plan a trip
          </Link>
        </div>

        {/* search + controls */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <div className="relative flex min-w-0 flex-1 items-center">
            <Search className="absolute left-4 h-4 w-4 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search bar ......"
              className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400" />
          </div>

          {/* Group by */}
          <button onClick={() => setGroupBy(p => p === 'status' ? 'none' : 'status')}
            className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
              groupBy === 'status'
                ? 'border-aqua-400/40 bg-aqua-400/10 text-aqua-300'
                : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
            }`}>
            <SlidersHorizontal className="h-4 w-4" /> Group by
          </button>

          {/* Filter */}
          <div className="relative">
            <button onClick={() => { setShowFilter(p => !p); setShowSort(false) }}
              className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                filter !== 'all'
                  ? 'border-aqua-400/40 bg-aqua-400/10 text-aqua-300'
                  : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
              }`}>
              <Filter className="h-4 w-4" /> Filter
            </button>
            <AnimatePresence>
              {showFilter && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                  className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-xl">
                  {[['all','All trips'],['ongoing','Ongoing'],['upcoming','Up-coming'],['completed','Completed']].map(([v,l]) => (
                    <button key={v} onClick={() => { setFilter(v); setShowFilter(false) }}
                      className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${filter===v ? 'text-aqua-300' : 'text-slate-300'}`}>
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Sort */}
          <div className="relative">
            <button onClick={() => { setShowSort(p => !p); setShowFilter(false) }}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
              <ArrowUpDown className="h-4 w-4" /> Sort by...
            </button>
            <AnimatePresence>
              {showSort && (
                <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                  className="absolute right-0 top-full z-30 mt-2 w-44 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-xl">
                  {[['date','Date'],['budget','Budget'],['title','Title (A–Z)']].map(([v,l]) => (
                    <button key={v} onClick={() => { setSortBy(v); setShowSort(false) }}
                      className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${sortBy===v ? 'text-aqua-300' : 'text-slate-300'}`}>
                      {l}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.section>

      {/* ── Error ── */}
      {error && (
        <div className="rounded-3xl border border-red-400/20 bg-red-500/10 p-4 text-sm text-red-200">{error}</div>
      )}

      {/* ── Loading skeletons ── */}
      {loading && (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1,2,3,4,5,6].map(i => <div key={i} className="h-40 animate-pulse rounded-3xl bg-white/5" />)}
        </div>
      )}

      {/* ── Grouped view ── */}
      {!loading && !error && groupBy === 'status' && (
        <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          className="glass rounded-[2rem] p-6 shadow-soft sm:p-8 space-y-8">
          <TripGroup label="Ongoing"   trips={ongoing}   defaultOpen={true}  />
          <TripGroup label="Up-coming" trips={upcoming}  defaultOpen={true}  />
          <TripGroup label="Completed" trips={completed} defaultOpen={false} />
          {processed.length === 0 && (
            <div className="py-12 text-center">
              <PlaneTakeoff className="mx-auto mb-4 h-10 w-10 text-slate-600" />
              <p className="text-base font-semibold text-slate-400">
                {search ? 'No trips match your search.' : 'No trips yet.'}
              </p>
              {!search && (
                <Link to="/trips/new"
                  className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow">
                  <Plus className="h-4 w-4" /> Create your first trip
                </Link>
              )}
            </div>
          )}
        </motion.section>
      )}

      {/* ── Flat view ── */}
      {!loading && !error && groupBy === 'none' && (
        <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.05 }}
          className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
          {processed.length === 0 ? (
            <div className="py-12 text-center">
              <PlaneTakeoff className="mx-auto mb-4 h-10 w-10 text-slate-600" />
              <p className="text-sm text-slate-400">{search ? 'No results.' : 'No trips yet.'}</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {processed.map(t => <TripCard key={t.id} trip={t} />)}
            </div>
          )}
        </motion.section>
      )}

    </div>
  )
}
