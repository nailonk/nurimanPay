import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  AreaChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts"

function ChartSection() {
  const data = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 700 },
    { name: "Mar", value: 300 },
    { name: "Apr", value: 600 },
    { name: "Mei", value: 200 },
    { name: "Jun", value: 800 },
  ]

  return (
    <Card className="bg-white rounded-xl shadow-sm transition duration-300 hover:shadow-md">

      {/* HEADER */}
      <div className="flex items-center justify-between p-4 pb-0">

        <div>
          <h3 className="text-base font-semibold text-gray-800">
            Statistik Donasi
          </h3>
          <p className="text-sm text-gray-500">
            Penerimaan dana 6 bulan terakhir
          </p>
        </div>

        <select className="
          text-sm bg-gray-100 px-3 py-1.5 rounded-lg
          outline-none focus:ring-2 focus:ring-[#A3C585]
          transition
        ">
          <option>2026</option>
          <option>2025</option>
        </select>

      </div>

      {/* CHART */}
      <CardContent className="pt-4">
        <div className="h-[260px] w-full">

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>

              {/* GRADIENT */}
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A3C585" stopOpacity={0.6} />
                  <stop offset="60%" stopColor="#A3C585" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="#A3C585" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* GRID (lebih soft) */}
              <CartesianGrid
                strokeDasharray="4 4"
                vertical={false}
                stroke="#f1f5f9"
              />

              {/* X AXIS */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />

              {/* TOOLTIP */}
              <Tooltip
                cursor={{ stroke: "#e5e7eb", strokeWidth: 1 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white rounded-lg shadow-sm px-3 py-2 text-xs">
                        <p className="text-gray-500">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-[#A3C585] font-semibold">
                          Rp {payload[0].value}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />

              {/* AREA */}
              <Area
                  type="monotone"
                  dataKey="value"
                  stroke="none"
                  fill="url(#greenGradient)"
                  fillOpacity={1}
                  isAnimationActive={true}
                  animationDuration={800}
                />

              {/* LINE */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
                isAnimationActive={true}
                animationDuration={800}
              />

            </AreaChart>
          </ResponsiveContainer>

        </div>
      </CardContent>

    </Card>
  )
}

export default ChartSection