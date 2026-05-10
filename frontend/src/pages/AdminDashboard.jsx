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

const COLORS = ['#2dd4bf', '#fbbf24', '#f87171', '#818cf8', '#fb923c']

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [loggingOut, setLoggingOut] = useState(false)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function init() {
      try {
        const user = await api.profile.get()
        if (user.role !== 'Admin') {
          navigate('/')
          return
        }
        
        // --- HARDCODED DEMO DATA FOR VIDEO ---
        const demoStats = {
          total_users: 1248,
          total_trips: 3842,
          total_stops: 12503,
          total_activities: 45920,
          trip_trends: [
            { month: '2024-01-01', count: 450 },
            { month: '2024-02-01', count: 620 },
            { month: '2024-03-01', count: 890 },
            { month: '2024-04-01', count: 1100 },
            { month: '2024-05-01', count: 1540 },
            { month: '2024-06-01', count: 1890 },
          ],
          user_growth: [
            { month: '2024-01-01', count: 120 },
            { month: '2024-02-01', count: 180 },
            { month: '2024-03-01', count: 310 },
            { month: '2024-04-01', count: 450 },
            { month: '2024-05-01', count: 580 },
            { month: '2024-06-01', count: 720 },
          ],
          region_distribution: [
            { country: 'France', count: 1450 },
            { country: 'Japan', count: 1200 },
            { country: 'USA', count: 850 },
            { country: 'Italy', count: 720 },
            { country: 'Spain', count: 640 },
          ],
          top_cities: [
            { city_name: 'Paris', total: 842 },
            { city_name: 'Tokyo', total: 756 },
            { city_name: 'New York', total: 612 },
            { city_name: 'London', total: 543 },
            { city_name: 'Rome', total: 498 },
          ]
        }
        setStats(demoStats)
        // -------------------------------------
        
      } catch (err) {
        console.error(err)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    init()
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

  if (loading || !stats) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink-950">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-aqua-400 border-t-transparent"></div>
      </div>
    )
  }

  // Format chart data
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
  
  const tripTrendsData = stats.trip_trends.map(item => ({
    name: monthNames[new Date(item.month).getMonth()],
    trips: item.count
  }))

  const userGrowthData = stats.user_growth.map(item => ({
    name: monthNames[new Date(item.month).getMonth()],
    users: item.count
  }))

  const regionPieData = stats.region_distribution.map(item => ({
    name: item.country,
    value: item.count
  }))

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

      {/* Stats Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Users', value: stats.total_users, icon: Users, color: 'text-aqua-400' },
          { label: 'Total Trips', value: stats.total_trips, icon: MapPinned, color: 'text-sand-300' },
          { label: 'Total Stops', value: stats.total_stops, icon: MapPinned, color: 'text-emerald-400' },
          { label: 'Total Activities', value: stats.total_activities, icon: Activity, color: 'text-purple-400' },
        ].map((s) => (
          <div key={s.label} className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-widest text-slate-400">{s.label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{s.value}</p>
              </div>
              <div className={`rounded-xl bg-white/5 p-3 ${s.color}`}>
                <s.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
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
      <div className="rounded-[2.5rem] bg-[#f8fafc] p-6 shadow-2xl sm:p-10">
        <div className="grid gap-10 lg:grid-cols-2">
          
          {/* Top Section: Regional Pie Chart */}
          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Regional Distribution</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">By Country</p>
            </div>
            <div className="flex flex-col gap-8 sm:flex-row sm:items-center">
              <div className="h-56 w-56 shrink-0 mx-auto sm:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={regionPieData.length > 0 ? regionPieData : [{ name: 'No Data', value: 1 }]}
                      innerRadius={65}
                      outerRadius={95}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {regionPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                      {regionPieData.length === 0 && <Cell fill="#e2e8f0" />}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-3">
                {regionPieData.length > 0 ? regionPieData.map((item, idx) => (
                  <div key={item.name} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                      <span className="text-slate-600 font-medium">{item.name}</span>
                    </div>
                    <span className="text-slate-400">{item.value} stops</span>
                  </div>
                )) : <p className="text-sm text-slate-400 italic text-center">No stop data available yet.</p>}
              </div>
            </div>
          </div>

          {/* Middle Section: Trip Trends Line Chart */}
          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Trip Trends</h3>
              <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Last 6 Months</p>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={tripTrendsData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trips" 
                    stroke="#ef4444" 
                    strokeWidth={4} 
                    dot={{ r: 6, fill: '#ef4444', strokeWidth: 3, stroke: '#fff' }} 
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bottom Section: User Growth Bar Chart */}
          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
             <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-slate-800">User Growth</h3>
                <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">New Registrations</p>
             </div>
             <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                      <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                      <Bar dataKey="users" fill="#fb923c" radius={[6, 6, 0, 0]} barSize={30} />
                      <Tooltip 
                        cursor={{fill: '#f8fafc'}}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                      />
                    </BarChart>
                </ResponsiveContainer>
             </div>
          </div>

          {/* Top Cities List */}
          <div className="flex flex-col gap-6 rounded-3xl bg-white p-6 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-800">Popular Destinations</h3>
              <button className="text-xs font-bold text-aqua-600 hover:text-aqua-700">See all</button>
            </div>
            <div className="space-y-4">
              {stats.top_cities.length > 0 ? stats.top_cities.map((city, idx) => (
                <div key={city.city_name} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition">
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-600 font-bold text-sm">
                      {idx + 1}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700">{city.city_name}</p>
                      <p className="text-xs text-slate-400">{city.total} trips planned here</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-slate-300" />
                </div>
              )) : <p className="text-sm text-slate-400 italic py-10 text-center">No city data available yet.</p>}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
