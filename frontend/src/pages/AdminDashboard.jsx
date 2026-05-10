import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Search, 
  ListFilter, 
  Filter, 
  SortAsc, 
  Users, 
  MapPinned, 
  Activity, 
  BarChart3, 
  LogOut,
  ChevronRight
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { 
  PieChart, Pie, Cell, 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend
} from 'recharts'
import { api } from '../api/client.js'

const pieData = [
  { name: 'Europe', value: 400 },
  { name: 'Asia', value: 300 },
  { name: 'Americas', value: 200 },
  { name: 'Others', value: 100 },
]

const lineData = [
  { name: 'Jan', trips: 40 },
  { name: 'Feb', trips: 30 },
  { name: 'Mar', trips: 20 },
  { name: 'Apr', trips: 27 },
  { name: 'May', trips: 18 },
  { name: 'Jun', trips: 23 },
  { name: 'Jul', trips: 34 },
]

const barData = [
  { name: 'User A', active: 4000 },
  { name: 'User B', active: 3000 },
  { name: 'User C', active: 2000 },
  { name: 'User D', active: 2780 },
  { name: 'User E', active: 1890 },
]

const COLORS = ['#2dd4bf', '#fbbf24', '#f87171', '#818cf8']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.profile.get()
      .then(user => {
        if (user.role !== 'Admin') {
          navigate('/')
        }
      })
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [navigate])

  async function handleLogout() {
    setLoggingOut(true)
    try {
      await api.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setLoggingOut(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-aqua-400 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-20">
      {/* Header Area with Title & Logout */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Traveloop Admin</h1>
        <button 
          onClick={handleLogout} 
          disabled={loggingOut}
          className="flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-200 transition hover:bg-red-500/20"
        >
          <LogOut className="h-4 w-4" />
          {loggingOut ? '...' : 'Logout'}
        </button>
      </div>

      {/* Controls Bar */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search bar ......"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border-white/10 bg-white/5 py-3.5 pl-12 pr-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <ListFilter className="h-4 w-4" />
            Group by
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white hover:bg-white/10">
            <SortAsc className="h-4 w-4" />
            Sort by...
          </button>
        </div>
      </section>

      {/* Sub-navigation Tabs */}
      <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:gap-4">
        {[
          { label: 'Manage Users', icon: Users },
          { label: 'Popular cities', icon: MapPinned },
          { label: 'Popular Activities', icon: Activity },
          { label: 'User Trends and Analytics', icon: BarChart3 },
        ].map((tab) => (
          <button
            key={tab.label}
            className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition hover:bg-white/10 sm:text-sm"
          >
            <tab.icon className="h-4 w-4 text-aqua-400" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Analytics Canvas */}
      <div className="rounded-[2.5rem] bg-[#f0f0f0] p-6 shadow-2xl sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Top Section: Pie Chart + List */}
          <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="h-64 w-64 shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-4">
              {pieData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-4">
                  <div className="h-8 w-8 shrink-0 rounded-full bg-slate-300" />
                  <div className="h-4 w-full max-w-[200px] rounded bg-slate-200" />
                </div>
              ))}
            </div>
          </div>

          {/* Middle Section: Line Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
                <XAxis dataKey="name" stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="trips" 
                  stroke="#ef4444" 
                  strokeWidth={4} 
                  dot={{ r: 8, fill: '#ef4444' }} 
                  activeDot={{ r: 10 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Section: Bar Chart + Text */}
          <div className="h-64 w-full lg:col-span-1">
             <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <Bar dataKey="active" fill="#fb923c" radius={[10, 10, 0, 0]} />
                  <Tooltip />
                </BarChart>
             </ResponsiveContainer>
          </div>

          <div className="space-y-4 lg:col-span-1">
            <div className="h-10 w-full rounded bg-slate-400/50" />
            <div className="space-y-2">
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-3/4 rounded bg-slate-200" />
              <div className="h-4 w-full rounded bg-slate-200" />
              <div className="h-4 w-1/2 rounded bg-slate-200" />
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
