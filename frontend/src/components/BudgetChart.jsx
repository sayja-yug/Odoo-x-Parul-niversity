import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'

const colors = ['#22d3ee', '#fcd34d', '#34d399', '#60a5fa', '#f97316']

export default function BudgetChart({ data }) {
  return (
    <div className="glass rounded-3xl p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-aqua-200">Budget</p>
          <h3 className="mt-1 text-lg font-semibold text-white">Trip cost breakdown</h3>
        </div>
        <p className="text-sm text-slate-400">Updated live</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={110} paddingAngle={4}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0b1730',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '16px',
                color: '#fff',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {data.map((entry, index) => (
          <div key={entry.name} className="rounded-2xl border border-white/10 bg-white/5 p-3">
            <div className="mb-2 h-2 w-8 rounded-full" style={{ background: colors[index % colors.length] }} />
            <p className="text-sm text-slate-300">{entry.name}</p>
            <p className="text-base font-semibold text-white">${entry.value.toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
