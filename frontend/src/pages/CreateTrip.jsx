import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CalendarRange, CheckCircle2, ImagePlus, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

export default function CreateTrip() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    start_date: '',
    end_date: '',
    description: '',
    total_budget: '',
    is_public: false,
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
        total_budget: form.total_budget ? Number(form.total_budget) : 0,
      })
      navigate(`/trips/${trip.id}/itinerary`)
    } catch (error) {
      setStatus({ loading: false, error: error.message })
      return
    }
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <section className="glass overflow-hidden rounded-[2rem] p-6 shadow-glow sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-aqua-400/20 bg-aqua-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-aqua-200">
              <Sparkles className="h-3.5 w-3.5" />
              New trip
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-white sm:text-5xl">Create your next itinerary</h1>
            <p className="mt-4 max-w-2xl text-slate-300">Give your trip a title, choose the dates, and jump straight into the itinerary builder once it is saved.</p>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="flex items-center gap-2 text-aqua-200">
              <CheckCircle2 className="h-4 w-4" />
              Creates a real trip record
            </div>
            <p className="mt-2 max-w-xs leading-6">After save, Traveloop redirects to the itinerary builder for the new trip.</p>
          </div>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1.1fr,0.9fr]">
        <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
          <div className="space-y-5">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Trip name</span>
              <input
                required
                value={form.title}
                onChange={(event) => updateField('title', event.target.value)}
                placeholder="Coastal Europe Loop"
                className="w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Start date</span>
                <div className="relative">
                  <CalendarRange className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={form.start_date}
                    onChange={(event) => updateField('start_date', event.target.value)}
                    className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400"
                  />
                </div>
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">End date</span>
                <div className="relative">
                  <CalendarRange className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    required
                    value={form.end_date}
                    onChange={(event) => updateField('end_date', event.target.value)}
                    className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400"
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Trip description</span>
              <textarea
                rows="5"
                value={form.description}
                onChange={(event) => updateField('description', event.target.value)}
                placeholder="Describe the goal, vibe, or special notes for this itinerary"
                className="w-full rounded-3xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-200">Total budget</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.total_budget}
                  onChange={(event) => updateField('total_budget', event.target.value)}
                  placeholder="2500"
                  className="w-full rounded-2xl border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
                />
              </label>
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={form.is_public}
                  onChange={(event) => updateField('is_public', event.target.checked)}
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-aqua-400 focus:ring-aqua-400"
                />
                <span className="text-sm text-slate-200">Make this trip public</span>
              </label>
            </div>

            {status.error ? <div className="rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{status.error}</div> : null}

            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={status.loading}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-3 text-sm font-semibold text-ink-950 shadow-glow transition hover:scale-[1.01] disabled:opacity-60"
              >
                {status.loading ? 'Saving...' : 'Create trip'}
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => navigate('/trips')}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Back to trips
              </button>
            </div>
          </div>
        </motion.section>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
            <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-aqua-200">
              <ImagePlus className="h-4 w-4" />
              Cover photo
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-300">The backend supports image uploads, but this screen currently creates the trip record first for a fast working flow. You can add cover upload next.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">What happens next</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-300">
              <li>1. A real Trip record is created in Django.</li>
              <li>2. You are redirected to the itinerary builder.</li>
              <li>3. Add stops, activities, budgets, and notes from there.</li>
            </ul>
          </div>
        </div>
      </form>
    </div>
  )
}