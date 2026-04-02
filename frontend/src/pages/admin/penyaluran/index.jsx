import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import Header from "@/components/admin/penyaluran/Header"
import StatCard from "@/components/admin/penyaluran/StatCard"
import TablePenyaluran from "@/components/admin/penyaluran/Table"
import FormPenyaluran from "@/components/admin/penyaluran/PenyaluranForm"

export default function Penyaluran() {
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  return (
    <div className="p-4 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">

      {open ? (
        <div className="max-w-4xl mx-auto py-4 mb-20 px-6 animate-in fade-in zoom-in duration-300">
          
          {/* TOMBOL KEMBALI */}
          <button
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Kembali ke Daftar Penyaluran
          </button>

          <div className="space-y-2">
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
        
        <>
          <Header setOpen={setOpen} setEditData={setEditData} />
          <StatCard />
          <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
            <TablePenyaluran
              setOpen={setOpen}
              setEditData={setEditData}
              setEditIndex={setEditIndex}
            />
          </div>
        </>
      )}
    </div>
  )
}