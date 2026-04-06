import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { getPrograms } from "@/api/program"

export default function StatsCard() {
  const [stats, setStats] = useState({
    totalCollected: 0,
    totalDistributed: 0,
    activeProgramsCount: 0, 
    totalTarget: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true)
        
        const [progRes, distRes] = await Promise.all([
          getPrograms(),
          fetch("http://localhost:5000/api/distribution").then(res => res.json())
        ])

        const programs = Array.isArray(progRes.data) ? progRes.data : (progRes.data?.data || [])
        const distributions = distRes.data || []

        let totalColl = 0
        let activeCount = 0
        
        programs.forEach(p => {
          const collected = Number(p.collected_amount) || 0
          totalColl += collected
          
          if (p.status === 'aktif') {
            activeCount++
          }
        })

        const totalDist = distributions.reduce(
          (acc, curr) => acc + (Number(curr.amount) || 0), 
          0
        )

        setStats({
          totalCollected: totalColl,
          totalDistributed: totalDist,
          activeProgramsCount: activeCount,
        })

      } catch (error) {
        console.error("Gagal memuat statistik database:", error)
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
      <StatBox 
        title="Total Donasi Terkumpul" 
        value={formatIDR(stats.totalCollected)} 
        color="text-[#A3C585]" 
      />

      {/* Dana Tersalurkan */}
      <StatBox 
        title="Dana Tersalurkan" 
        value={formatIDR(stats.totalDistributed)} 
        color="text-orange-500" 
      />

      {/* Program Aktif */}
      <StatBox 
        title="Program Sedang Berjalan" 
        value={`${stats.activeProgramsCount} Program`} 
        color="text-gray-800" 
      />
    </div>
  )
}

function StatBox({ title, value, color }) {
  return (
    <Card className="border-none shadow-md bg-white ring-0 outline-none">
      <CardContent className="p-5">
        <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">
          {title}
        </p>
        <h2 className={`text-2xl font-bold ${color}`}>
          {value}
        </h2>
      </CardContent>
    </Card>
  )
}