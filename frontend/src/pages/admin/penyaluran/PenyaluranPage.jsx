import { useState } from "react"
import { ArrowLeft, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import StatsCard from "@/components/admin/penyaluran/StatsCard"
import PenyaluranTable from "@/components/admin/penyaluran/PenyaluranTable"
import FormPenyaluran from "@/components/admin/penyaluran/PenyaluranForm"

export default function PenyaluranPage() {
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      
      {open ? (
        /* TAMPILAN FORM (TAMBAH/EDIT) */
        <div className="max-w-4xl mx-auto py-4 mb-20 px-6 animate-in fade-in zoom-in duration-300">
          
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Penyaluran
          </button>

          <div className="space-y-2 mb-6">
            <h1 className="text-2xl font-bold text-gray-800">
              {editData ? "Edit Laporan Penyaluran" : "Tambah Laporan Penyaluran Dana"}
            </h1>
            <p className="text-gray-500 text-sm">
              Silakan lengkapi formulir di bawah ini untuk mendokumentasikan distribusi dana bantuan.
            </p>
          </div>
          
          <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
            <FormPenyaluran 
              setOpen={setOpen} 
              editData={editData} 
              editIndex={editIndex}
              refresh={() => setOpen(false)} 
            />
          </div>
        </div>
      ) : (
        /* TAMPILAN DASHBOARD UTAMA */
        <>
          {/* HEADER SECTION */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold">Penyaluran Dana</h1>
              <p className="text-sm text-gray-500">
                Kelola data penyaluran dana operasional dan sosial masjid secara transparan.
              </p>
            </div>

            <Button 
              onClick={() => {
                setEditData(null); 
                setOpen(true);    
              }}
              className="bg-[#A3C585] hover:bg-[#A3C585]/70 flex gap-2 text-white"
            >
              <Plus size={16} />
              Tambah Laporan Penyaluran
            </Button>
          </div>

          <StatsCard />

          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <PenyaluranTable
              setOpen={setOpen}
              setEditData={setEditData}
              setEditIndex={setEditIndex}
            />
          </div>
        <footer className="text-center py-6">
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
          </p>
        </footer>
        </>
      )}
    </div>
  )
}