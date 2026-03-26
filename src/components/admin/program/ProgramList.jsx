import { useState, useEffect } from "react"
import { getPrograms, deleteProgram } from "@/api/program" 
import ProgramCard from "./ProgramCard"
import ProgramFilter from "./ProgramFilter"

function ProgramList() {
  const [search, setSearch] = useState("")
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fungsi untuk mengambil data menggunakan API Service
  const fetchPrograms = async () => {
    try {
      setLoading(true)
      
      // MENGGUNAKAN API SERVICE (getPrograms)
      const response = await getPrograms()
      
      // Sesuaikan dengan struktur data dari Axios (biasanya di response.data)
      const rawData = response.data?.data || response.data || []

      const mappedData = rawData.map((p) => {
        const rawImage = p.image || p.foto
        const placeholder = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image"

        // Validasi gambar: Pastikan ada string panjang (Base64/URL)
        const isImageValid = rawImage && rawImage !== "null" && String(rawImage).length > 50
        const displayImage = isImageValid ? rawImage : placeholder

        return {
          id: p.id,
          title: p.title || "Tanpa Judul",
          description: p.description || "",
          // Hitung progress donasi
          progress: p.target_amount > 0 
            ? Math.round(((p.collected_amount || 0) / p.target_amount) * 100) 
            : 0,
          // Format ke Rupiah agar komponen Card tinggal pakai
          collected: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.collected_amount || 0),
          target: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(p.target_amount || 0),
          badge: p.status?.toUpperCase() || "AKTIF",
          image: displayImage,
        }
      })

      setPrograms(mappedData)
      setError(null)
    } catch (err) {
      console.error("Fetch Error:", err)
      setError("Gagal memuat data dari database. Pastikan koneksi server aktif.")
    } finally {
      setLoading(false)
    }
  }

  // Fungsi hapus menggunakan API Service
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      try {
        // MENGGUNAKAN API SERVICE (deleteProgram)
        await deleteProgram(id)
        
        // Update state lokal agar baris yang dihapus langsung hilang dari layar
        setPrograms((prev) => prev.filter((item) => item.id !== id))
        alert("Program berhasil dihapus.")
      } catch (err) {
        console.error("Delete Error:", err)
        alert("Gagal menghapus program. Silakan coba lagi.")
      }
    }
  }

  // Ambil data saat pertama kali komponen muncul
  useEffect(() => { 
    fetchPrograms() 
  }, [])

  // Filter pencarian berdasarkan judul
  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm animate-pulse">Loading...</p>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Komponen Filter */}
      <ProgramFilter search={search} setSearch={setSearch} />
      
      {/* Pesan Error jika ada */}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Grid List Program */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((item) => (
            <ProgramCard 
              key={item.id} 
              data={item} 
              onDelete={() => handleDelete(item.id)} 
            />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">Data program tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProgramList