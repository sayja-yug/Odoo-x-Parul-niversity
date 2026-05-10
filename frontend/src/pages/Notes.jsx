import { motion } from 'framer-motion'
import { NotebookText } from 'lucide-react'

const notes = [
  { title: 'Lisbon coffee alley', time: '2h ago', body: 'Book the tram-adjacent cafe before sunset for the best photos.' },
  { title: 'Barcelona food plan', time: 'Yesterday', body: 'Reserve tapas tasting on day 2 and keep the evening flexible.' },
  { title: 'Nice waterfront walk', time: '3 days ago', body: 'Move the sunset stroll earlier if weather turns windy.' },
]

export default function Notes() {
  return (
    <div className="space-y-6">
      <section className="glass rounded-[2rem] p-6 shadow-soft sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-aqua-200"><NotebookText className="h-5 w-5" /></div>
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Trip notes</p>
            <h1 className="mt-1 text-3xl font-semibold text-white">Quick journal entries and stop-specific reminders</h1>
          </div>
        </div>
      </section>

      <div className="grid gap-4 lg:grid-cols-[0.8fr,1.2fr]">
        <div className="rounded-[2rem] border border-white/10 bg-white/5 p-5 shadow-soft">
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Editor</p>
          <textarea className="mt-4 min-h-[320px] w-full rounded-3xl border-white/10 bg-black/20 p-4 text-white placeholder:text-slate-500 focus:border-aqua-400 focus:ring-aqua-400" placeholder="Write a trip note..."></textarea>
          <button className="mt-4 rounded-2xl bg-gradient-to-r from-aqua-400 to-sand-300 px-4 py-3 text-sm font-semibold text-ink-950">Save note</button>
        </div>
        <div className="space-y-4">
          {notes.map((note) => (
            <motion.article key={note.title} whileHover={{ y: -3 }} className="rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-white">{note.title}</h3>
                <span className="text-xs text-slate-400">{note.time}</span>
              </div>
              <p className="mt-3 text-sm leading-6 text-slate-300">{note.body}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </div>
  )
}
