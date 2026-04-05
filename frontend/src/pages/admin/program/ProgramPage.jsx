import { useState, useEffect, useCallback } from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import { Plus, Search, Loader2 } from "lucide-react"
import { getPrograms, deleteProgram } from "@/api/program"
import ProgramCard from "@/components/admin/program/ProgramCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image"

function ProgramPage() {
  const navigate = useNavigate()
  const location = useLocation()

  // --- STATE ---
  const [programs, setPrograms] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Perbaikan deteksi halaman utama agar lebih fleksibel
  const isMainPage = location.pathname === "/admin/program" || location.pathname === "/admin/program/"

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      try {
        await deleteProgram(id)
        setPrograms((prev) => prev.filter((item) => item.id !== id))
        alert("Program berhasil dihapus.")
      } catch (error) { // Mengganti 'err' menjadi 'error' untuk menghindari konflik
        console.error("Gagal menghapus:", error)
        alert("Gagal menghapus program.")
      }
    }
  }

  // --- FETCH DATA ---
  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true)
      const response = await getPrograms()
      const rawData = response.data?.data || response.data || []

      const mappedData = rawData.map((p) => {
        const target = Number(p.target_amount) || 0
        const collected = Number(p.collected_amount) || 0
        const isImageValid = p.image && p.image !== "null" && String(p.image).length > 50

        return {
          id: p.id,
          title: p.title || "Tanpa Judul",
          description: p.description || "",
          progress: target > 0 ? Math.round((collected / target) * 100) : 0,
          collected: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(collected),
          target: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(target),
          badge: p.status?.toUpperCase() || "AKTIF",
          image: isImageValid ? p.image : PLACEHOLDER,
        }
      })
      setPrograms(mappedData)
      setError(null)
    } catch (error) { // Konsistensi menggunakan nama 'error'
      console.error("Fetch error:", error)
      setError("Gagal memuat data program.")
    } finally {
      setLoading(false)
    }
  }, [])

  // Effect untuk fetch data: Berjalan saat pertama kali mount 
  // dan saat user kembali ke halaman utama dari halaman detail/edit
  useEffect(() => {
    if (isMainPage) {
      fetchPrograms()
    }
  }, [isMainPage, fetchPrograms])

  // --- FILTERING ---
  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      {isMainPage ? (
        <>
          {/* HEADER SECTION */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Program Donasi</h1>
              <p className="text-gray-500 text-sm">
                Kelola dan pantau seluruh inisiatif penggalangan dana.
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/program/create")}
              className="bg-[#A3C585] hover:bg-[#A3C585]/90 flex gap-2 text-white shadow-sm transition-all active:scale-95"
            >
              <Plus size={16} />
              Tambah Program Baru
            </Button>
          </div>

          {/* SEARCH BAR SECTION */}
          <div className="relative group max-w-md">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#A3C585]" 
              size={20} 
            />
            <Input
              placeholder="Cari program donasi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl shadow-sm transition-all duration-300 
                bg-gray-100/60
                text-sm text-gray-700
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#A3C585]/20 focus:bg-white
                border border-transparent focus:border-[#A3C585]"
            />
          </div>

          {/* LIST SECTION */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#A3C585]" />
              <p className="text-sm">Memuat data...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 font-medium">
              {error}
            </div>
          ) : (
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
              <footer className="text-center py-6">
                <p className="text-[11px] text-gray-400 font-medium tracking-wide">
                  © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
                </p>
              </footer>
            </div>
          )}
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default ProgramPage