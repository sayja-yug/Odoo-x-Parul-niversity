export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-5">
      <div className="h-4 w-24 rounded-full bg-white/10" />
      <div className="mt-4 h-7 w-3/4 rounded-full bg-white/10" />
      <div className="mt-3 h-3 w-full rounded-full bg-white/10" />
      <div className="mt-2 h-3 w-5/6 rounded-full bg-white/10" />
      <div className="mt-6 h-28 rounded-2xl bg-white/10" />
    </div>
  )
}
