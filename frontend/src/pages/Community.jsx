import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Filter, ArrowUpDown, MessageSquare,
  Heart, Share2, MoreHorizontal, Sparkles,
  Loader2, User as UserIcon, Plus
} from 'lucide-react'
import { api } from '../api/client.js'

/* ─────────────────────────────────────────────
   Post Card Component (Screen 10)
───────────────────────────────────────────── */
function PostCard({ post, onLike }) {
  const [liked, setLiked] = useState(false)

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex gap-4 p-1"
    >
      {/* User Avatar Circle (Screen 10) */}
      <div className="h-12 w-12 shrink-0 rounded-full bg-gradient-to-br from-aqua-400 to-sand-400 p-[2px]">
        <div className="h-full w-full rounded-full bg-ink-950 flex items-center justify-center overflow-hidden">
          {post.user.profile_picture ? (
            <img src={post.user.profile_picture} alt={post.user.username} className="h-full w-full object-cover" />
          ) : (
            <UserIcon className="h-6 w-6 text-slate-500" />
          )}
        </div>
      </div>

      {/* Content Box (Screen 10) */}
      <div className="flex-1 glass rounded-[1.5rem] border border-white/10 p-6 shadow-soft transition hover:bg-white/5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-white">@{post.user.username}</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              {new Date(post.created_at).toLocaleDateString()} • {post.location_name || 'Global'}
            </p>
          </div>
          <button className="text-slate-500 hover:text-white transition">
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-slate-300">
          {post.content}
        </p>

        {/* Interaction Footer */}
        <div className="mt-6 flex items-center gap-6 pt-4 border-t border-white/5">
          <button 
            onClick={() => { setLiked(!liked); onLike(post.id) }}
            className={`flex items-center gap-2 text-xs font-medium transition ${liked ? 'text-pink-400' : 'text-slate-500 hover:text-white'}`}
          >
            <Heart className={`h-4 w-4 ${liked ? 'fill-current' : ''}`} />
            {post.likes_count + (liked ? 1 : 0)} Likes
          </button>
          <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition">
            <MessageSquare className="h-4 w-4" />
            Comment
          </button>
          <button className="flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition">
            <Share2 className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>
    </motion.div>
  )
}

/* ─────────────────────────────────────────────
   New Post Modal
───────────────────────────────────────────── */
function NewPostModal({ onClose, onAdded }) {
  const [content, setContent] = useState('')
  const [loc, setLoc] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!content.trim()) return
    setLoading(true)
    try {
      await api.community.create({ content, location_name: loc })
      onAdded()
      onClose()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink-950/70 p-4 backdrop-blur-sm">
      <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="w-full max-w-lg rounded-[2rem] border border-white/10 bg-ink-900 p-8 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Share your experience</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea 
            placeholder="What's on your mind? Share a tip or a story..." 
            value={content} onChange={e => setContent(e.target.value)}
            rows={5}
            className="w-full rounded-2xl border-white/10 bg-white/5 p-4 text-sm text-white focus:border-aqua-400 resize-none"
            required
          />
          <input 
            type="text" placeholder="Location (optional)" 
            value={loc} onChange={e => setLoc(e.target.value)}
            className="w-full rounded-xl border-white/10 bg-white/5 p-3 text-sm text-white"
          />
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-400">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-xl bg-aqua-400 px-8 py-2 text-sm font-bold text-ink-950 disabled:opacity-50">
              {loading ? 'Posting...' : 'Share Post'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   Community Feed Screen
───────────────────────────────────────────── */
export default function Community() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => { loadPosts() }, [])

  async function loadPosts() {
    setLoading(true)
    try {
      const data = await api.community.list()
      setPosts(data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header Row (Screen 10) */}
      <motion.section 
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        className="glass relative z-20 rounded-[2rem] p-6 shadow-soft"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-aqua-300" />
              <p className="text-xs uppercase tracking-[0.2em] text-aqua-200">Traveloop Social</p>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-white">Community tab</h1>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 rounded-xl bg-aqua-400 px-6 py-2.5 text-sm font-bold text-ink-950 shadow-glow transition hover:bg-aqua-300"
          >
            <Plus className="h-4 w-4" /> Share Experience
          </button>
        </div>

        {/* Search/Filter Bar (Screen 10) */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
             <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
             <input type="text" placeholder="Search experiences, tips, or users..." className="w-full rounded-2xl border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-aqua-400" />
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
              Group by
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
              <Filter className="h-4 w-4" /> Filter
            </button>
            <button className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-white/10">
              <ArrowUpDown className="h-4 w-4" /> Sort by...
            </button>
          </div>
        </div>
      </motion.section>

      {/* Feed (Screen 10) */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-aqua-400" />
          </div>
        ) : posts.length > 0 ? (
          posts.map(post => (
            <PostCard key={post.id} post={post} onLike={() => {}} />
          ))
        ) : (
          <div className="text-center py-20 glass rounded-[2rem]">
            <MessageSquare className="h-12 w-12 text-slate-700 mx-auto mb-4" />
            <p className="text-slate-400">No community posts yet. Be the first to share!</p>
          </div>
        )}
      </div>

      {showModal && (
        <NewPostModal onClose={() => setShowModal(false)} onAdded={loadPosts} />
      )}
    </div>
  )
}
