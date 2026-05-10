import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, SlidersHorizontal, Filter, ArrowUpDown, Loader2,
  AlertCircle, Sparkles, Clock, DollarSign, Zap, MapPin,
  Star, Lightbulb, ChevronDown, ChevronUp, Plus, Check
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.js'

/* ─── category badge colour ─── */
const catColour = (cat = '') => {
  const c = cat.toLowerCase()
  if (c.includes('adventure') || c.includes('sport'))  return 'bg-orange-500/15 text-orange-300 border-orange-500/20'
  if (c.includes('culture')   || c.includes('museum')) return 'bg-purple-500/15 text-purple-300 border-purple-500/20'
  if (c.includes('food')      || c.includes('dining')) return 'bg-yellow-500/15 text-yellow-300 border-yellow-500/20'
  if (c.includes('nature')    || c.includes('park'))   return 'bg-emerald-500/15 text-emerald-300 border-emerald-500/20'
  if (c.includes('relax')     || c.includes('spa'))    return 'bg-pink-500/15 text-pink-300 border-pink-500/20'
  return 'bg-aqua-400/10 text-aqua-300 border-aqua-400/20'
}

const diffColour = (d = '') => ({
  easy:     'text-emerald-400',
  moderate: 'text-yellow-400',
  hard:     'text-red-400',
}[d.toLowerCase()] || 'text-slate-400')

