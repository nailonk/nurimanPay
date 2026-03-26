import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import axios from "axios"
import { Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

function ProgramDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:5000/program/${id}`)
        const data = response.data.data || response.data

        // Mapping data agar sesuai dengan kebutuhan UI
        const mappedData = {
          ...data,
          progress: data.target_amount > 0 
            ? Math.round((data.collected_amount / data.target_amount) * 100) 
            : 0,
          formattedCollected: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(data.collected_amount || 0),
          formattedTarget: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(data.target_amount || 0),
          image: data.image || "https://images.unsplash.com/photo-1542621334-a254cf47733d?q=80&w=800",
        }

        setProgram(mappedData)
      } catch (err) {
        console.error("Gagal memuat detail:", err)
        alert("Program tidak ditemukan atau server bermasalah.")
        navigate("/admin/program")
      } finally {
        setLoading(false)
      }
    }

    fetchProgramDetail()
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus program ini secara permanen?")) {
      try {
        await axios.delete(`http://localhost:5000/program/${id}`)
        alert("Program berhasil dihapus.")
        navigate("/admin/program")
      } catch (err) {
        console.error("Gagal menghapus:", err)
        alert("Terjadi kesalahan saat menghapus data.")
      }
    }
  }

  if (loading) return <div className="p-10 text-center">Memuat data program...</div>
  if (!program) return null

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin/program")}
        className="flex items-center gap-2 mb-6 text-sm text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Program
      </button>

      {/* CARD */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* IMAGE */}
        <div className="relative h-80">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          {/* BADGE */}
          <span className="absolute top-4 left-4 bg-[#A3C585] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-md">
            {program.status?.toUpperCase() || "AKTIF"}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-800">
                {program.title}
              </h1>
              <p className="text-gray-600 mt-3 leading-relaxed">
                {program.description}
              </p>
            </div>

            <button 
              onClick={handleDelete}
              className="p-2 rounded-lg bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
            >
              <Trash2 size={22} />
            </button>
          </div>

          <hr className="border-gray-100" />

          {/* PROGRESS */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Progres Pengumpulan</span>
              <span className="text-[#7FAE5A] font-bold">
                {program.progress}%
              </span>
            </div>

            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A3C585] transition-all duration-500"
                style={{ width: `${program.progress}%` }}
              />
            </div>
          </div>

          {/* TERKUMPUL & TARGET */}
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl">
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Terkumpul</p>
              <p className="text-xl font-bold text-gray-800">
                {program.formattedCollected}
              </p>
            </div>

            <div className="text-right border-l border-gray-200">
              <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Target Dana</p>
              <p className="text-xl font-semibold text-gray-600">
                {program.formattedTarget}
              </p>
            </div>
          </div>

          {/* ACTION */}
          <div className="pt-4 flex gap-3">
            <Button
              className="bg-[#A3C585] hover:bg-[#92b874] text-white px-8 h-11"
              onClick={() => navigate(`/admin/program/edit/${id}`)}
            >
              Edit Program
            </Button>
            
            <Button
              variant="outline"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 px-8 h-11"
              onClick={() => navigate("/admin/program")}
            >
              Tutup
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProgramDetailAdmin