import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  CheckCircle2, Backpack, Plus, Trash2, 
  RotateCcw, Share2, Search, Filter, 
  ArrowUpDown, Loader2, FileText, Shirt, 
  Laptop, ShoppingBag, X, ChevronDown
} from 'lucide-react'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

/* ─────────────────────────────────────────────
   Category Icons Mapping
───────────────────────────────────────────── */
const categoryIcons = {
  'Documents': FileText,
  'Clothing': Shirt,
  'Electronics': Laptop,
  'Essentials': Backpack,
  'Other': ShoppingBag
}

/* ─────────────────────────────────────────────
   Add Item Modal
───────────────────────────────────────────── */
function AddItemModal({ onClose, onAdded }) {
  const [name, setName] = useState('')
  const [cat, setCat] = useState('Essentials')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    try {
      await onAdded({ item_name: name.trim(), category: cat })
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-sm rounded-[2rem] border border-white/10 bg-ink-900 p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
           <h2 className="text-xl font-bold text-white">Add Packing Item</h2>
           <button onClick={onClose} className="text-slate-500 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="text" placeholder="Item Name (e.g. Passport)" 
            value={name} onChange={e => setName(e.target.value)}
            className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white focus:border-aqua-400"
            required autoFocus
          />
          <select 
            value={cat} onChange={e => setCat(e.target.value)}
            className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white focus:border-aqua-400"
          >
            {Object.keys(categoryIcons).map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-aqua-400 py-3 text-sm font-bold text-ink-950 disabled:opacity-50">
            {loading ? 'Adding...' : 'Add to Checklist'}
          </button>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Packing Screen 11
───────────────────────────────────────────── */
export default function Packing() {
  const { tripId } = useParams()
  const navigate = useNavigate()
  const [trip, setTrip] = useState(null)
  const [allTrips, setAllTrips] = useState([])
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => { loadData() }, [tripId])

  async function loadData() {
    setLoading(true)
    try {
      const [tripData, itemsData, tripsListData] = await Promise.all([
        api.trips.get(tripId),
        api.request(`/trips/${tripId}/packing/`),
        api.trips.list()
      ])
      setTrip(tripData)
      setItems(itemsData)
      setAllTrips(tripsListData)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  async function toggleItem(id, currentPacked) {
    try {
      const updated = await api.request(`/packing/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ is_packed: !currentPacked })
      })
      setItems(prev => prev.map(i => i.id === id ? updated : i))
    } catch (err) { alert(err.message) }
  }

  async function handleAddItem(data) {
    const newItem = await api.request(`/trips/${tripId}/packing/`, {
      method: 'POST',
      body: JSON.stringify(data)
    })
    setItems(prev => [...prev, newItem])
  }

  async function handleReset() {
    if (!window.confirm('Reset all items to unpacked?')) return
    try {
      await Promise.all(items.map(i => 
        api.request(`/packing/${i.id}/`, { method: 'PUT', body: JSON.stringify({ is_packed: false }) })
      ))
      loadData()
    } catch (err) { alert(err.message) }
  }

  if (loading) return <div className="flex h-64 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-aqua-400" /></div>
  if (!trip) return <div className="p-8 text-center text-red-400">Trip not found</div>

  const packedCount = items.filter(i => i.is_packed).length
  const totalCount = items.length
  const progressPercent = totalCount > 0 ? (packedCount / totalCount) * 100 : 0

  // Group items
  const grouped = {}
  items.forEach(i => {
    if (!grouped[i.category]) grouped[i.category] = []
    grouped[i.category].push(i)
  })

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-32">
      
      {/* Header Row (Screen 11 Style) */}
      <motion.section 
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass relative z-20 rounded-[2rem] p-6 shadow-soft"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
             <div className="h-12 w-12 rounded-2xl bg-aqua-400/10 border border-aqua-400/20 flex items-center justify-center text-aqua-400">
               <Backpack className="h-6 w-6" />
             </div>
             <div>
               <p className="text-xs uppercase tracking-[0.2em] text-aqua-200">Packing Checklist (Screen 11)</p>
               
               {/* Trip Selector Dropdown (Screen 11) */}
               <div className="mt-1 relative group">
                 <select 
                   value={tripId}
                   onChange={(e) => navigate(`/trips/${e.target.value}/packing`)}
                   className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-1.5 pr-10 text-sm font-bold text-white focus:outline-none focus:border-aqua-400 cursor-pointer"
                 >
                   {allTrips.map(t => (
                     <option key={t.id} value={t.id} className="bg-ink-900 text-white">Trip: {t.title}</option>
                   ))}
                 </select>
                 <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-aqua-400 pointer-events-none" />
               </div>
             </div>
          </div>
          <div className="flex gap-2">
             <button onClick={handleReset} className="p-2 text-slate-500 hover:text-white transition" title="Reset All">
               <RotateCcw className="h-5 w-5" />
             </button>
             <button className="p-2 text-slate-500 hover:text-white transition" title="Share">
               <Share2 className="h-5 w-5" />
             </button>
          </div>
        </div>

        {/* Progress Bar (Screen 11) */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Progress: {packedCount}/{totalCount} items packed</span>
            <span className="text-sm font-bold text-aqua-400">{Math.round(progressPercent)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/5 overflow-hidden border border-white/5 p-[1px]">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full rounded-full bg-gradient-to-r from-aqua-400 to-sand-300 shadow-glow"
            />
          </div>
        </div>

        {/* Search/Filter (Screen 11) */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
             <input type="text" placeholder="Search items..." className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua-400" />
          </div>
          <div className="flex gap-2">
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300">Group by</button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300">Filter</button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-slate-300">Sort by...</button>
          </div>
        </div>
      </motion.section>

      {/* Categorized List (Screen 11) */}
      <div className="space-y-10">
        {Object.entries(grouped).length > 0 ? Object.entries(grouped).map(([category, catItems]) => {
          const Icon = categoryIcons[category] || ShoppingBag
          const catPacked = catItems.filter(i => i.is_packed).length
          
          return (
            <motion.div key={category} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="mb-4 flex items-center justify-between border-b border-white/5 pb-2">
                 <div className="flex items-center gap-3">
                   <Icon className="h-4 w-4 text-aqua-400" />
                   <h2 className="text-base font-bold text-white tracking-wide">{category}</h2>
                 </div>
                 <span className="text-xs font-medium text-slate-500">{catPacked}/{catItems.length}</span>
              </div>

              <div className="grid gap-3">
                {catItems.map(item => (
                  <motion.div 
                    key={item.id} 
                    whileTap={{ scale: 0.98 }}
                    onClick={() => toggleItem(item.id, item.is_packed)}
                    className={`flex items-center justify-between gap-4 rounded-2xl border p-4 cursor-pointer transition ${
                      item.is_packed ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                       <div className={`h-5 w-5 rounded-md border flex items-center justify-center transition ${
                         item.is_packed ? 'bg-emerald-400 border-emerald-400' : 'border-white/20'
                       }`}>
                         {item.is_packed && <CheckCircle2 className="h-3.5 w-3.5 text-ink-950" />}
                       </div>
                       <span className={`text-sm font-medium ${item.is_packed ? 'text-slate-500 line-through' : 'text-slate-200'}`}>
                         {item.item_name}
                       </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        }) : (
          <div className="text-center py-20 glass rounded-[2rem]">
            <Backpack className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">Your checklist is empty. Add some essentials!</p>
          </div>
        )}
      </div>

      {/* Bottom Actions (Screen 11) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-lg px-4 z-50">
        <div className="glass rounded-[2rem] p-3 flex gap-3 shadow-2xl border border-white/10">
          <button 
            onClick={() => setShowAdd(true)}
            className="flex-1 rounded-2xl bg-white text-ink-950 py-3 text-sm font-bold flex items-center justify-center gap-2"
          >
            <Plus className="h-4 w-4" /> add item to checklist
          </button>
          <button 
            onClick={handleReset}
            className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10"
          >
            Reset all
          </button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-bold text-white hover:bg-white/10">
            Share Checklist
          </button>
        </div>
      </div>

      {showAdd && <AddItemModal onClose={() => setShowAdd(false)} onAdded={handleAddItem} />}
    </div>
  )
}
