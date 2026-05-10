import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, Globe2, Camera, Edit3, Check, X, Loader2,
  AlertCircle, CheckCircle2, Lock, Eye, EyeOff, Shield,
  CalendarDays, MapPin, Wallet, ArrowUpRight, PlaneTakeoff, LogOut
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

/* ─── helpers ─── */
function classify(trip) {
  const today = new Date(); today.setHours(0,0,0,0)
  const s = new Date(trip.start_date), e = new Date(trip.end_date)
  if (isNaN(s.getTime()) || isNaN(e.getTime())) return 'upcoming'
  if (e < today)   return 'completed'
  if (s > today)   return 'upcoming'
  return 'ongoing'
}
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
}
const GRADIENTS = [
  'from-violet-600 to-indigo-500',
  'from-emerald-500 to-teal-400',
  'from-orange-500 to-rose-500',
  'from-sky-500 to-cyan-400',
  'from-pink-500 to-purple-500',
  'from-amber-500 to-orange-400',
]

/* ─── Trip card ─── */
function TripCard({ trip }) {
  const gradient   = GRADIENTS[(trip.id ?? 0) % GRADIENTS.length]
  const stopsCount = trip.stops_count ?? (trip.stops?.length ?? 0)
  return (
    <motion.div whileHover={{ y: -5 }}
      className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-soft"
    >
      <div className={`relative h-36 bg-gradient-to-br ${gradient}`}>
        {trip.cover_photo && <img src={trip.cover_photo} alt={trip.title} className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <p className="truncate text-sm font-semibold text-white">{trip.title}</p>
          <Link to={`/trips/${trip.id}`}
            className="flex items-center gap-1 rounded-xl border border-white/20 bg-white/15 px-2.5 py-1.5 text-xs font-medium text-white backdrop-blur transition hover:bg-white/25">
            View <ArrowUpRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
      <div className="space-y-1.5 p-4 text-xs text-slate-400">
        <span className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5 text-aqua-300" />{fmtDate(trip.start_date)} – {fmtDate(trip.end_date)}</span>
        <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5 text-sand-300" />{stopsCount} {stopsCount === 1 ? 'stop' : 'stops'}</span>
        <span className="flex items-center gap-1.5"><Wallet className="h-3.5 w-3.5 text-emerald-400" />${trip.total_budget ?? 0} budget</span>
      </div>
    </motion.div>
  )
}

/* ─── Trips group ─── */
function TripsGroup({ label, trips, loading }) {
  return (
    <section className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
      <div className="mb-5 flex items-center gap-3">
        <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">{label}</p>
        {!loading && <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs text-slate-400">{trips.length}</span>}
      </div>
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1,2,3].map(i => <div key={i} className="h-44 animate-pulse rounded-3xl bg-white/5" />)}
        </div>
      ) : trips.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 p-8 text-center">
          <PlaneTakeoff className="mx-auto mb-3 h-8 w-8 text-slate-600" />
          <p className="text-sm text-slate-400">No {label.toLowerCase()} yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {trips.map(t => <TripCard key={t.id} trip={t} />)}
        </div>
      )}
    </section>
  )
}

/* ─── Field row (view / edit) ─── */
function Field({ label, value, editMode, children }) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
      {editMode ? children : <p className="text-sm text-white">{value || <span className="italic text-slate-500">—</span>}</p>}
    </div>
  )
}

