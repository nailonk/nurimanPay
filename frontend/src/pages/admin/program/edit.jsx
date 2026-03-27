import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft } from "lucide-react"
import axios from "axios"
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
        const response = await axios.get(`http://localhost:5000/program`)
        
        const rawData = response.data
        const allPrograms = Array.isArray(rawData) ? rawData : (rawData.data || [])

        // Cari program yang cocok
        const program = allPrograms.find(p => String(p.id) === String(id))

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
        setError("Gagal mengambil data dari server.")
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
        target_amount: Number(formData.target_amount), // Pastikan menggunakan target_amount
        status: formData.status,
        image: formData.image,
        collected_amount: formData.collected_amount || 0
      }

      console.log("Mengirim payload ke backend:", payload)

      await axios.put(`http://localhost:5000/program/${id}`, payload)
      
      alert("Berhasil diperbarui!")
      navigate("/admin/program")
    } catch (err) {
      console.error("Update Error:", err)
      // Memberikan pesan error yang lebih spesifik jika ada dari backend
      const errMsg = err.response?.data?.error || "Gagal menyimpan perubahan."
      alert(`Error: ${errMsg}`)
    }
  }

  if (loading) return <div className="p-10 text-center text-gray-500 font-medium">Memuat data program...</div>
  
  if (error) return (
    <div className="p-10 text-center">
      <p className="text-red-500 font-semibold mb-4">{error}</p>
      <button 
        onClick={() => navigate("/admin/program")} 
        className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
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

      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
        {/* Pastikan initialData menerima objek data yang lengkap */}
        {data && <ProgramForm initialData={data} onSubmit={handleUpdate} />}
      </div>
    </div>
  )
}

export default ProgramEdit