import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle2, Backpack } from 'lucide-react'

const initialItems = [
  { id: 1, name: 'Travel documents', category: 'Documents', packed: true },
  { id: 2, name: 'Light jacket', category: 'Clothing', packed: false },
  { id: 3, name: 'Power bank', category: 'Electronics', packed: false },
  { id: 4, name: 'Toiletry kit', category: 'Toiletries', packed: true },
]

export default function Packing() {
  const [items, setItems] = useState(initialItems)

  function toggleItem(id) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, packed: !item.packed } : item)))
  }

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-aqua-200"><Backpack className="h-5 w-5" /></div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Packing checklist</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Track essentials before departure</h1>
          </div>
        </div>
      </section>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <motion.button key={item.id} whileHover={{ y: -3 }} onClick={() => toggleItem(item.id)} className={`rounded-3xl border p-5 text-left shadow-soft transition ${item.packed ? 'border-emerald-400/30 bg-emerald-500/10' : 'border-white/10 bg-white/5'}`}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-lg font-semibold text-white">{item.name}</p>
                <p className="mt-1 text-sm text-slate-400">{item.category}</p>
              </div>
              <CheckCircle2 className={`h-5 w-5 ${item.packed ? 'text-emerald-300' : 'text-slate-500'}`} />
            </div>
            <p className="mt-4 text-sm text-slate-300">{item.packed ? 'Packed and ready.' : 'Tap to mark as packed.'}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
