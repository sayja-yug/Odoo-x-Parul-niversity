import { motion } from 'framer-motion'
import { Mail, Globe2, Camera, Shield, Trash2 } from 'lucide-react'

export default function Profile() {
  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-aqua-400 to-sand-300 text-2xl font-bold text-ink-950">A</div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Profile settings</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Aanya Patel</h1>
            <p className="mt-2 text-slate-300">Product designer and weekend route planner.</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Account</p>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400" defaultValue="aanya@traveloop.dev" />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Language</span>
              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400" defaultValue="en">
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </label>
          </div>
          <button className="mt-6 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950">Save changes</button>
        </motion.form>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-slate-300"><Camera className="h-4 w-4 text-aqua-200" /> Upload profile photo</div>
            <p className="mt-3 text-sm text-slate-400">Use drag-and-drop or image upload with validation and preview.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-slate-300"><Shield className="h-4 w-4 text-emerald-300" /> Change password</div>
            <p className="mt-3 text-sm text-slate-400">Password reset flow can be wired into Django auth views.</p>
          </div>
          <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-red-100"><Trash2 className="h-4 w-4" /> Delete account</div>
            <p className="mt-3 text-sm text-red-100/80">Confirmation modal and destructive action guard go here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
