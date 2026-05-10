import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Mail, Globe2, Camera, Shield, Trash2, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [status, setStatus] = useState({ error: '', success: '' })

  useEffect(() => {
    api.profile.get()
      .then(data => {
        setUser(data)
        setLoading(false)
      })
      .catch(err => {
        console.error(err)
        setStatus({ error: 'Failed to load profile', success: '' })
        setLoading(false)
      })
  }, [])

  async function handleLogout() {
    setLoggingOut(true)
    setStatus({ error: '', success: '' })
    try {
      await api.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout failed:', error)
      setStatus({ error: error.message || 'Logout failed', success: '' })
      setLoggingOut(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    setStatus({ error: '', success: '' })
    try {
      const updatedUser = await api.profile.update(user)
      setUser(updatedUser)
      setStatus({ error: '', success: 'Profile updated successfully!' })
    } catch (error) {
      setStatus({ error: error.message || 'Failed to update profile', success: '' })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-aqua-400 border-t-transparent" />
      </div>
    )
  }

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'G'

  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-aqua-400 to-sand-300 text-2xl font-bold text-ink-950">
            {initial}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Profile settings</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">{user?.username || 'Guest'}</h1>
            <p className="mt-2 text-slate-300">{user?.bio || 'No bio yet.'}</p>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-2">
        <motion.form 
          initial={{ opacity: 0, y: 12 }} 
          animate={{ opacity: 1, y: 0 }} 
          onSubmit={handleSave}
          className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft"
        >
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Account</p>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Email</span>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input 
                  className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400" 
                  value={user?.email || ''} 
                  onChange={e => setUser({ ...user, email: e.target.value })}
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Bio</span>
              <textarea 
                className="w-full rounded-2xl border-white/10 bg-white/5 py-3 px-4 text-white focus:border-aqua-400 focus:ring-aqua-400" 
                rows="3"
                value={user?.bio || ''} 
                onChange={e => setUser({ ...user, bio: e.target.value })}
                placeholder="Tell us about yourself..."
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-slate-300">Language</span>
              <div className="relative">
                <Globe2 className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select 
                  className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-11 pr-4 text-white focus:border-aqua-400 focus:ring-aqua-400"
                  value={user?.language_preference || 'en'}
                  onChange={e => setUser({ ...user, language_preference: e.target.value })}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </select>
              </div>
            </label>
          </div>

          {status.error && (
            <div className="mt-4 rounded-2xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-100">
              {status.error}
            </div>
          )}
          {status.success && (
            <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-3 text-sm text-emerald-100">
              {status.success}
            </div>
          )}

          <button 
            type="submit"
            disabled={saving}
            className="mt-6 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950 disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save changes'}
          </button>
        </motion.form>

        <div className="space-y-4">
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-slate-300"><Camera className="h-4 w-4 text-aqua-200" /> Upload profile photo</div>
            <p className="mt-3 text-sm text-slate-400">Use drag-and-drop or image upload with validation and preview.</p>
          </div>
          <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-slate-300"><Shield className="h-4 w-4 text-emerald-300" /> Change password</div>
            <p className="mt-3 text-sm text-slate-400">Password reset flow can be wired into Django auth views.</p>
          </div>
          <div className="rounded-[2rem] border border-red-400/20 bg-red-500/10 p-6 shadow-soft">
            <div className="flex items-center gap-3 text-red-100"><Trash2 className="h-4 w-4" /> Delete account</div>
            <p className="mt-3 text-sm text-red-100/80">Confirmation modal and destructive action guard go here.</p>
          </div>
          <button onClick={handleLogout} disabled={loggingOut} className="w-full rounded-2xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-200 hover:bg-red-500/20 disabled:opacity-50 inline-flex items-center justify-center gap-2">
            <LogOut className="h-4 w-4" />
            {loggingOut ? 'Logging out...' : 'Logout'}
          </button>
        </div>
      </div>
    </div>
  )
}
