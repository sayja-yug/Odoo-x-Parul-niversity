import { useState, useEffect, forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, ChevronDown, ChevronUp, CalendarDays,
  Wallet, Map, Loader2, Check, AlertCircle, Edit3, X
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.js'

/* ─────────────────────────────────────────────
   Small helper: format a date string nicely
───────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}

/* ─────────────────────────────────────────────
   Section card — matches Excalidraw "Section N"
───────────────────────────────────────────── */
const SectionCard = forwardRef(function SectionCard({ stop, index, tripId, onDeleted, onUpdated }, ref) {
  const [expanded, setExpanded] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [err, setErr] = useState('')

  // editable fields
  const [desc, setDesc] = useState(stop.description || '')
  const [dateFrom, setDateFrom] = useState(stop.arrival_date || '')
  const [dateTo, setDateTo] = useState(stop.departure_date || '')
  const [budget, setBudget] = useState(stop.cost_index || '')

  async function handleSave() {
    setSaving(true); setErr('')
    try {
      const updated = await api.stops.update(stop.id, {
        description: desc,
        arrival_date: dateFrom,
        departure_date: dateTo,
        cost_index: budget,
      })
      onUpdated(updated)
      setEditing(false)
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm(`Delete Section ${index + 1} "${stop.city_name}"?`)) return
    setDeleting(true)
    try {
      await api.stops.delete(stop.id)
      onDeleted(stop.id)
    } catch (e) {
      setErr(e.message)
      setDeleting(false)
    }
  }

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 260, damping: 24 }}
      className="relative overflow-hidden rounded-[1.6rem] border border-white/10 bg-white/5 shadow-soft backdrop-blur-sm"
    >
      {/* top accent bar */}
      <div className="h-1 w-full bg-gradient-to-r from-aqua-400 via-sand-300 to-aqua-400 opacity-60" />

      {/* header row */}
      <div className="flex items-center justify-between px-6 pt-5 pb-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-aqua-400 to-sand-300 text-sm font-bold text-ink-950 shadow-glow">
            {index + 1}
          </span>
          <div>
            <h2 className="text-base font-semibold text-white">
              {stop.city_name}
              {stop.country ? <span className="ml-2 text-xs font-normal text-slate-400">{stop.country}</span> : null}
            </h2>
            <p className="text-xs text-slate-500">Section {index + 1}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-aqua-400/10 hover:text-aqua-300"
              title="Edit section"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-red-500/10 hover:text-red-400 disabled:opacity-40"
            title="Delete section"
          >
            {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setExpanded(p => !p)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10"
          >
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* body */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 px-6 pb-5">
              {/* description */}
              {editing ? (
                <textarea
                  value={desc}
                  onChange={e => setDesc(e.target.value)}
                  rows={3}
                  placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity…"
                  className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
                />
              ) : (
                <p className="text-sm leading-relaxed text-slate-300">
                  {stop.description || (
                    <span className="italic text-slate-500">
                      All the necessary information about this section. This can be anything like travel section, hotel or any other activity.
                    </span>
                  )}
                </p>
              )}

              {/* date range + budget */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {/* date range */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
                    <CalendarDays className="h-3.5 w-3.5" /> Date Range
                  </label>
                  {editing ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={dateFrom}
                        onChange={e => setDateFrom(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
                      />
                      <span className="text-slate-500">to</span>
                      <input
                        type="date"
                        value={dateTo}
                        onChange={e => setDateTo(e.target.value)}
                        className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">
                      {stop.arrival_date ? (
                        <span>{fmtDate(stop.arrival_date)} → {fmtDate(stop.departure_date)}</span>
                      ) : (
                        <span className="italic text-slate-500">Date Range: xxx to yyy</span>
                      )}
                    </div>
                  )}
                </div>

                {/* budget / cost index */}
                <div className="flex flex-col gap-1">
                  <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
                    <Wallet className="h-3.5 w-3.5" /> Budget of this section
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={budget}
                      onChange={e => setBudget(e.target.value)}
                      placeholder="e.g. $500, high, medium…"
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
                    />
                  ) : (
                    <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white">
                      {stop.cost_index ? (
                        <span className="capitalize">{stop.cost_index}</span>
                      ) : (
                        <span className="italic text-slate-500">Budget of this section</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* save / cancel when editing */}
              {editing && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90 disabled:opacity-60"
                  >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                    Save
                  </button>
                  <button
                    onClick={() => { setEditing(false); setErr('') }}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    <X className="h-4 w-4" /> Cancel
                  </button>
                </div>
              )}

              {err && (
                <p className="flex items-center gap-1.5 text-xs text-red-400">
                  <AlertCircle className="h-3.5 w-3.5" /> {err}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
})

/* ─────────────────────────────────────────────
   Modal — Add New Section
───────────────────────────────────────────── */
function AddSectionModal({ tripId, sectionNumber, onClose, onAdded }) {
  const [cityName, setCityName] = useState('')
  const [country, setCountry] = useState('')
  const [desc, setDesc] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [budget, setBudget] = useState('')
  const [saving, setSaving] = useState(false)
  const [err, setErr] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    if (!cityName.trim()) { setErr('Section name / city is required.'); return }
    if (!dateFrom || !dateTo) { setErr('Please select a date range.'); return }
    setSaving(true); setErr('')
    try {
      const payload = {
        city_name: cityName.trim(),
        country: country.trim() || 'Unknown',
        description: desc.trim(),
        arrival_date: dateFrom,
        departure_date: dateTo,
        cost_index: budget.trim() || 'medium',
        duration_days: Math.max(1, Math.ceil((new Date(dateTo) - new Date(dateFrom)) / 86400000)),
        order: sectionNumber,
      }
      const stop = await api.stops.addToTrip(tripId, payload)
      onAdded(stop)
      onClose()
    } catch (e) {
      setErr(e.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 px-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, y: 24 }}
        className="w-full max-w-lg overflow-hidden rounded-[2rem] border border-white/10 bg-ink-900 shadow-2xl"
      >
        {/* modal header */}
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-widest text-aqua-300">Itinerary Builder</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Add Section {sectionNumber}</h2>
          </div>
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Section / City Name *
              </label>
              <input
                type="text"
                value={cityName}
                onChange={e => setCityName(e.target.value)}
                placeholder="e.g. Paris, Flight to Tokyo…"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium uppercase tracking-widest text-slate-400">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={e => setCountry(e.target.value)}
                placeholder="e.g. France"
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium uppercase tracking-widest text-slate-400">
              Description
            </label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              rows={3}
              placeholder="All the necessary information about this section. This can be anything like travel section, hotel or any other activity…"
              className="resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-500 outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> Date From *
              </label>
              <input
                type="date"
                value={dateFrom}
                onChange={e => setDateFrom(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30 [color-scheme:dark]"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
                <CalendarDays className="h-3.5 w-3.5" /> Date To *
              </label>
              <input
                type="date"
                value={dateTo}
                onChange={e => setDateTo(e.target.value)}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30 [color-scheme:dark]"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-widest text-slate-400">
              <Wallet className="h-3.5 w-3.5" /> Budget of this section
            </label>
            <input
              type="text"
              value={budget}
              onChange={e => setBudget(e.target.value)}
              placeholder="e.g. $500, high, medium, low…"
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-aqua-400/50 focus:ring-1 focus:ring-aqua-400/30"
            />
          </div>

          {err && (
            <p className="flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0" /> {err}
            </p>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-aqua-400 to-sand-300 px-6 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90 disabled:opacity-60"
            >
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Add Section
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   Main Itinerary Page
───────────────────────────────────────────── */
export default function Itinerary() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [stops, setStops] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    // Reset immediately so old trip data doesn't show while loading
    setTrip(null)
    setStops([])
    setError('')
    setLoading(true)

    async function load() {
      try {
        const data = await api.trips.get(tripId)
        setTrip(data)
        setStops(data.stops || [])
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [tripId])

  function handleAdded(stop) {
    setStops(prev => [...prev, stop])
  }

  function handleDeleted(stopId) {
    setStops(prev => prev.filter(s => s.id !== stopId))
  }

  function handleUpdated(updated) {
    setStops(prev => prev.map(s => s.id === updated.id ? updated : s))
  }

  /* ── loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
          <div className="h-4 w-28 animate-pulse rounded bg-white/10" />
          <div className="mt-3 h-9 w-56 animate-pulse rounded bg-white/10" />
        </div>
        {[1, 2, 3].map(i => (
          <div key={i} className="h-36 animate-pulse rounded-[1.6rem] bg-white/5" />
        ))}
      </div>
    )
  }

  /* ── error state ── */
  if (error) {
    return (
      <div className="rounded-[2rem] border border-red-500/20 bg-red-500/10 p-8">
        <h2 className="text-lg font-semibold text-red-200">Error loading itinerary</h2>
        <p className="mt-2 text-sm text-red-100">{error}</p>
      </div>
    )
  }

  /* ── not found ── */
  if (!trip) {
    return (
      <div className="rounded-[2rem] border border-yellow-500/20 bg-yellow-500/10 p-8">
        <h2 className="text-lg font-semibold text-yellow-200">Trip not found</h2>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-6">

        {/* ── Page header ── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-[2rem] p-6 shadow-soft sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Map className="h-4 w-4 text-aqua-300" />
                <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Build Itinerary Screen</p>
              </div>
              <h1 className="mt-2 text-3xl font-semibold text-white">{trip.title}</h1>
              {trip.description && (
                <p className="mt-1 text-sm text-slate-400">{trip.description}</p>
              )}
              <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <CalendarDays className="h-3.5 w-3.5 text-aqua-300" />
                  {fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  <Wallet className="h-3.5 w-3.5 text-sand-300" />
                  ${trip.total_budget ?? 0} total budget
                </span>
                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                  {stops.length} section{stops.length !== 1 ? 's' : ''} planned
                </span>
              </div>
            </div>

            <Link
              to={`/trips/${tripId}`}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/10"
            >
              ← Back to Trip
            </Link>
          </div>
        </motion.section>

        {/* ── Sections list ── */}
        <div className="space-y-4">
          <AnimatePresence>
            {stops.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-[1.6rem] border border-dashed border-white/20 p-12 text-center"
              >
                <Map className="mx-auto mb-4 h-10 w-10 text-slate-600" />
                <p className="text-base font-medium text-slate-400">No sections yet</p>
                <p className="mt-1 text-sm text-slate-500">
                  Click "Add another Section" below to start building your itinerary.
                </p>
              </motion.div>
            ) : (
              stops.map((stop, i) => (
                <SectionCard
                  key={stop.id}
                  stop={stop}
                  index={i}
                  tripId={tripId}
                  onDeleted={handleDeleted}
                  onUpdated={handleUpdated}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* ── Add another Section button ── */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowModal(true)}
          className="flex w-full items-center justify-center gap-3 rounded-[1.6rem] border-2 border-dashed border-aqua-400/40 bg-aqua-400/5 py-5 text-base font-semibold text-aqua-300 shadow-soft transition hover:border-aqua-400/70 hover:bg-aqua-400/10 hover:text-aqua-200"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-aqua-400/20">
            <Plus className="h-5 w-5" />
          </span>
          Add another Section
        </motion.button>

      </div>

      {/* ── Add Section Modal ── */}
      <AnimatePresence>
        {showModal && (
          <AddSectionModal
            tripId={tripId}
            sectionNumber={stops.length + 1}
            onClose={() => setShowModal(false)}
            onAdded={handleAdded}
          />
        )}
      </AnimatePresence>
    </>
  )
}
