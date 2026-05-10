import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  CalendarDays, Compass, LayoutDashboard, MapPinned,
  NotebookText, PlaneTakeoff, Settings2, ShieldCheck,
  Backpack, LogOut, ChevronRight, Map
} from 'lucide-react'
import { NavLink, useNavigate, useParams, useMatch } from 'react-router-dom'
import { api } from '../api/client.js'

/* ── Top-level nav items (no hardcoded trip IDs) ── */
const mainNav = [
  { to: '/',       label: 'Dashboard', icon: LayoutDashboard },
  { to: '/trips',  label: 'Trips',     icon: PlaneTakeoff },
  { to: '/profile',label: 'Profile',   icon: Settings2 },
  { to: '/admin',  label: 'Admin',     icon: ShieldCheck },
]

/* ── Trip sub-nav (appears when inside a trip page) ── */
const tripSubNav = [
  { key: 'itinerary', label: 'Itinerary', icon: MapPinned },
  { key: 'budget',    label: 'Budget',    icon: Compass },
  { key: 'packing',   label: 'Packing',   icon: Backpack },
  { key: 'notes',     label: 'Notes',     icon: NotebookText },
]

function SidebarContent({ onClose }) {
  const navigate = useNavigate()

  // Detect if we're inside a trip route (e.g. /trips/3/itinerary)
  const tripMatch  = useMatch('/trips/:tripId/*')
  const tripId     = tripMatch?.params?.tripId
  const isNewTrip  = useMatch('/trips/new')

  // Load trip name for the sub-nav header
  const [tripName, setTripName] = useState('')
  useEffect(() => {
    if (!tripId || isNewTrip) { setTripName(''); return }
    api.trips.get(tripId)
      .then(d => setTripName(d.title))
      .catch(() => setTripName('Trip'))
  }, [tripId, isNewTrip])

  const handleLogout = async () => {
    try {
      await api.logout()
      navigate('/login')
      onClose?.()
    } catch (err) {
      console.error('Logout failed:', err)
    }
  }

  return (
    <div className="flex h-full flex-col border-r border-white/10 bg-[rgba(7,17,31,0.92)] px-4 py-5 backdrop-blur-xl sm:px-5">

      {/* Logo */}
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-aqua-400 to-sand-300 text-ink-950 shadow-glow">
          <PlaneTakeoff className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-aqua-200">Traveloop</p>
          <p className="text-xs text-slate-400">Plan, map, and share trips</p>
        </div>
      </div>

      {/* Main nav */}
      <nav className="flex-1 space-y-1 overflow-y-auto min-h-0 custom-scrollbar">
        {mainNav.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-white/10 text-white shadow-soft'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <Icon className="h-4 w-4 text-aqua-300" />
              {item.label}
            </NavLink>
          )
        })}

        {/* ── Trip sub-nav: only shown when inside a trip route ── */}
        <AnimatePresence>
          {tripId && !isNewTrip && (
            <motion.div
              key="trip-subnav"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              {/* sub-nav header */}
              <div className="mt-4 mb-1 flex items-center gap-2 px-4">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-widest text-slate-500">
                  Current Trip
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* trip name chip */}
              <button
                onClick={() => { navigate(`/trips/${tripId}`); onClose?.() }}
                className="mb-1 flex w-full items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-medium text-aqua-200 transition hover:bg-white/5"
              >
                <Map className="h-4 w-4 shrink-0 text-aqua-300" />
                <span className="truncate">{tripName || 'Loading…'}</span>
                <ChevronRight className="ml-auto h-3.5 w-3.5 text-slate-500" />
              </button>

              {/* sub-nav links */}
              {tripSubNav.map(({ key, label, icon: Icon }) => (
                <NavLink
                  key={key}
                  to={`/trips/${tripId}/${key}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-2xl px-4 py-2.5 pl-8 text-sm font-medium transition ${
                      isActive
                        ? 'bg-white/10 text-white shadow-soft'
                        : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <Icon className="h-4 w-4 text-aqua-300/70" />
                  {label}
                </NavLink>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Bottom: upcoming trip hint + logout */}
      <div className="mt-auto space-y-3">
        {/* upcoming trip widget — shows the active trip dates if inside one */}
        {tripId && !isNewTrip && tripName && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
            <div className="mb-1 flex items-center gap-2 text-aqua-200">
              <CalendarDays className="h-4 w-4" />
              Active trip
            </div>
            <p className="font-medium text-white truncate">{tripName}</p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Manage itinerary, budget, packing &amp; notes below.
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-500/10"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  )
}

export default function Sidebar({ mobileOpen, onClose }) {
  return (
    <>
      <div className="hidden w-[290px] lg:block sticky top-0 h-screen overflow-y-auto">
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
