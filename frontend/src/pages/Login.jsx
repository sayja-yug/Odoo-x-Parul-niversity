import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Lock, PlaneTakeoff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Login() {
  const [form, setForm] = useState({ username: '', password: '' })
  const [status, setStatus] = useState({ loading: false, error: '' })

  async function handleSubmit(event) {
    event.preventDefault()
    setStatus({ loading: true, error: '' })
    try {
      await api.login(form)
    } catch (error) {
      setStatus({ loading: false, error: error.message })
      return
    }
    setStatus({ loading: false, error: '' })
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <section className="hidden bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,.25),_transparent_35%),linear-gradient(180deg,#07111f_0%,#0b1730_100%)] p-8 lg:flex lg:flex-col lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-sand-300 text-ink-950">
            <PlaneTakeoff className="h-5 w-5" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-aqua-200">Traveloop</p>
            <p className="text-sm text-slate-400">Sign in to keep planning</p>
          </div>
        </div>
        <div className="max-w-xl">
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Premium travel workflow</p>
          <h1 className="mt-4 text-5xl font-semibold tracking-tight text-white">Your route, notes, and budget in a single elegant workspace.</h1>
        </div>
      </section>

      <section className="flex items-center justify-center p-6 sm:p-10">
        <motion.form
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-soft backdrop-blur-xl"
        >
          <h2 className="text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-400">Log in to continue your trip planning flow.</p>
          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Username</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400" value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} placeholder="traveler@example.com" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-200">Password</span>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input type="password" className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} placeholder="••••••••" />
              </div>
            </label>
          </div>
          {status.error ? <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">{status.error}</div> : null}
          <button disabled={status.loading} className="mt-6 w-full rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 font-semibold text-ink-950 shadow-glow transition hover:scale-[1.01] disabled:opacity-60">
            {status.loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="mt-5 text-center text-sm text-slate-400">
            New here? <Link to="/signup" className="text-aqua-200 hover:text-white">Create an account</Link>
          </p>
        </motion.form>
      </section>
    </div>
  )
}
