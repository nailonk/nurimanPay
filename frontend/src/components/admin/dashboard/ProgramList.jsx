import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Home, Wrench, GraduationCap } from "lucide-react"

function ProgramList() {

  const programs = [
    {
      name: "Sedekah Makan Jumat",
      progress: 70,
      icon: Home,
      color: "bg-green-100 text-green-600",
      bar: "bg-green-500",
      target: "Rp 5.000.000",
    },
    {
      name: "Renovasi Masjid",
      progress: 40,
      icon: Wrench,
      color: "bg-yellow-100 text-yellow-600",
      bar: "bg-yellow-500",
      target: "Rp 25.000.000",
    },
    {
      name: "Beasiswa Santri",
      progress: 60,
      icon: GraduationCap,
      color: "bg-blue-100 text-blue-600",
      bar: "bg-blue-500",
      target: "Rp 10.000.000",
    },
  ]

  return (
    <Card className="rounded-2xl border shadow-sm hover:shadow-md transition-all">

      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base sm:text-lg">
          Program Terbaru
        </CardTitle>

        <button className="text-sm text-green-600 hover:underline">
          Lihat Semua
        </button>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-5">

        {programs.map((p, i) => {
          const Icon = p.icon

          return (
            <div
              key={i}
              className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
            >

              {/* ICON */}
              <div className={`p-2 rounded-lg ${p.color}`}>
                <Icon size={18} />
              </div>

              {/* CONTENT */}
              <div className="flex-1">

                {/* TITLE + % */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-800 truncate">
                    {p.name}
                  </p>

                  <span className="text-xs font-semibold text-gray-500">
                    {p.progress}%
                  </span>
                </div>

                {/* TARGET */}
                <p className="text-xs text-gray-500">
                  Target: {p.target}
                </p>

                {/* PROGRESS */}
                <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${p.bar} rounded-full transition-all duration-500`}
                    style={{ width: `${p.progress}%` }}
                  />
                </div>

              </div>
            </div>
          )
        })}

      </CardContent>
    </Card>
  )
}

export default ProgramList