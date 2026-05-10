import { AnimatePresence, motion } from 'framer-motion'
import { CalendarDays, Compass, LayoutDashboard, MapPinned, NotebookText, PlaneTakeoff, Settings2, ShieldCheck, Backpack, LogOut } from 'lucide-react'
import { NavLink, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips', label: 'Trips', icon: PlaneTakeoff },
  { to: '/trips/1/itinerary', label: 'Itinerary', icon: MapPinned },
  { to: '/trips/1/budget', label: 'Budget', icon: Compass },
  { to: '/trips/1/packing', label: 'Packing', icon: Backpack },
  { to: '/trips/1/notes', label: 'Notes', icon: NotebookText },
  { to: '/profile', label: 'Profile', icon: Settings2 },
  { to: '/admin', label: 'Admin', icon: ShieldCheck },
]

function SidebarContent({ onClose }) {
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await api.logout()
      navigate('/login')
      onClose?.()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-[rgba(7,17,31,0.92)] px-4 py-5 backdrop-blur-xl sm:px-5">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-sand-300 text-ink-950 shadow-glow">
          <PlaneTakeoff className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-aqua-200">Traveloop</p>
          <p className="text-xs text-slate-400">Plan, map, and share trips</p>
        </div>
      </div>
      <nav className="flex-1 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-white/10 text-white shadow-soft' : 'text-slate-300 hover:bg-white/5 hover:text-white'}`
              }
            >
              <Icon className="h-4 w-4 text-aqua-300" />
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      
      <div className="mt-auto space-y-4">
        <button 
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
          <div className="mb-2 flex items-center gap-2 text-aqua-200">
            <CalendarDays className="h-4 w-4" />
            Upcoming trip
          </div>
          <p className="font-medium text-white">Lisbon route preview</p>
          <p className="mt-1 text-xs leading-5 text-slate-400">Drag cities, layer stops, and track budget progress in one dashboard.</p>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div className="hidden w-[290px] lg:block">
        <SidebarContent onClose={onClose} />
      </div>
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            className="fixed inset-0 z-50 flex lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button className="absolute inset-0 bg-black/60" onClick={onClose} aria-label="Close navigation" />
            <motion.div
              className="relative z-10 h-full w-[290px] max-w-[85vw]"
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: 'spring', stiffness: 280, damping: 30 }}
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
