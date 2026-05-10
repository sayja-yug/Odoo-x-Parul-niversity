import { motion } from 'framer-motion'

export default function RegionCard({ name, image, onClick }) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="group relative aspect-square overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 shadow-soft"
    >
      <img
        src={image}
        alt={name}
        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/80 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
      <div className="absolute bottom-4 left-0 right-0 text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-white">{name}</p>
      </div>
    </motion.button>
  )
}
