import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, Wallet2, Plus, Trash2, Edit3, DollarSign, Calculator, ArrowUpRight, TrendingUp } from 'lucide-react'
import { useParams } from 'react-router-dom'
import BudgetChart from '../components/BudgetChart.jsx'
import { api } from '../api/client.js'

function parseNumber(value) {
  const num = Number(value)
  return Number.isFinite(num) ? num : 0
}

const CATEGORIES = ['Transport', 'Accommodation', 'Activities', 'Food', 'Other']

export default function Budget() {
  const { tripId } = useParams()
  const [trip, setTrip] = useState(null)
  const [budgetItems, setBudgetItems] = useState([])
  const [totals, setTotals] = useState({ estimated: 0, actual: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [isEditingBudget, setIsEditingBudget] = useState(false)
  const [newPlannedBudget, setNewPlannedBudget] = useState('')

  const [newItem, setNewItem] = useState({
    category: 'Other',
    estimated_cost: '',
    notes: ''
  })

  const loadData = async () => {
    try {
      const [tripData, budgetData] = await Promise.all([
        api.trips.get(tripId),
        api.budgets.getForTrip(tripId),
      ])
      setTrip(tripData)
      setNewPlannedBudget(tripData.total_budget || '')
      setBudgetItems(Array.isArray(budgetData?.items) ? budgetData.items : [])
      setTotals({
        estimated: parseNumber(budgetData?.totals?.estimated),
        actual: parseNumber(budgetData?.totals?.actual),
      })
    } catch (err) {
      setError(err.message || 'Failed to load budget')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [tripId])

  const handleUpdatePlannedBudget = async () => {
    try {
      await api.trips.update(tripId, { total_budget: newPlannedBudget })
      setTrip({ ...trip, total_budget: newPlannedBudget })
      setIsEditingBudget(false)
    } catch (err) {
      alert(err.message)
    }
  }

  const handleAddItem = async (e) => {
    e.preventDefault()
    try {
      await api.budgets.createForTrip(tripId, {
        ...newItem,
        estimated_cost: parseNumber(newItem.estimated_cost),
        actual_cost: parseNumber(newItem.estimated_cost)
      })
      setIsAdding(false)
      setNewItem({ category: 'Other', estimated_cost: '', notes: '' })
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const handleDeleteItem = async (id) => {
    if (id.toString().startsWith('act_')) {
      alert("This item is automatically calculated from your itinerary activities. To change it, edit your activities in the Itinerary section.")
      return
    }
    if (!confirm('Are you sure you want to delete this expense?')) return
    try {
      await api.budgets.delete(id)
      loadData()
    } catch (err) {
      alert(err.message)
    }
  }

  const totalSpent = parseNumber(totals.actual || totals.estimated)
  const plannedBudget = parseNumber(trip?.total_budget)
  const remainingBudget = plannedBudget - totalSpent
  const overBudgetPercent = plannedBudget > 0 ? Math.max(0, Math.round(((totalSpent - plannedBudget) / plannedBudget) * 100)) : 0

  const chartData = useMemo(() => {
    const categories = {}
    budgetItems.forEach(item => {
      const cat = item.category || 'Other'
      categories[cat] = (categories[cat] || 0) + parseNumber(item.actual_cost || item.estimated_cost)
    })
    return Object.entries(categories).map(([name, value]) => ({ name, value }))
  }, [budgetItems])

  const dayCount = useMemo(() => {
    if (!trip?.start_date || !trip?.end_date) return 1
    const start = new Date(trip.start_date)
    const end = new Date(trip.end_date)
    const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1
    return diffDays > 0 ? diffDays : 1
  }, [trip])

  const dailyAverage = Math.round(totalSpent / dayCount)

  if (loading) return <div className="p-10 text-center text-slate-400">Initializing budget tracker...</div>

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-20">
      {/* Header Section */}
      <section className="glass relative overflow-hidden rounded-[2.5rem] p-8 shadow-2xl">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-aqua-400/10 blur-3xl" />
        
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-aqua-400">
              <TrendingUp className="h-5 w-5" />
              <span className="text-sm font-bold uppercase tracking-widest">Financial Insights</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Trip Economics</h1>
            <p className="text-lg text-slate-400">Smart tracking for your {trip?.title} adventure</p>
          </div>

          <div className="flex flex-col items-end gap-3">
            {isEditingBudget ? (
              <div className="flex items-center gap-2 rounded-2xl bg-white/5 p-2 pr-4 ring-1 ring-white/10">
                <input
                  type="number"
                  value={newPlannedBudget}
                  onChange={(e) => setNewPlannedBudget(e.target.value)}
                  className="w-24 bg-transparent px-2 py-1 text-right font-bold text-white outline-none"
                  placeholder="0"
                />
                <button onClick={handleUpdatePlannedBudget} className="rounded-xl bg-aqua-500 px-3 py-1.5 text-xs font-bold text-slate-900 transition-transform active:scale-95">Save</button>
                <button onClick={() => setIsEditingBudget(false)} className="text-xs text-slate-500 underline">Cancel</button>
              </div>
            ) : (
              <button 
                onClick={() => setIsEditingBudget(true)}
                className="group flex items-center gap-2 rounded-2xl bg-white/5 px-5 py-3 transition-all hover:bg-white/10 ring-1 ring-white/10"
              >
                <div className="text-right">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500">Total Planned</p>
                  <p className="text-xl font-bold text-white">${plannedBudget.toLocaleString()}</p>
                </div>
                <Edit3 className="h-4 w-4 text-slate-500 transition-colors group-hover:text-aqua-400" />
              </button>
            )}

            <div className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-bold ring-1 ${overBudgetPercent > 0 ? 'bg-red-500/10 text-red-400 ring-red-500/20' : 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20'}`}>
              {overBudgetPercent > 0 ? <AlertTriangle className="h-3.5 w-3.5" /> : <Calculator className="h-3.5 w-3.5" />}
              {overBudgetPercent > 0 ? `Over budget by ${overBudgetPercent}%` : 'Under Budget'}
            </div>
          </div>
        </div>

        {/* Core Stats */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="glass-card rounded-3xl p-6 ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-aqua-500/20 p-3 text-aqua-400"><DollarSign className="h-6 w-6" /></div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Total Spent</p>
                <p className="text-2xl font-bold text-white">${totalSpent.toLocaleString()}</p>
              </div>
            </div>
          </div>
          
          <div className="glass-card rounded-3xl p-6 ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              <div className={`rounded-2xl p-3 ${remainingBudget >= 0 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                <Wallet2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Remaining</p>
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-white' : 'text-red-400'}`}>${remainingBudget.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 ring-1 ring-white/5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-purple-500/20 p-3 text-purple-400"><ArrowUpRight className="h-6 w-6" /></div>
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Daily Average</p>
                <p className="text-2xl font-bold text-white">${dailyAverage.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
        {/* Visualization & Form */}
        <div className="space-y-8 lg:col-span-2">
          <BudgetChart data={chartData} />

          <section className="glass rounded-[2rem] p-6 ring-1 ring-white/10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-white">Quick Add Expense</h3>
              <Plus className="h-5 w-5 text-aqua-400" />
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Category</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full rounded-xl bg-white/5 border-none p-3 text-sm text-white ring-1 ring-white/10 focus:ring-aqua-500/50 outline-none"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Amount ($)</label>
                  <input 
                    type="number"
                    value={newItem.estimated_cost}
                    onChange={(e) => setNewItem({...newItem, estimated_cost: e.target.value})}
                    className="w-full rounded-xl bg-white/5 border-none p-3 text-sm text-white ring-1 ring-white/10 focus:ring-aqua-500/50 outline-none"
                    placeholder="0.00"
                    required
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-500 px-1">Description / Note</label>
                <input 
                  type="text"
                  value={newItem.notes}
                  onChange={(e) => setNewItem({...newItem, notes: e.target.value})}
                  className="w-full rounded-xl bg-white/5 border-none p-3 text-sm text-white ring-1 ring-white/10 focus:ring-aqua-500/50 outline-none"
                  placeholder="e.g. Flight to Tokyo"
                />
              </div>
              <button 
                type="submit"
                className="w-full rounded-xl bg-aqua-500 py-4 font-bold text-slate-900 transition-all hover:bg-aqua-400 active:scale-[0.98] shadow-lg shadow-aqua-500/20"
              >
                Add Transaction
              </button>
            </form>
          </section>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-3">
          <section className="glass h-full rounded-[2.5rem] p-8 ring-1 ring-white/10">
            <div className="mb-8">
              <h3 className="text-xl font-bold text-white">Expense History</h3>
              <p className="text-sm text-slate-500 mt-1">Detailed breakdown of all your travel costs</p>
            </div>

            <div className="space-y-4">
              <AnimatePresence mode='popLayout'>
                {budgetItems.length === 0 && (
                  <div className="py-20 text-center text-slate-500">No expenses recorded yet. Start by adding one or checking your itinerary activities.</div>
                )}
                {budgetItems.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id}
                    className="group relative flex items-center justify-between rounded-2xl bg-white/5 p-4 transition-all hover:bg-white/10 ring-1 ring-white/5 hover:ring-white/20"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-lg font-bold ${item.is_virtual ? 'text-aqua-400' : 'text-purple-400'}`}>
                        {item.category?.[0] || 'O'}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-white">{item.notes || 'Untitled Expense'}</h4>
                          {item.is_virtual && (
                            <span className="rounded-full bg-aqua-500/10 px-2 py-0.5 text-[10px] font-bold text-aqua-400">SYNCED</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">{item.category}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <p className="text-lg font-bold text-white">${parseNumber(item.actual_cost || item.estimated_cost).toLocaleString()}</p>
                      <button 
                        onClick={() => handleDeleteItem(item.id)}
                        className={`rounded-xl p-2.5 transition-colors ${item.is_virtual ? 'opacity-0 cursor-default' : 'text-slate-500 hover:bg-red-500/10 hover:text-red-400'}`}
                        disabled={item.is_virtual}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
