import { useState, useEffect } from "react"
import ProgramCard from "./ProgramCard"
import ProgramFilter from "./ProgramFilter"

function ProgramList() {
  const [search, setSearch] = useState("")
  const [programs, setPrograms] = useState([])

  // 🔥 DATA DEFAULT (kalau belum ada di localStorage)
  const defaultPrograms = [
    {
      id: 1,
      title: "Infaq Pembangunan",
      description: "Perbaikan atap untuk mencegah kebocoran",
      progress: 70,
      collected: "Rp 35.000.000",
      target: "Rp 50.000.000",
      deadline: "12 hari lagi",
      badge: "MENDESAK",
      image: "https://via.placeholder.com/400",
    },
    {
      id: 2,
      title: "Santunan Anak Yatim",
      description: "Bantuan pendidikan anak",
      progress: 25,
      collected: "Rp 2.500.000",
      target: "Rp 10.000.000",
      deadline: "20 hari lagi",
      badge: null,
      image: "https://via.placeholder.com/400",
    },
    {
      id: 3,
      title: "Wakaf Sumur",
      description: "Pembangunan sumur air",
      progress: 100,
      collected: "Rp 15.000.000",
      target: "Rp 15.000.000",
      deadline: "Selesai",
      badge: "SELESAI",
      image: "https://via.placeholder.com/400",
    },
  ]

  // 🔥 LOAD DATA (INIT)
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("programs"))

    if (saved && saved.length > 0) {
      setPrograms(saved)
    } else {
      setPrograms(defaultPrograms)
      localStorage.setItem("programs", JSON.stringify(defaultPrograms))
    }
  }, [])

  // 🔥 DELETE + SYNC STORAGE
  const handleDelete = (id) => {
    const updated = programs.filter((p) => p.id !== id)

    setPrograms(updated)
    localStorage.setItem("programs", JSON.stringify(updated))
  }

  // 🔍 FILTER
  const filteredPrograms = programs.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">

      {/* 🔍 FILTER */}
      <ProgramFilter search={search} setSearch={setSearch} />

      {/* 📦 LIST */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        {filteredPrograms.map((item) => (
          <ProgramCard
            key={item.id}
            data={item}
            onDelete={handleDelete}
          />
        ))}
      </div>

      {/* ❌ EMPTY */}
      {filteredPrograms.length === 0 && (
        <p className="text-center text-gray-500">
          Program tidak ditemukan 😢
        </p>
      )}

    </div>
  )
}

export default ProgramList