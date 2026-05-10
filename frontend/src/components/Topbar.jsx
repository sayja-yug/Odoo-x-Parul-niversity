import { Menu, Search, Bell } from 'lucide-react'

export default function Topbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-[rgba(7,17,31,0.78)] px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white transition hover:bg-white/10 lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="relative hidden flex-1 lg:block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="search"
            placeholder="Search trips, cities, activities"
            className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400"
          />
        </div>
        <button className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10" aria-label="Notifications">
          <Bell className="h-5 w-5" />
        </button>
        <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-aqua-400 to-sand-300 text-sm font-bold text-ink-950">A</div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-white">Aanya Patel</p>
            <p className="text-xs text-slate-400">Product Explorer</p>
          </div>
        </div>
      </div>
    </header>
  )
}
