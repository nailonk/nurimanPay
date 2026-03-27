import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "@/api/axios"
import { Trash2, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

const PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image"

function ProgramDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [program, setProgram] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProgramDetail = async () => {
      try {
        setLoading(true)
        const response = await api.get(`/program/${id}`)

        }

        const target = Number(data.target_amount) || 0
        const collected = Number(data.collected_amount) || 0
        const isImageValid = data.image && data.image !== "null" && String(data.image).length > 50

        // Mapping data agar sesuai dengan kebutuhan UI
        const mappedData = {
          ...data,
          progress: target > 0 ? Math.round((collected / target) * 100) : 0,
          formattedCollected: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(collected),
          formattedTarget: new Intl.NumberFormat("id-ID", { 
            style: "currency", currency: "IDR", maximumFractionDigits: 0 
          }).format(target),
          image: isImageValid ? data.image : PLACEHOLDER,
        }

        setProgram(mappedData)
      } catch (err) {
        console.error("Gagal memuat detail:", err)
        alert(err.response?.data?.error || "Program tidak ditemukan atau server bermasalah.")
        navigate("/admin/program")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProgramDetail()
  }, [id, navigate])

  const handleDelete = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus program ini secara permanen?")) {
      try {
        await api.delete(`/program/${id}`)
        alert("Program berhasil dihapus.")
        navigate("/admin/program")
      } catch (err) {
        console.error("Gagal menghapus:", err)
        const msg = err.response?.data?.error || "Terjadi kesalahan saat menghapus data."
        alert(msg)
      }
    }
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm">Memuat data program...</p>
    </div>
  )

  if (!program) return null

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/admin/program")}
        className="flex items-center gap-2 mb-6 text-sm text-gray-600 hover:text-gray-900 transition-colors group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Kembali ke Program
      </button>

      {/* CARD */}
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
        {/* IMAGE */}
        <div className="relative h-96">
          <img
            src={program.image}
            alt={program.title}
            className="w-full h-full object-cover"
          />
          {/* BADGE */}
          <span className="absolute top-6 left-6 bg-[#A3C585] text-white text-xs font-bold px-5 py-2 rounded-full shadow-lg">
            {program.status?.toUpperCase() || "AKTIF"}
          </span>
        </div>

        {/* CONTENT */}
        <div className="p-10 space-y-8">
          <div className="flex justify-between items-start gap-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                {program.title}
              </h1>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {program.description}
              </p>
            </div>

            <button 
              onClick={handleDelete}
              className="p-3 rounded-2xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all shadow-sm"
              title="Hapus Program"
            >
              <Trash2 size={24} />
            </button>
          </div>

          <div className="h-px bg-gray-100" />

          {/* PROGRESS */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-400 font-medium">Progres Donasi</p>
                <p className="text-2xl font-black text-[#7FAE5A]">{program.progress}%</p>
              </div>
              <span className="text-sm text-gray-400 italic">Target: {program.formattedTarget}</span>
            </div>

            <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A3C585] transition-all duration-700 ease-out shadow-[0_0_15px_rgba(163,197,133,0.5)]"
                style={{ width: `${Math.min(program.progress, 100)}%` }}
              />
            </div>
          </div>

          {/* TERKUMPUL & TARGET */}
          <div className="grid grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-[24px] border border-gray-100">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Dana Terkumpul</p>
              <p className="text-2xl font-bold text-gray-800">
                {program.formattedCollected}
              </p>
            </div>

            <div className="text-right border-l border-gray-200 pl-6">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Target Dibutuhkan</p>
              <p className="text-2xl font-semibold text-gray-600">
                {program.formattedTarget}
              </p>
            </div>
          </div>

          {/* ACTION */}
          <div className="pt-6 flex gap-4">
            <Button
              className="bg-[#A3C585] hover:bg-[#92b874] text-white px-10 h-12 rounded-xl text-md font-bold shadow-md transition-all active:scale-95"
              onClick={() => navigate(`/admin/program/edit/${id}`)}
            >
              Edit Informasi Program
            </Button>
            
            <Button
              variant="outline"
              className="bg-red-600 border-gray-200 text-white px-10 h-12 rounded-xl text-md active:scale-95"
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