/* ════════════════════════════════════════
   Main Profile Page
════════════════════════════════════════ */
export default function Profile() {
  const navigate = useNavigate()

  const [user,        setUser]        = useState(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [editMode,    setEditMode]    = useState(false)
  const [form,        setForm]        = useState({})
  const [saving,      setSaving]      = useState(false)
  const [msg,         setMsg]         = useState({ ok: '', err: '' })

  const [showPwForm,  setShowPwForm]  = useState(false)
  const [pw,          setPw]          = useState({ next: '', confirm: '' })
  const [showPw,      setShowPw]      = useState(false)
  const [savingPw,    setSavingPw]    = useState(false)
  const [pwMsg,       setPwMsg]       = useState({ ok: '', err: '' })

  const [trips,        setTrips]       = useState([])
  const [loadingTrips, setLoadingTrips]= useState(true)
  const [loggingOut,   setLoggingOut]  = useState(false)

  const fileRef = useRef(null)

  useEffect(() => {
    api.profile.get()
      .then(d => { setUser(d); setForm(d) })
      .catch(() => setMsg({ ok: '', err: 'Not logged in — profile data unavailable.' }))
      .finally(() => setLoadingUser(false))

    api.trips.list()
      .then(setTrips).catch(() => {}).finally(() => setLoadingTrips(false))
  }, [])

  const preplanned = trips.filter(t => ['upcoming','ongoing'].includes(classify(t)))
  const previous   = trips.filter(t => classify(t) === 'completed')

  async function handleSave(e) {
    e.preventDefault(); setSaving(true); setMsg({ ok: '', err: '' })
    try {
      const updated = await api.profile.update({
        email: form.email, first_name: form.first_name,
        last_name: form.last_name, bio: form.bio,
        language_preference: form.language_preference,
      })
      setUser(updated); setForm(updated); setEditMode(false)
      setMsg({ ok: 'Profile saved!', err: '' })
      setTimeout(() => setMsg({ ok: '', err: '' }), 3000)
    } catch (e) { setMsg({ ok: '', err: e.message }) }
    finally { setSaving(false) }
  }

  async function handleSavePw(e) {
    e.preventDefault()
    if (pw.next !== pw.confirm) { setPwMsg({ ok: '', err: 'Passwords do not match.' }); return }
    if (pw.next.length < 8)     { setPwMsg({ ok: '', err: 'Min 8 characters.' }); return }
    setSavingPw(true); setPwMsg({ ok: '', err: '' })
    try {
      await api.profile.update({ password: pw.next })
      setPw({ next: '', confirm: '' }); setShowPwForm(false)
      setPwMsg({ ok: 'Password changed!', err: '' })
      setTimeout(() => setPwMsg({ ok: '', err: '' }), 3000)
    } catch (e) { setPwMsg({ ok: '', err: e.message }) }
    finally { setSavingPw(false) }
  }

  async function handleLogout() {
    setLoggingOut(true)
    try { await api.logout(); navigate('/login') }
    catch { setLoggingOut(false) }
  }

  if (loadingUser) return (
    <div className="flex h-64 items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-aqua-400" />
    </div>
  )

  const initial = user?.first_name?.charAt(0)?.toUpperCase()
               || user?.username?.charAt(0)?.toUpperCase() || 'G'

  return (
    <div className="space-y-6">

      {/* ══════════════════════════════════
          Hero card — Avatar + Details
      ══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass rounded-[2rem] p-6 shadow-soft sm:p-8"
      >
        {/* page label */}
        <p className="mb-5 text-sm uppercase tracking-[0.2em] text-aqua-200">User Profile</p>

        <div className="flex flex-wrap items-start gap-6">

          {/* ── Avatar ── */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-aqua-400 to-sand-300 text-3xl font-bold text-ink-950 shadow-glow overflow-hidden">
                {user?.profile_picture
                  ? <img src={user.profile_picture} alt="" className="h-full w-full object-cover" />
                  : initial
                }
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-ink-900 text-slate-300 shadow transition hover:text-aqua-300"
                title="Change photo">
                <Camera className="h-3.5 w-3.5" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" />
            </div>
            <p className="text-xs text-slate-500">Profile photo</p>
          </div>

          {/* ── Details ── */}
          <div className="flex-1 min-w-0">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-semibold text-white">
                  {[user?.first_name, user?.last_name].filter(Boolean).join(' ') || user?.username || 'Guest'}
                </h1>
                <p className="mt-0.5 text-sm text-slate-400">@{user?.username || '—'}</p>
              </div>
              <div className="flex gap-2">
                {!editMode ? (
                  <button onClick={() => setEditMode(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
                    <Edit3 className="h-4 w-4" /> Edit Profile
                  </button>
                ) : (
                  <>
                    <button form="profile-form" type="submit" disabled={saving}
                      className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90 disabled:opacity-50">
                      {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />} Save
                    </button>
                    <button onClick={() => { setEditMode(false); setForm(user) }}
                      className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10">
                      <X className="h-4 w-4" /> Cancel
                    </button>
                  </>
                )}
                <button onClick={handleLogout} disabled={loggingOut}
                  className="inline-flex items-center gap-2 rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-500/20 disabled:opacity-50">
                  {loggingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* feedback */}
            <AnimatePresence>
              {(msg.ok || msg.err) && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className={`mb-4 flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm ${
                    msg.ok ? 'border-emerald-400/20 bg-emerald-500/10 text-emerald-300'
                           : 'border-red-400/20 bg-red-500/10 text-red-300'
                  }`}>
                  {msg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                  {msg.ok || msg.err}
                </motion.p>
              )}
            </AnimatePresence>

            {/* form */}
            <form id="profile-form" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="First Name" value={user?.first_name} editMode={editMode}>
                  <input value={form.first_name || ''} onChange={e => setForm(f => ({...f, first_name: e.target.value}))}
                    className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400" />
                </Field>
                <Field label="Last Name" value={user?.last_name} editMode={editMode}>
                  <input value={form.last_name || ''} onChange={e => setForm(f => ({...f, last_name: e.target.value}))}
                    className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400" />
                </Field>
                <Field label="Email" value={user?.email} editMode={editMode}>
                  <input type="email" value={form.email || ''} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                    className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400" />
                </Field>
                <Field label="Language" value={user?.language_preference || 'English'} editMode={editMode}>
                  <select value={form.language_preference || 'en'} onChange={e => setForm(f => ({...f, language_preference: e.target.value}))}
                    className="w-full rounded-2xl border-white/10 bg-ink-900 py-2.5 px-4 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400">
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="hi">Hindi</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Bio" value={user?.bio || 'No bio yet.'} editMode={editMode}>
                    <textarea value={form.bio || ''} onChange={e => setForm(f => ({...f, bio: e.target.value}))}
                      rows={2} placeholder="Tell us about yourself…"
                      className="w-full resize-none rounded-2xl border-white/10 bg-white/5 py-2.5 px-4 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400 placeholder:text-slate-500" />
                  </Field>
                </div>
              </div>
            </form>
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════
          Security / Password
      ══════════════════════════════════ */}
      <motion.section
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Security</p>
            <p className="mt-1 text-sm text-slate-400">Manage your password and account security.</p>
          </div>
          <button onClick={() => setShowPwForm(p => !p)}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-white/10">
            <Lock className="h-4 w-4 text-aqua-300" />
            {showPwForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        <AnimatePresence>
          {showPwForm && (
            <motion.form key="pw" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }} onSubmit={handleSavePw}
              className="mt-5 overflow-hidden border-t border-white/10 pt-5">
              <div className="grid gap-4 sm:grid-cols-2">
                {[['next','New password'],['confirm','Confirm password']].map(([field, label]) => (
                  <div key={field} className="relative">
                    <p className="mb-1.5 text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                    <input type={showPw ? 'text' : 'password'} value={pw[field]}
                      onChange={e => setPw(p => ({...p, [field]: e.target.value}))}
                      className="w-full rounded-2xl border-white/10 bg-white/5 py-2.5 pl-4 pr-10 text-sm text-white focus:border-aqua-400 focus:ring-aqua-400" />
                    <button type="button" onClick={() => setShowPw(p => !p)}
                      className="absolute bottom-2.5 right-3 text-slate-500 hover:text-white">
                      {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                ))}
              </div>

              <AnimatePresence>
                {(pwMsg.ok || pwMsg.err) && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className={`mt-3 flex items-center gap-2 text-sm ${pwMsg.ok ? 'text-emerald-400' : 'text-red-400'}`}>
                    {pwMsg.ok ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
                    {pwMsg.ok || pwMsg.err}
                  </motion.p>
                )}
              </AnimatePresence>

              <button type="submit" disabled={savingPw}
                className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-5 py-2.5 text-sm font-semibold text-ink-950 shadow-glow transition hover:opacity-90 disabled:opacity-50">
                {savingPw ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                Update Password
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.section>

      {/* ══════════════════════════════════
          Pre-planned Trips
      ══════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <TripsGroup label="Pre-planned Trips" trips={preplanned} loading={loadingTrips} />
      </motion.div>

      {/* ══════════════════════════════════
          Previous Trips
      ══════════════════════════════════ */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <TripsGroup label="Previous Trips" trips={previous} loading={loadingTrips} />
      </motion.div>

    </div>
  )
}
