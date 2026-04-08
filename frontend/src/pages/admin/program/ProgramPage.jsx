import { useState, useEffect, useCallback } from "react"
import { useNavigate, Outlet, useLocation } from "react-router-dom"
import { Plus, Search, Loader2 } from "lucide-react"
import { getPrograms, deleteProgram } from "@/api/program"
import ProgramCard from "@/components/admin/program/ProgramCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

const PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image"

function ProgramPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [programs, setPrograms] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const isMainPage = location.pathname === "/admin/program" || location.pathname === "/admin/program/"

  const fetchPrograms = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getPrograms();
      const rawData = response.data?.data || response.data || [];
      setPrograms(rawData); 
    } catch {
      setError("Gagal memuat data.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteProgram(id)
      setPrograms((prev) => prev.filter((item) => item.id !== id))
      toast.success("Program berhasil dihapus.")
    } catch (error) {
      console.error("Gagal menghapus:", error)
      toast.error("Gagal menghapus program.")
    }
  }

  useEffect(() => {
    if (isMainPage) {
      fetchPrograms()
    }
  }, [isMainPage, fetchPrograms])

  const filteredPrograms = programs.filter((p) =>
    (p.title || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      {isMainPage ? (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Program Donasi</h1>
              <p className="text-gray-500 text-sm">
                Kelola dan pantau seluruh inisiatif penggalangan dana.
              </p>
            </div>

            <Button
              onClick={() => navigate("/admin/program/create")}
              className="bg-[#A3C585] hover:bg-[#8eb36d] flex gap-2 text-white px-6 py-5 rounded-xl shadow-md transition-all active:scale-95"
            >
              <Plus size={18} />
              Tambah Program Baru
            </Button>
          </div>

          <div className="relative group max-w-md">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-[#A3C585]" 
              size={20} 
            />
            <Input
              placeholder="Cari berdasarkan judul program..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white border-gray-200 rounded-xl shadow-sm focus:ring-[#A3C585]/20 focus:border-[#A3C585]"
            />
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
              <Loader2 className="w-10 h-10 animate-spin text-[#A3C585]" />
              <p className="text-sm">Sinkronisasi data database...</p>
            </div>
          ) : error ? (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 font-medium">
              {error}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {filteredPrograms.length > 0 ? (
                filteredPrograms.map((item) => (
                  <ProgramCard 
                    key={item.id} 
                    data={item} 
                    onDelete={handleDelete} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                  <p className="text-gray-400 font-medium">Data program tidak ditemukan.</p>
                </div>
              )}
            </div>
          )}
          
          <footer className="text-center py-10 bg-white">
            <p className="text-[11px] text-gray-400 font-medium tracking-wide">
              © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
            </p>
          </footer>
        </>
      ) : (
        <Outlet />
      )}
    </div>
  )
}

export default ProgramPage