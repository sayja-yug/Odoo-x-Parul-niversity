import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle2, 
  Search, 
  Filter, 
  SortAsc,
  Receipt,
  Users,
  Calendar,
  Wallet
} from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

export default function Invoice() {
  const { id } = useParams()
  const [search, setSearch] = useState('')

  // Hardcoded demo data for the video/screenshot as requested
  const invoiceData = {
    id: 'INV-xyz-30290',
    date: 'May 20, 2025',
    status: 'pending',
    tripTitle: 'Trip to Europe Adventure',
    tripDates: 'May 15 - Jun 05, 2025',
    tripCreator: 'James',
    travelers: ['James', 'Arjun', 'Jerry', 'Cristina'],
    budget: {
      total: 20000,
      spent: 22000,
      remaining: -2000
    },
    items: [
      { id: 1, category: 'Hotel', description: 'Hotel booking Paris', qty: '3 nights', unitCost: 3000, amount: 9000 },
      { id: 2, category: 'Travel', description: 'Flight bookings (DEL -> PAR)', qty: '1', unitCost: 12000, amount: 12000 },
    ]
  }

  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.amount, 0)
  const tax = subtotal * 0.05
  const discount = 50
  const grandTotal = subtotal + tax - discount

  const pieData = [
    { name: 'Spent', value: invoiceData.budget.spent, color: '#f87171' },
    { name: 'Remaining', value: Math.max(0, invoiceData.budget.total - invoiceData.budget.spent), color: '#2dd4bf' }
  ]

  return (
    <div className="min-h-screen space-y-8 pb-20">
      {/* Header Area */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/trips/${id}`} className="group flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white">
            <ArrowLeft className="h-5 w-5 transition group-hover:-translate-x-1" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">Expense Invoice</h1>
            <p className="text-sm text-slate-400">Billing details for {invoiceData.tripTitle}</p>
          </div>
        </div>

        <div className="flex flex-1 items-center gap-4 max-w-xl">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search invoices..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:border-aqua-400 focus:ring-aqua-400"
            />
          </div>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white">
            <Filter className="h-4 w-4" />
          </button>
          <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-400 hover:bg-white/10 hover:text-white">
            <SortAsc className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Invoice Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass rounded-[2.5rem] border border-white/10 p-8 shadow-soft">
            {/* Top Summary Row */}
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex gap-6">
                <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600/20 to-indigo-500/20 border border-white/10">
                  <Receipt className="h-10 w-10 text-violet-400" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-xl font-bold text-white">{invoiceData.tripTitle}</h2>
                  <p className="text-sm text-slate-400 flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-aqua-400" /> {invoiceData.tripDates}
                  </p>
                  <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Created by {invoiceData.tripCreator}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Invoice ID</p>
                    <p className="font-mono text-white">{invoiceData.id}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Traveler Details</p>
                    <div className="flex flex-wrap gap-1">
                      {invoiceData.travelers.map(name => (
                        <span key={name} className="text-slate-300 after:content-[','] last:after:content-[''] mr-1">{name}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="space-y-4 text-right sm:text-left">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Generated date</p>
                    <p className="text-white">{invoiceData.date}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Payment Status</p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 capitalize">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                      {invoiceData.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Table */}
            <div className="mt-12 overflow-hidden rounded-3xl border border-white/10 bg-white/5">
              <table className="w-full text-left text-sm">
                <thead className="bg-white/5 text-xs uppercase tracking-widest text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">#</th>
                    <th className="px-6 py-4 font-semibold">Category</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                    <th className="px-6 py-4 font-semibold">Qty/Details</th>
                    <th className="px-6 py-4 font-semibold">Unit Cost</th>
                    <th className="px-6 py-4 font-semibold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {invoiceData.items.map((item, idx) => (
                    <tr key={item.id} className="text-slate-300 hover:bg-white/[0.02] transition">
                      <td className="px-6 py-4">{idx + 1}</td>
                      <td className="px-6 py-4">
                        <span className="rounded-lg bg-white/5 px-2 py-1 text-xs text-aqua-400 border border-white/10">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{item.description}</td>
                      <td className="px-6 py-4">{item.qty}</td>
                      <td className="px-6 py-4">${item.unitCost}</td>
                      <td className="px-6 py-4 text-right text-white font-bold">${item.amount}</td>
                    </tr>
                  ))}
                  {/* Decorative empty rows */}
                  {[...Array(3)].map((_, i) => (
                    <tr key={`empty-${i}`} className="opacity-20">
                      <td className="px-6 py-6" colSpan={6}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Totals Area */}
            <div className="mt-8 flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">${subtotal}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Tax (5%)</span>
                  <span className="text-white">${tax}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Discount</span>
                  <span className="text-rose-400">-${discount}</span>
                </div>
                <div className="h-px bg-white/10 pt-2" />
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold text-white uppercase tracking-wider">Grand Total</span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-aqua-400 to-sand-300 bg-clip-text text-transparent">
                    ${grandTotal}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Actions Bar */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              <Download className="h-4 w-4" /> Download Invoice
            </button>
            <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10">
              <FileText className="h-4 w-4" /> Export as PDF
            </button>
            <div className="flex-1" />
            <button className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 px-8 py-3.5 text-sm font-bold text-ink-950 shadow-glow transition hover:scale-[1.02] active:scale-[0.98]">
              <CheckCircle2 className="h-4 w-4" /> Mark as Paid
            </button>
          </div>
        </motion.div>

        {/* Sidebar Insights */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <section className="glass rounded-[2rem] border border-white/10 p-6 shadow-soft">
            <h3 className="text-sm uppercase tracking-[0.2em] text-aqua-200 mb-6 flex items-center gap-2">
              <Wallet className="h-4 w-4" /> Budget Insights
            </h3>
            
            <div className="flex flex-col items-center">
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#07111f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="mt-6 w-full space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-aqua-400" />
                    <span className="text-sm text-slate-400">Total Budget</span>
                  </div>
                  <span className="text-lg font-bold text-white">${invoiceData.budget.total}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-400" />
                    <span className="text-sm text-slate-400">Total Spent</span>
                  </div>
                  <span className="text-lg font-bold text-white">${invoiceData.budget.spent}</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20">
                  <div className="flex items-center gap-3">
                    <div className="h-3 w-3 rounded-full bg-rose-500" />
                    <span className="text-sm text-rose-300">Remaining</span>
                  </div>
                  <span className="text-lg font-bold text-rose-400">${invoiceData.budget.remaining}</span>
                </div>
              </div>

              <Link to={`/trips/${id}/budget`} className="mt-8 w-full rounded-2xl border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10">
                View Full Budget
              </Link>
            </div>
          </section>

          {/* Quick Stats / Info */}
          <section className="glass rounded-[2rem] border border-white/10 p-6 shadow-soft">
            <h3 className="text-sm uppercase tracking-[0.2em] text-aqua-200 mb-6 flex items-center gap-2">
              <Users className="h-4 w-4" /> Group Activity
            </h3>
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Recent Payment</p>
                <p className="text-sm text-white font-medium">Arjun added $12,000 for flights</p>
                <p className="text-[10px] text-slate-600 mt-1">2 hours ago</p>
              </div>
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Dispute</p>
                <p className="text-sm text-white font-medium">Jerry flagged hotel cost as high</p>
                <p className="text-[10px] text-slate-600 mt-1">5 hours ago</p>
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  )
}
