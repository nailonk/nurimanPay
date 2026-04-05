import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getPrograms } from "@/api/program"

export default function StatsCard() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalDistributed: 0, // 🔥 baru
    activeProgramsCount: 0, 
    totalTarget: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 🔥 PROGRAM
        const response = await getPrograms()
        const rawData = response.data
        const programs = Array.isArray(rawData) ? rawData : (rawData.data || [])

        // 🔥 FILTER 100%
        const completedPrograms = programs.filter(p => {
          const target = Number(p.target_amount) || 0
          const collected = Number(p.collected_amount) || 0
          if (target === 0) return false
          return (collected / target) * 100 >= 100
        })

        const totalCollected = completedPrograms.reduce(
          (acc, curr) => acc + (Number(curr.collected_amount) || 0),
          0
        )

        const totalTarget = completedPrograms.reduce(
          (acc, curr) => acc + (Number(curr.target_amount) || 0),
          0
        )

        const activeCount = completedPrograms.filter(p => p.status === 'aktif').length

        // 🔥 DISTRIBUTION (DANA TERSALURKAN)
        const distRes = await fetch("http://localhost:5000/api/distribution")
        const distJson = await distRes.json()
        const distributions = distJson.data || []

        const totalDistributed = distributions.reduce(
          (acc, curr) => acc + (Number(curr.amount) || 0),
          0
        )

        setStats({
          totalCollected,
          totalDistributed,
          activeProgramsCount: activeCount,
          totalTarget
        })

      } catch (error) {
        console.error("Gagal memuat statistik:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>
      ))}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      
      {/* Total Donasi */}
      <Card className="border-none shadow-md bg-white ring-0 outline-none">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
            Total Donasi Terkumpul
          </p>
          <h2 className="text-2xl font-bold text-[#A3C585]">
            {formatIDR(stats.totalCollected)}
          </h2>
        </CardContent>
      </Card>

      {/* 🔥 DIGANTI: Dana Tersalurkan */}
      <Card className="border-none shadow-md bg-white ring-0 outline-none">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
            Dana Tersalurkan
          </p>
          <h2 className="text-2xl font-bold text-orange-500">
            {formatIDR(stats.totalDistributed)}
          </h2>
        </CardContent>
      </Card>

      {/* Program Aktif */}
      <Card className="border-none shadow-md bg-white ring-0 outline-none">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
            Program Sedang Berjalan
          </p>
          <h2 className="text-2xl font-bold text-gray-800">
            {stats.activeProgramsCount} Program
          </h2>
        </CardContent>
      </Card>

    </div>
  )
}