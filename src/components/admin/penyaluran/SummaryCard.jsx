import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getPrograms } from "@/api/program"

export default function SummaryCard() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    activeProgramsCount: 0, // Menggunakan penamaan yang lebih jelas
    totalTarget: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await getPrograms()
        const rawData = response.data
        // Pastikan kita mengakses array data dengan benar
        const programs = Array.isArray(rawData) ? rawData : (rawData.data || [])

        // HITUNG SEMUA DATA DALAM SATU PROSES
        const total = programs.reduce((acc, curr) => acc + (Number(curr.collected_amount) || 0), 0)
        const target = programs.reduce((acc, curr) => acc + (Number(curr.target_amount) || 0), 0)
        const activeCount = programs.filter(p => p.status === 'aktif').length

        setStats({
          totalCollected: total,
          activeProgramsCount: activeCount, // Menggunakan hasil filter 'aktif'
          totalTarget: target
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
      {[1, 2, 3].map(i => <div key={i} className="h-24 bg-gray-100 rounded-xl"></div>)}
    </div>
  )

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Donasi Terkumpul */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Total Donasi Terkumpul
          </p>
          <h2 className="text-2xl font-bold text-[#A3C585]">
            {formatIDR(stats.totalCollected)}
          </h2>
        </CardContent>
      </Card>

      {/* Kekurangan Target */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            Kekurangan Target Donasi
          </p>
          <h2 className="text-2xl font-bold text-orange-500">
            {formatIDR(Math.max(0, stats.totalTarget - stats.totalCollected))}
          </h2>
        </CardContent>
      </Card>

      {/* Program Aktif */}
      <Card className="border-none shadow-sm bg-white">
        <CardContent className="p-5">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
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