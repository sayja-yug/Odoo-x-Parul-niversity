import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Users, TrendingUp, MapPinned, CalendarDays, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

const stats = [
  { title: 'Total trips', value: '148', icon: CalendarDays },
  { title: 'Active users', value: '64', icon: Users },
  { title: 'Top cities', value: '12', icon: MapPinned },
  { title: 'Engagement', value: '87%', icon: TrendingUp },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [logoutError, setLogoutError] = useState('')

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError('')
    try {
      await api.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setLogoutError(error.message || 'Logout failed')
      setLoggingOut(false)
    }
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-aqua-200"><ShieldCheck className="h-5 w-5" /></div>
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Admin dashboard</p>
              <h1 className="mt-1 text-3xl font-semibold text-white">Platform analytics and user management</h1>
            </div>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50">
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
        {logoutError && (
          <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-4">
            <p className="text-sm text-red-200">{logoutError}</p>
          </div>
        )}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon
          return (
            <motion.div key={item.title} whileHover={{ y: -3 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <Icon className="h-5 w-5 text-aqua-200" />
              <p className="mt-4 text-sm text-slate-400">{item.title}</p>
              <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
            </motion.div>
          )
        })}
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">User table</p>
        <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
          <table className="min-w-full divide-y divide-white/10 text-left text-sm">
            <thead className="bg-white/5 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">User</th>
                <th className="px-4 py-3 font-medium">Trips</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 bg-black/10 text-slate-200">
              <tr><td className="px-4 py-3">Aanya Patel</td><td className="px-4 py-3">12</td><td className="px-4 py-3 text-emerald-300">Active</td></tr>
              <tr><td className="px-4 py-3">Rohan Mehta</td><td className="px-4 py-3">8</td><td className="px-4 py-3 text-emerald-300">Active</td></tr>
              <tr><td className="px-4 py-3">Priya Shah</td><td className="px-4 py-3">5</td><td className="px-4 py-3 text-amber-300">Review</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
