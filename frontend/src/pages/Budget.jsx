import { motion } from 'framer-motion'
import { AlertTriangle, Wallet2 } from 'lucide-react'
import BudgetChart from '../components/BudgetChart.jsx'
import { budgetSeries } from '../data/mock.js'

export default function Budget() {
  const total = budgetSeries.reduce((sum, item) => sum + item.value, 0)
  const dailyAverage = Math.round(total / 11)

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Budget tracker</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Monitor cost breakdown with clear visual alerts</h1>
          </div>
          <div className="rounded-2xl border border-sand-400/20 bg-sand-400/10 px-4 py-3 text-sm text-sand-100">
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Over budget by 8%</div>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Estimated total</p>
            <p className="mt-2 text-3xl font-semibold text-white">${total.toLocaleString()}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Average per day</p>
            <p className="mt-2 text-3xl font-semibold text-white">${dailyAverage}</p>
          </div>
          <div className="rounded-3xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm text-slate-400">Manual edits</p>
            <p className="mt-2 text-3xl font-semibold text-white">12</p>
          </div>
        </div>
      </section>
      <BudgetChart data={budgetSeries} />
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-aqua-200"><Wallet2 className="h-4 w-4" /> Cost notes</div>
        <p className="mt-3 text-slate-300">Here you can wire editable line items, budget warnings, and a future month-over-month chart.</p>
      </motion.section>
    </div>
  )
}
