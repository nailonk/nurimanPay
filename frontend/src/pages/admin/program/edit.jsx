import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import api from "@/api/axios" 
import ProgramForm from "@/components/admin/program/ProgramForm"

function ProgramEdit() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProgram = async () => {
      try {
        setLoading(true)

        const response = await api.get(`/program/${id}`)

        const program = response.data?.data || response.data

        if (program) {
          setData({
            id: program.id,
            title: program.title,
            description: program.description || "",
            target_amount: program.target_amount, 
            status: program.status,
            image: program.image,
            collected_amount: program.collected_amount || 0
          })
          setError(null)
        } else {
          setError("Program tidak ditemukan.")
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err)
        setError(err.response?.data?.error || "Gagal mengambil data dari server.")
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProgram()
  }, [id])

  const handleUpdate = async (formData) => {
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        target_amount: Number(formData.target_amount),
        status: formData.status || 'aktif',
        image: formData.image
      };

      await api.put(`/program/${id}`, payload);
      
      alert("Program berhasil diperbarui!");
      navigate("/admin/program");
    } catch (err) {
      console.error("Update Error Detail:", err);
      const serverMessage = err.response?.data?.error || err.response?.data?.message;
      const errorMessage = serverMessage || "Terjadi kesalahan saat menyimpan perubahan.";
      
      alert(`Gagal Update: ${errorMessage}`);
      throw err; // Lempar balik agar status loading di tombol form berhenti
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Memuat data program...</p>
    </div>
  )
  
  if (error) return (
    <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
      <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <ArrowLeft size={32} />
      </div>
      <p className="text-gray-800 font-bold text-lg mb-2">Ups! Ada Masalah</p>
      <p className="text-gray-500 text-sm mb-6">{error}</p>
      <button 
        onClick={() => navigate("/admin/program")} 
        className="w-full py-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-all font-semibold"
      >
        Kembali ke Daftar
      </button>
    </div>
  )

  return (
    <div className="max-w-4xl mx-auto py-10 mb-20 px-6 animate-in fade-in zoom-in duration-300">
      <button
        onClick={() => navigate("/admin/program")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Program
      </button>

      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Edit Program Donasi</h1>
        <p className="text-gray-500 text-sm">Perbarui informasi program agar tetap akurat.</p>
      </div>

      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden p-2">
        {data && <ProgramForm initialData={data} onSubmit={handleUpdate} />}
      </div>
      
      <footer className="mt-16 text-center">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          © 2026 NURIMANPAY • SYSTEM MANAGEMENT DONASI
        </p>
      </footer>
    </div>
  )
}

export default ProgramEdit