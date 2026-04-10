import { useMemo } from "react"
import {
  Card,
  CardContent,
} from "@/components/ui/card"

import {
  AreaChart,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  Area,
  CartesianGrid,
} from "recharts"

function ChartSection({ transactions = [] }) {
  const chartData = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    
    const monthlyTotals = {};

    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = months[d.getMonth()];
      monthlyTotals[monthName] = 0;
    }

    transactions.forEach((t) => {
      if (t.status === "success" || t.status === "settlement") {
        const date = new Date(t.created_at);
        const monthName = months[date.getMonth()];
        if (monthName in monthlyTotals) {
          monthlyTotals[monthName] += Number(t.amount);
        }
      }
    });

    return Object.keys(monthlyTotals).map((name) => ({
      name,
      value: monthlyTotals[name],
    }));
  }, [transactions]);

  const formatIDR = (val) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Card className="bg-white rounded-xl shadow-md transition duration-300 hover:shadow-md border-0 ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
      {/* HEADER */}
      <div className="flex items-center justify-between p-6 pb-0">
        <div>
          <h3 className="text-base font-bold text-gray-800 tracking-tight">
            Statistik Donasi
          </h3>
          <p className="text-sm text-gray-500">
            Tren penerimaan dana 6 bulan terakhir
          </p>
        </div>

        <div className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          Real-time Data
        </div>
      </div>

      {/* CHART */}
      <CardContent className="pt-6">
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="greenGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#A3C585" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#A3C585" stopOpacity={0} />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#f1f5f9"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                dy={10}
              />

              <Tooltip
                cursor={{ stroke: "#A3C585", strokeWidth: 1, strokeDasharray: "5 5" }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-white rounded-xl shadow-xl border border-gray-50 p-3 ring-1 ring-black/5">
                        <p className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1">
                          {payload[0].payload.name}
                        </p>
                        <p className="text-[#7FAE5A] font-bold text-sm">
                          {formatIDR(payload[0].value)}
                        </p>
                      </div>
                    )
                  }
                  return null
                }}
              />

              <Area
                type="monotone"
                dataKey="value"
                stroke="#A3C585"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#greenGradient)"
                isAnimationActive={true}
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

export default ChartSection;