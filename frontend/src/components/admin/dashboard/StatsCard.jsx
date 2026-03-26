import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Wallet, HandCoins, Receipt, TrendingUp } from "lucide-react"

function StatsCard() {
  const data = [
    {
      title: "Total Program",
      value: "12",
      icon: Megaphone,
      bg: "bg-green-100",
      iconColor: "text-green-600",
      trend: "+2 bulan ini",
    },
    {
      title: "Total Donasi Masuk",
      value: "Rp 150.250k",
      icon: Wallet,
      bg: "bg-yellow-100",
      iconColor: "text-yellow-600",
      trend: "+12%",
    },
    {
      title: "Dana Disalurkan",
      value: "Rp 85.000k",
      icon: HandCoins,
      bg: "bg-blue-100",
      iconColor: "text-blue-600",
      trend: "+8%",
    },
    {
      title: "Jumlah Transaksi",
      value: "1,240",
      icon: Receipt,
      bg: "bg-gray-100",
      iconColor: "text-gray-600",
      trend: "+5%",
    },
  ]

  return (
    <>
      {data.map((item, i) => {
        const Icon = item.icon

        return (
          <Card
            key={i}
            className="
              group rounded-2xl border border-gray-200 
              shadow-sm hover:shadow-md 
              transition-all duration-300
              hover:-translate-y-1
            "
          >
            <CardContent className="p-4 sm:p-5 flex items-center justify-between">

              {/* LEFT */}
              <div className="space-y-2">

                <p className="text-xs sm:text-sm text-gray-500">
                  {item.title}
                </p>

                <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 tracking-tight">
                  {item.value}
                </h3>

                {/* TREND */}
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>{item.trend}</span>
                </div>

              </div>

              {/* ICON */}
              <div
                className={`
                  ${item.bg} 
                  p-3 rounded-xl
                  transition-all duration-300
                  group-hover:scale-110
                `}
              >
                <Icon
                  className={`${item.iconColor} w-5 h-5`}
                />
              </div>

            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

export default StatsCard