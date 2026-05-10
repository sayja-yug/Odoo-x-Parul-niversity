import { motion } from 'framer-motion'

export default function StatCard({ title, value, detail, accent = 'from-aqua-400 to-cyan-600' }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass rounded-3xl p-5 shadow-soft"
    >
      <div className={`mb-4 h-1.5 w-20 rounded-full bg-gradient-to-r ${accent}`} />
      <p className="text-sm text-slate-400">{title}</p>
      <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{value}</p>
      <p className="mt-2 text-sm text-slate-300">{detail}</p>
    </motion.div>
  )
}