/* ─── Single result card ─── */
function ActivityCard({ item, index, tripId, stops = [] }) {
  const [expanded, setExpanded] = useState(false)
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [selectedStopId, setSelectedStopId] = useState('')

  // Auto-select first stop if available
  useEffect(() => {
    if (stops.length > 0 && !selectedStopId) {
      setSelectedStopId(stops[0].id)
    }
  }, [stops])

  async function handleAdd() {
    if (!selectedStopId) return
    const stop = stops.find(s => s.id == selectedStopId)
    setAdding(true)
    try {
      await api.activities.addToStop(selectedStopId, {
        title: item.name,
        description: item.description,
        cost: item.estimated_cost_usd || 0,
        category: item.category || 'Activity',
        date: stop ? stop.arrival_date : null, // Default to first day of stop
        time_scheduled: '12:00:00', 
      })
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    } catch (e) {
      alert(e.message)
    } finally {
      setAdding(false)
    }
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft"
    >
      {/* main row */}
      <div
        className="flex cursor-pointer items-start justify-between gap-4 p-5"
        onClick={() => setExpanded(p => !p)}
      >
        <div className="flex items-start gap-4 min-w-0">
          {/* index bubble */}
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-sand-300 text-sm font-bold text-ink-950">
            {index + 1}
          </span>

          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-white">{item.name}</h3>
            <p className="mt-0.5 line-clamp-1 text-sm text-slate-400">{item.description}</p>

            {/* pills */}
            <div className="mt-2 flex flex-wrap gap-2">
              {item.category && (
                <span className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium capitalize ${catColour(item.category)}`}>
                  {item.category}
                </span>
              )}
              {item.difficulty && (
                <span className={`flex items-center gap-1 text-xs font-medium ${diffColour(item.difficulty)}`}>
                  <Zap className="h-3 w-3" /> {item.difficulty}
                </span>
              )}
              {item.duration_hours != null && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <Clock className="h-3 w-3 text-aqua-300" /> {item.duration_hours}h
                </span>
              )}
              {item.estimated_cost_usd != null && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <DollarSign className="h-3 w-3 text-emerald-400" />
                  {item.estimated_cost_usd === 0 ? 'Free' : `~$${item.estimated_cost_usd}`}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* expand toggle */}
        <button className="mt-1 shrink-0 text-slate-500 transition hover:text-slate-300">
          {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* expanded details */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="space-y-4 p-5 pt-4">
              {item.description && (
                <p className="text-sm leading-relaxed text-slate-300">{item.description}</p>
              )}
              <div className="grid gap-3 sm:grid-cols-2">
                {item.best_time && (
                  <div className="flex items-start gap-2 text-sm">
                    <Star className="mt-0.5 h-4 w-4 shrink-0 text-sand-300" />
                    <span className="text-slate-300"><span className="font-medium text-white">Best time:</span> {item.best_time}</span>
                  </div>
                )}
                {item.tips && (
                  <div className="flex items-start gap-2 text-sm">
                    <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-aqua-300" />
                    <span className="text-slate-300"><span className="font-medium text-white">Tip:</span> {item.tips}</span>
                  </div>
                )}
              </div>

              {/* Add to itinerary logic */}
              <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-white/5 pt-4">
                {stops.length > 0 ? (
                  <>
                    <div className="flex flex-col gap-1">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500">Select Section</p>
                      <select
                        value={selectedStopId}
                        onChange={e => setSelectedStopId(e.target.value)}
                        className="rounded-xl border-white/10 bg-white/5 py-1.5 px-3 text-xs text-white focus:border-aqua-400 focus:ring-0"
                      >
                        {stops.map(s => <option key={s.id} value={s.id}>{s.location} (Day {s.day_number})</option>)}
                      </select>
                    </div>
                    <button
                      onClick={handleAdd}
                      disabled={adding || added}
                      className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-bold shadow-glow transition hover:opacity-90 disabled:opacity-50 mt-4 sm:mt-0 ${
                        added ? 'bg-emerald-500 text-white' : 'bg-gradient-to-r from-aqua-400 to-sand-300 text-ink-950'
                      }`}
                    >
                      {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      {adding ? 'Adding...' : added ? 'Added!' : 'Add to Itinerary'}
                    </button>
                  </>
                ) : (
                  <Link
                    to={`/trips/${tripId}/itinerary`}
                    className="inline-flex items-center gap-2 rounded-2xl bg-white/5 border border-white/10 px-4 py-2 text-xs font-medium text-slate-400 transition hover:bg-white/10"
                  >
                    No sections found — create one first
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/* ════════════════════════════════════════
   Main Activity Search Page  (Screen 8)
════════════════════════════════════════ */
export default function ActivitySearch() {
  const { tripId } = useParams()

  const [query,    setQuery]    = useState('')
  const [city,     setCity]     = useState('')
  const [category, setCategory] = useState('')
  const [sortBy,   setSortBy]   = useState('default')
  const [results,  setResults]  = useState([])
  const [loading,  setLoading]  = useState(false)
  const [searched, setSearched] = useState(false)
  const [error,    setError]    = useState('')
  const [showFilter, setShowFilter] = useState(false)
  const [showSort,   setShowSort]   = useState(false)
  const [stops,      setStops]      = useState([])

  const inputRef = useRef(null)

  // Load trip stops for adding activities
  useEffect(() => {
    if (tripId) {
      api.trips.get(tripId)
        .then(data => setStops(data.stops || []))
        .catch(() => {})
    }
  }, [tripId])

  async function handleSearch(e) {
    e?.preventDefault()
    if (!query.trim()) return
    setLoading(true); setError(''); setSearched(false)
    try {
      const data = await api.ai.searchActivities(query.trim(), city.trim(), category)
      let list = data.results || []
      // sort client-side
      if (sortBy === 'cost_asc')  list = [...list].sort((a,b) => (a.estimated_cost_usd??0) - (b.estimated_cost_usd??0))
      if (sortBy === 'cost_desc') list = [...list].sort((a,b) => (b.estimated_cost_usd??0) - (a.estimated_cost_usd??0))
      if (sortBy === 'duration')  list = [...list].sort((a,b) => (a.duration_hours??0) - (b.duration_hours??0))
      setResults(list)
      setSearched(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const categories = ['Adventure', 'Culture', 'Food & Dining', 'Nature', 'Relaxation', 'Shopping', 'Nightlife']

  return (
    <div className="space-y-6">

      {/* ── Header ── */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass relative z-20 rounded-[2rem] p-6 shadow-soft sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aqua-300" />
              <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">AI Activity Search</p>
            </div>
            <h1 className="mt-2 text-3xl font-semibold text-white">Find Activities</h1>
            <p className="mt-1 text-sm text-slate-400">
              Powered by OpenAI — search for activities, attractions, and experiences.
            </p>
          </div>
          {tripId && (
            <Link to={`/trips/${tripId}/itinerary`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10">
              ← Back to Itinerary
            </Link>
          )}
        </div>

        {/* ── Search bar + controls row ── */}
        <form onSubmit={handleSearch} className="mt-6 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            {/* main search */}
            <div className="relative flex min-w-0 flex-1 items-center">
              <Search className="absolute left-4 h-4 w-4 text-slate-400" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Paragliding, temple tour, street food…"
                className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
              />
            </div>

            {/* city */}
            <div className="relative flex items-center">
              <MapPin className="absolute left-3 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={city}
                onChange={e => setCity(e.target.value)}
                placeholder="City (optional)"
                className="w-40 rounded-2xl border-white/10 bg-white/5 py-3 pl-9 pr-3 text-sm text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
              />
            </div>

            {/* Filter */}
            <div className="relative">
              <button type="button"
                onClick={() => { setShowFilter(p => !p); setShowSort(false) }}
                className={`flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm font-medium transition ${
                  category ? 'border-aqua-400/40 bg-aqua-400/10 text-aqua-300' : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10'
                }`}>
                <Filter className="h-4 w-4" /> Filter
              </button>
              <AnimatePresence>
                {showFilter && (
                  <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                    className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-xl">
                    <button type="button" onClick={() => { setCategory(''); setShowFilter(false) }}
                      className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${!category ? 'text-aqua-300' : 'text-slate-300'}`}>
                      All categories
                    </button>
                    {categories.map(c => (
                      <button key={c} type="button" onClick={() => { setCategory(c); setShowFilter(false) }}
                        className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${category===c ? 'text-aqua-300' : 'text-slate-300'}`}>
                        {c}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sort */}
            <div className="relative">
              <button type="button"
                onClick={() => { setShowSort(p => !p); setShowFilter(false) }}
                className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                <ArrowUpDown className="h-4 w-4" /> Sort by...
              </button>
              <AnimatePresence>
                {showSort && (
                  <motion.div initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-4 }}
                    className="absolute right-0 top-full z-30 mt-2 w-48 overflow-hidden rounded-2xl border border-white/10 bg-ink-900 shadow-xl">
                    {[['default','AI Suggested'],['cost_asc','Cost: Low to High'],['cost_desc','Cost: High to Low'],['duration','Duration']].map(([v,l]) => (
                      <button key={v} type="button" onClick={() => { setSortBy(v); setShowSort(false) }}
                        className={`flex w-full px-4 py-2.5 text-left text-sm transition hover:bg-white/5 ${sortBy===v ? 'text-aqua-300' : 'text-slate-300'}`}>
                        {l}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Search button */}
            <button type="submit" disabled={loading || !query.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90 disabled:opacity-50">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {loading ? 'Searching…' : 'Search'}
            </button>
          </div>

          {/* active filter chip */}
          {category && (
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Filtering by:</span>
              <button type="button" onClick={() => setCategory('')}
                className="flex items-center gap-1 rounded-full border border-aqua-400/30 bg-aqua-400/10 px-3 py-1 text-xs font-medium text-aqua-300 transition hover:bg-aqua-400/20">
                {category} ×
              </button>
            </div>
          )}
        </form>
      </motion.section>

      {/* ── Error ── */}
      {error && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="flex items-start gap-3 rounded-3xl border border-red-400/20 bg-red-500/10 p-5 text-red-200">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div>
            <p className="font-semibold">Search failed</p>
            <p className="mt-1 text-sm text-red-300">{error}</p>
            {error.includes('API key') && (
              <p className="mt-2 text-sm text-red-300">
                → Open <code className="rounded bg-red-500/20 px-1">.env</code> in the project root and add:<br />
                <code className="mt-1 block rounded bg-red-500/20 px-2 py-1 text-xs">OPENAI_API_KEY=sk-your-key-here</code>
              </p>
            )}
          </div>
        </motion.div>
      )}

      {/* ── Loading ── */}
      {loading && (
        <div className="space-y-3">
          {[1,2,3,4,5,6,7].map(i => (
            <div key={i} className="h-24 animate-pulse rounded-3xl bg-white/5" style={{ animationDelay: `${i*60}ms` }} />
          ))}
        </div>
      )}

      {/* ── Results ── */}
      {!loading && searched && (
        <motion.section initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
          className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
          <div className="mb-5 flex items-center gap-3">
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Results</p>
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-400">{results.length}</span>
            <span className="text-xs text-slate-500">for "{query}"</span>
          </div>

          {results.length === 0 ? (
            <div className="py-12 text-center">
              <Search className="mx-auto mb-4 h-10 w-10 text-slate-600" />
              <p className="text-slate-400">No results found. Try a different query.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((item, i) => (
                <ActivityCard key={i} item={item} index={i} tripId={tripId} stops={stops} />
              ))}
            </div>
          )}
        </motion.section>
      )}

      {/* ── Initial prompt ── */}
      {!loading && !searched && !error && (
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
          className="rounded-[2rem] border border-dashed border-white/15 p-12 text-center">
          <Sparkles className="mx-auto mb-4 h-10 w-10 text-slate-600" />
          <p className="text-base font-semibold text-slate-400">Search for activities with AI</p>
          <p className="mt-2 text-sm text-slate-500">
            Type something like "Paragliding", "Street food tour", or "Best beaches"
            {city ? ` in ${city}` : ' and optionally add a city'}.
          </p>
        </motion.div>
      )}

    </div>
  )
}
