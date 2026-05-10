import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Trash2, ChevronDown, ChevronUp, CalendarDays,
  Wallet, Map as MapIcon, Loader2, Check, AlertCircle, Edit3, X,
  Sparkles, Search, Filter, ArrowUpDown, MoreVertical,
  Clock, MapPin, ArrowDown
} from 'lucide-react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api/client.js'
import TripMap from '../components/TripMap.jsx'

/* ─────────────────────────────────────────────
   Formatters
───────────────────────────────────────────── */
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
}

function getDayLabel(date, startDate) {
  const start = new Date(startDate)
  const current = new Date(date)
  const diffTime = Math.abs(current - start)
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  return `Day ${diffDays + 1}`
}

/* ─────────────────────────────────────────────
   Activity Row
───────────────────────────────────────────── */
function ActivityRow({ activity, isLast, onDelete }) {
  return (
    <div className="relative flex items-start gap-6 pb-8">
      {!isLast && <div className="absolute left-[18px] top-10 h-[calc(100%-24px)] w-0.5 bg-gradient-to-b from-aqua-400/30 to-transparent" />}
      {!isLast && <div className="absolute left-3.5 bottom-0 text-aqua-400/40"><ArrowDown className="h-3 w-3" /></div>}
      <div className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 border border-white/10 text-aqua-300 shadow-soft">
        <Clock className="h-4 w-4" />
      </div>
      <div className="flex flex-1 items-center gap-4">
        <div className="group relative flex-1 rounded-[1.2rem] border border-white/10 bg-white/5 p-4 shadow-soft transition hover:bg-white/10">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">{activity.title}</h3>
              {activity.description && <p className="mt-1 text-xs text-slate-400 line-clamp-2">{activity.description}</p>}
              {activity.time_scheduled && <div className="mt-2 flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-aqua-300"><Clock className="h-3 w-3" /> {activity.time_scheduled.slice(0, 5)}</div>}
            </div>
            <button onClick={() => onDelete(activity.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
        </div>
        <div className="w-24 shrink-0 rounded-[1.2rem] border border-white/10 bg-white/5 p-4 text-center shadow-soft">
          <p className="text-[10px] uppercase tracking-widest text-slate-500 mb-1">Expense</p>
          <p className="text-xs font-bold text-emerald-400">{activity.cost > 0 ? `$${activity.cost}` : '—'}</p>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Add Activity Modal
───────────────────────────────────────────── */
function AddActivityModal({ stopId, date, onClose, onAdded }) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [cost, setCost] = useState('')
  const [time, setTime] = useState('12:00')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setLoading(true)
    try {
      await api.activities.addToStop(stopId, { title: title.trim(), description: desc.trim(), cost: parseFloat(cost) || 0, time_scheduled: `${time}:00`, date: date, category: 'Activity' })
      onAdded()
    } catch (e) { alert(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-md rounded-[2rem] border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4"><h2 className="text-xl font-semibold text-white">Add Activity ({fmtDate(date)})</h2><button onClick={onClose} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" placeholder="Activity Title" value={title} onChange={e => setTitle(e.target.value)} className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white focus:border-aqua-400" required />
          <textarea placeholder="Description" value={desc} onChange={e => setDesc(e.target.value)} rows={3} className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white resize-none" />
          <div className="grid grid-cols-2 gap-4"><input type="number" placeholder="Cost ($)" value={cost} onChange={e => setCost(e.target.value)} className="rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white" /><input type="time" value={time} onChange={e => setTime(e.target.value)} className="rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white" /></div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-aqua-400 py-3 text-sm font-bold text-ink-950 disabled:opacity-50">{loading ? 'Adding...' : 'Add to Itinerary'}</button>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Add Location Modal (with Geocoding)
───────────────────────────────────────────── */
function AddSectionModal({ tripId, date, onClose, onAdded }) {
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!city.trim()) return
    setLoading(true)
    try {
      // Free Nominatim Geocoding
      let lat = null, lng = null, country = 'Unknown'
      try {
        const geoResp = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(city.trim())}&limit=1`)
        const geoData = await geoResp.json()
        if (geoData && geoData[0]) {
          lat = parseFloat(geoData[0].lat)
          lng = parseFloat(geoData[0].lon)
          // Simple country extraction
          const parts = geoData[0].display_name.split(', ')
          country = parts[parts.length - 1]
        }
      } catch (err) { console.error('Geocoding failed', err) }

      await api.stops.addToTrip(tripId, { city_name: city.trim(), country, arrival_date: date, departure_date: date, lat, lng, description: `Stay in ${city}`, order: 0 })
      onAdded()
    } catch (e) { alert(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-ink-900 p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4"><h2 className="text-lg font-semibold text-white">Add Location</h2><button onClick={onClose} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button></div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-xs text-slate-400">Set a location. We'll automatically find it on the map!</p>
          <input type="text" placeholder="City Name (e.g. Paris)" value={city} onChange={e => setCity(e.target.value)} className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white focus:border-aqua-400" required autoFocus />
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-aqua-400 py-3 text-sm font-bold text-ink-950 disabled:opacity-50">{loading ? 'Searching...' : 'Set Location'}</button>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Main Itinerary View
───────────────────────────────────────────── */
export default function Itinerary() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(null)
  const [showLocModal, setShowLocModal] = useState(null)
  const [showMap, setShowMap] = useState(true)

  useEffect(() => { loadData() }, [tripId])

  async function loadData() {
    setLoading(true)
    try {
      const data = await api.trips.get(tripId)
      setTrip(data)
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  async function handleDeleteActivity(id) {
    if (!window.confirm('Delete?')) return
    try { await api.activities.delete(id); loadData() } catch (e) { alert(e.message) }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-aqua-400" /></div>
  if (error || !trip) return <div className="p-8 text-center text-red-400">{error || 'Trip not found'}</div>

  const dates = []
  const curr = new Date(trip.start_date); const end = new Date(trip.end_date)
  while (curr <= end) { dates.push(new Date(curr).toISOString().split('T')[0]); curr.setDate(curr.getDate() + 1) }

  const activitiesByDate = {}
  trip.stops.forEach(stop => {
    stop.activities.forEach(act => {
      const d = act.date || stop.arrival_date
      if (!activitiesByDate[d]) activitiesByDate[d] = []
      activitiesByDate[d].push(act)
    })
  })

  return (
    <div className="space-y-6">
      <motion.section initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="glass relative z-20 rounded-[2rem] p-6 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-aqua-300" /><p className="text-xs uppercase tracking-[0.2em] text-aqua-200">Itinerary</p></div>
            <h1 className="mt-1 text-2xl font-bold text-white">{trip.title}</h1>
          </div>
          <div className="flex gap-2">
             <button onClick={() => setShowMap(!showMap)} className={`flex items-center gap-2 rounded-xl border px-4 py-2 text-sm font-bold transition ${showMap ? 'bg-aqua-400 text-ink-950 border-aqua-400' : 'bg-white/5 text-slate-300 border-white/10'}`}>
               <MapIcon className="h-4 w-4" /> {showMap ? 'Hide Map' : 'Show Map'}
             </button>
             <Link to={`/trips/${tripId}/activities`} className="flex items-center gap-2 rounded-xl bg-aqua-400/10 border border-aqua-400/20 px-4 py-2 text-sm font-bold text-aqua-300 shadow-glow hover:bg-aqua-400/20"><Sparkles className="h-4 w-4" /> AI Suggest</Link>
          </div>
        </div>
      </motion.section>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Timeline Column */}
        <div className="flex-1 space-y-10">
          {dates.map((date, idx) => {
            const acts = activitiesByDate[date] || []
            const currentStop = trip.stops.find(s => date >= s.arrival_date && date <= s.departure_date)
            return (
              <motion.div key={date} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.05 }}>
                <div className="flex items-start gap-6 sm:gap-8">
                  <div className="w-16 sm:w-20 shrink-0">
                    <div className="sticky top-24 rounded-2xl border border-aqua-400/30 bg-aqua-400/10 px-2 sm:px-3 py-4 text-center shadow-glow">
                      <p className="text-xs font-bold text-aqua-300">{getDayLabel(date, trip.start_date)}</p>
                      <p className="mt-1 text-[10px] text-aqua-200/60 uppercase">{fmtDate(date)}</p>
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                      <h2 className="text-base font-semibold text-slate-200">
                        {currentStop ? <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-sand-300" /> {currentStop.city_name}</span> : <button onClick={() => setShowLocModal(date)} className="flex items-center gap-2 text-slate-500 hover:text-aqua-300 transition italic"><Plus className="h-3.5 w-3.5" /> No location set</button>}
                      </h2>
                      {currentStop && <button onClick={() => setShowAddModal({ stopId: currentStop.id, date })} className="text-xs font-bold text-aqua-400 hover:text-aqua-300 flex items-center gap-1 transition"><Plus className="h-3.5 w-3.5" /> Add Activity</button>}
                    </div>
                    <div className="min-h-[40px]">
                      {acts.length > 0 ? acts.map((act, aIdx) => <ActivityRow key={act.id} activity={act} isLast={aIdx === acts.length - 1} onDelete={handleDeleteActivity} />) : (
                        <div className="py-4">{!currentStop ? <button onClick={() => setShowLocModal(date)} className="rounded-xl border border-dashed border-white/10 bg-white/5 w-full py-6 text-sm text-slate-500 hover:border-aqua-400/40 hover:text-aqua-300 transition">+ Add Location for this Day</button> : <p className="text-sm text-slate-500 italic">No activities planned.</p>}</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Sticky Map Column */}
        {showMap && (
          <div className="w-full lg:w-[350px] xl:w-[450px]">
            <div className="sticky top-24">
              <TripMap stops={trip.stops} />
              <div className="mt-4 p-4 glass rounded-3xl border border-white/10">
                <p className="text-xs text-slate-400 flex items-center gap-2">
                   <AlertCircle className="h-3 w-3 text-aqua-400" />
                   Map automatically follows your itinerary. 
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {showAddModal && <AddActivityModal stopId={showAddModal.stopId} date={showAddModal.date} onClose={() => setShowAddModal(null)} onAdded={() => { loadData(); setShowAddModal(null) }} />}
      {showLocModal && <AddSectionModal tripId={tripId} date={showLocModal} onClose={() => setShowLocModal(null)} onAdded={() => { loadData(); setShowLocModal(null) }} />}
    </div>
  )
}
