import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"

import {
  LineChart,
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
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">

      {/* HEADER */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-2">

        <div>
          <CardTitle className="text-base sm:text-lg">
            Statistik Donasi
          </CardTitle>
          <CardDescription>
            Penerimaan dana 6 bulan terakhir
          </CardDescription>
        </div>

        {/* FILTER */}
        <select className="
          text-sm bg-gray-100 px-3 py-1.5 rounded-lg
          outline-none focus:ring-2 focus:ring-green-300
        ">
          <option>2026</option>
          <option>2025</option>
        </select>

      </CardHeader>

      {/* CONTENT */}
      <CardContent>
        <div className="h-[250px] sm:h-[300px] w-full">

          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>

              {/* GRADIENT */}
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
              </defs>

              {/* GRID */}
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#e5e7eb"
              />

              {/* X AXIS */}
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
              />

              {/* TOOLTIP CUSTOM */}
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white border rounded-lg shadow-sm px-3 py-2 text-xs">
                        <p className="font-medium">{payload[0].payload.name}</p>
                        <p className="text-green-600 font-semibold">
                          {payload[0].value}
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
                fill="url(#colorValue)"
              />

              {/* LINE */}
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6 }}
              />

            </LineChart>
          </ResponsiveContainer>

        </div>
      </CardContent>

    </Card>
  )
}

export default ChartSection