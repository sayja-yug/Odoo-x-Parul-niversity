import { useState } from 'react'
import { motion } from 'framer-motion'
import { CalendarRange, MapPin, Plus, ClipboardList } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

const suggestions = [
  { id: 1, name: 'Hiking in Swiss Alps', image: '/images/hiking.png' },
  { id: 2, name: 'Europe Tour', image: '/images/europe.png' },
  { id: 3, name: 'Asian Adventure', image: '/images/asia.png' },
  { id: 4, name: 'American Roadtrip', image: '/images/americas.png' },
  { id: 5, name: 'African Safari', image: '/images/africa.png' },
  { id: 6, name: 'City Exploration', image: '/images/hero.png' },
]

export default function CreateTrip() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
  })
  const [status, setStatus] = useState({ loading: false, error: '' })

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })

    try {
      const trip = await api.trips.create({
        ...form,
        total_budget: 0,
        is_public: false,
      })
      navigate(`/trips/${trip.id}/itinerary`)
    } catch (error) {
      setStatus({ loading: false, error: error.message })
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header section */}
      <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <h1 className="text-2xl font-bold tracking-tight text-white">Traveloop</h1>
        <div className="mt-4 h-px w-full bg-white/10" />
        <h2 className="mt-4 text-xl font-semibold text-aqua-200 uppercase tracking-[0.1em]">Plan a new trip</h2>
      </section>

      {/* Form section */}
      <motion.form 
        initial={{ opacity: 0, y: 12 }} 
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit} 
        className="rounded-3xl border border-white/10 bg-white/5 p-8 shadow-soft space-y-6"
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="flex items-center gap-4">
            <span className="w-32 text-sm font-semibold text-white whitespace-nowrap">Select a Place :</span>
            <div className="relative flex-1">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                required
                value={form.title}
                onChange={(e) => updateField('title', e.target.value)}
                placeholder="e.g. Paris, Japan, etc."
                className="w-full rounded-xl border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400 transition"
              />
            </div>
          </label>

          <label className="flex items-center gap-4">
            <span className="w-32 text-sm font-semibold text-white whitespace-nowrap">Start Date:</span>
            <div className="relative flex-1">
              <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                required
                value={form.start_date}
                onChange={(e) => updateField('start_date', e.target.value)}
                className="w-full rounded-xl border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400 transition"
              />
            </div>
          </label>

          <label className="flex items-center gap-4">
            <span className="w-32 text-sm font-semibold text-white whitespace-nowrap">End Date:</span>
            <div className="relative flex-1">
              <CalendarRange className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="date"
                required
                value={form.end_date}
                onChange={(e) => updateField('end_date', e.target.value)}
                className="w-full rounded-xl border-white/10 bg-white/10 py-2.5 pl-10 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400 transition"
              />
            </div>
          </label>

          <label className="flex items-center gap-4">
            <span className="w-32 text-sm font-semibold text-white whitespace-nowrap">Brief Note:</span>
            <div className="relative flex-1">
              <ClipboardList className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={form.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="vibe, goals, etc."
                className="w-full rounded-xl border-white/10 bg-white/10 py-2.5 pl-10 px-4 text-white focus:border-aqua-400 focus:ring-aqua-400 transition"
              />
            </div>
          </label>
        </div>

        {status.error && (
          <div className="rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
            {status.error}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={status.loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-8 py-3.5 font-bold text-ink-950 shadow-glow transition hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {status.loading ? 'Planning...' : 'Plan a trip'}
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </motion.form>

      {/* Suggestion section */}
      <section className="space-y-6">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl">
          <h3 className="text-lg font-medium text-slate-200">Suggestion for visit/Activities to perform</h3>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:gap-6">
          {suggestions.map((item) => (
            <motion.div
              key={item.id}
              whileHover={{ scale: 1.02 }}
              className="group relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft"
            >
              <img
                src={item.image}
                alt={item.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-semibold text-white">{item.name}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}