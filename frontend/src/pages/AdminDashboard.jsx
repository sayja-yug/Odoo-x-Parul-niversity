import { motion } from 'framer-motion'
import { ShieldCheck, Users, TrendingUp, MapPinned, CalendarDays } from 'lucide-react'

const stats = [
  { title: 'Total trips', value: '148', icon: CalendarDays },
  { title: 'Active users', value: '64', icon: Users },
  { title: 'Top cities', value: '12', icon: MapPinned },
  { title: 'Engagement', value: '87%', icon: TrendingUp },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-aqua-200"><ShieldCheck className="h-5 w-5" /></div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Admin dashboard</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Platform analytics and user management</h1>
          </div>
        </div>
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
