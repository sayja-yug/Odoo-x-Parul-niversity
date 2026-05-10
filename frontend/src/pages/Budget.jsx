import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { AlertTriangle, Wallet2 } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BudgetChart from '../components/BudgetChart.jsx'
import { api } from '../api/client.js'

function parseNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

function groupBudgetByCategory(items) {
  const totals = {}
  for (const item of items) {
    const key = item.category || 'Other'
    const amount = parseNumber(item.actual_cost || item.estimated_cost)
    totals[key] = (totals[key] || 0) + amount
  }
  return Object.entries(totals).map(([name, value]) => ({ name, value }))
}

export default function Budget() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [budgetItems, setBudgetItems] = useState([])
  const [totals, setTotals] = useState({ estimated: 0, actual: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function loadBudgetData() {
      try {
        const [tripData, budgetData] = await Promise.all([
          api.trips.get(tripId),
          api.budgets.getForTrip(tripId),
        ])
        if (!active) return

        setTrip(tripData)
        const items = Array.isArray(budgetData?.items) ? budgetData.items : []
        setBudgetItems(items)
        setTotals({
          estimated: parseNumber(budgetData?.totals?.estimated),
          actual: parseNumber(budgetData?.totals?.actual),
        })
      } catch (err) {
        if (active) setError(err.message || 'Failed to load budget')
      } finally {
        if (active) setLoading(false)
      }
    }

    loadBudgetData()
    return () => {
      active = false
    }
  }, [tripId])

  const total = parseNumber(totals.actual || totals.estimated)
  const chartData = useMemo(() => groupBudgetByCategory(budgetItems), [budgetItems])
  const dayCount = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return 1
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 1
  }, [trip])
  const dailyAverage = Math.round(total / dayCount)
  const plannedBudget = parseNumber(trip?.total_budget)
  const overBudgetPercent = plannedBudget > 0 ? Math.max(0, Math.round(((total - plannedBudget) / plannedBudget) * 100)) : 0

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">Loading budget...</div>
  }

  if (error) {
    return <div className="rounded-3xl border border-red-400/30 bg-red-500/10 p-6 text-red-100">{error}</div>
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Budget tracker</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Monitor cost breakdown with clear visual alerts</h1>
          </div>
          <div className="rounded-2xl border border-sand-400/20 bg-sand-400/10 px-4 py-3 text-sm text-sand-100">
            <div className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" /> Over budget by {overBudgetPercent}%</div>
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
            <p className="mt-2 text-3xl font-semibold text-white">{budgetItems.length}</p>
          </div>
        </div>
      </section>
      <BudgetChart data={chartData} />
      <motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
        <div className="flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-aqua-200"><Wallet2 className="h-4 w-4" /> Cost notes</div>
        <p className="mt-3 text-slate-300">Here you can wire editable line items, budget warnings, and a future month-over-month chart.</p>
      </motion.section>
    </div>
  )
}
