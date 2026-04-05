import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight, Pencil, Image } from "lucide-react"
import { useEffect, useState } from "react"

// 🔥 MODAL IMAGE
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const Badge = ({ children }) => (
  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#f2f7f0] text-[#A3C585] uppercase tracking-wide">
    {children}
  </span>
)

export default function PenyaluranTable({ setOpen, setEditData }) {

  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [previewImage, setPreviewImage] = useState(null) // 🔥 modal state

  const itemsPerPage = 5

  // 🔥 FETCH DATA
  const loadData = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/distribution")
      const result = await res.json()

      if (result.success) {
        const mapped = result.data.map((item) => ({
          id: item.id,
          tanggal: item.distributed_at?.split("T")[0] || "-",
          program: item.program_title || "-",
          tujuan: item.description || "-",
          nominal: new Intl.NumberFormat("id-ID").format(Number(item.amount) || 0),
          keterangan: item.description || "-",
          bukti: item.proof_attachment || "",
        }))

        setData(mapped)
      }

    } catch (err) {
      console.error("Gagal ambil data:", err)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  // 🔥 DELETE (TETAP)
  const handleDelete = async (id) => {
    const confirmDelete = confirm("Yakin hapus data ini?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")

      const res = await fetch(`http://localhost:5000/api/distribution/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json()

      if (result.success) {
        alert("Berhasil dihapus ✅")
        loadData()
      } else {
        alert("Gagal hapus ❌")
      }

    } catch (err) {
      console.error(err)
      alert("Server error ❌")
    }
  }

  // 🔥 EDIT
  const handleEdit = (item) => {
    setEditData({
      id: item.id,
      tanggal: item.tanggal,
      program: item.program,
      tujuan: item.tujuan,
      nominal: item.nominal,
      keterangan: item.keterangan,
      bukti: item.bukti,
    })

    setOpen(true)
  }

  // 🔥 PAGINATION
  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = data.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  return (
    <div className="bg-white">

      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="border-none">
            <TableHead className="pl-6">Tanggal</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Tujuan</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Bukti</TableHead>
            <TableHead className="text-center pr-6">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-400">
                Belum ada data
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item) => (
              <TableRow key={item.id}>

                <TableCell className="pl-6">{item.tanggal}</TableCell>

                <TableCell>
                  <Badge>{item.program}</Badge>
                </TableCell>

                <TableCell>{item.tujuan}</TableCell>

                <TableCell>
                  <div className="text-right pr-6">
                    <p className="text-xs text-gray-400">Rp</p>
                    <p className="font-bold text-[#A3C585]">{item.nominal}</p>
                  </div>
                </TableCell>

                <TableCell className="max-w-[200px]">
                  <p className="text-xs line-clamp-2">{item.keterangan}</p>
                </TableCell>

                {/* 🔥 ICON IMAGE */}
                <TableCell>
                  <div
                    onClick={() => setPreviewImage(item.bukti)}
                    className="w-10 h-10 flex items-center justify-center rounded-xl bg-gray-100 cursor-pointer hover:bg-gray-200 transition"
                    title="Klik untuk lihat"
                  >
                    <Image size={18} className="text-gray-600" />
                  </div>
                </TableCell>

                {/* 🔥 AKSI */}
                <TableCell className="pr-6">
                  <div className="flex justify-center gap-2">

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleEdit(item)}
                      className="hover:bg-blue-50 hover:text-blue-500"
                    >
                      <Pencil size={16} />
                    </Button>

                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="hover:bg-red-50 hover:text-red-500"
                    >
                      <Trash2 size={16} />
                    </Button>

                  </div>
                </TableCell>

              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* 🔥 PAGINATION */}
      <div className="px-6 py-4 flex justify-between items-center border-t">

        <p className="text-xs text-gray-400">
          Halaman {currentPage} dari {totalPages}
        </p>

        <div className="flex items-center gap-2">

          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={16} />
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 text-sm ${
                currentPage === i + 1 ? "font-bold text-[#A3C585]" : "text-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={16} />
          </button>

        </div>
      </div>

      {/* 🔥 MODAL IMAGE (DETAIL PENYALURAN) */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-sm text-gray-600">
              Detail Bukti Penyaluran
            </DialogTitle>
          </DialogHeader>

          {previewImage ? (
            <img
              src={previewImage}
              className="w-full h-auto rounded-xl object-cover"
            />
          ) : (
            <div className="text-center text-gray-400 py-10">
              Tidak ada gambar
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}