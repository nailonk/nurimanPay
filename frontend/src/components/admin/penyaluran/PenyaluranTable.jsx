import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight, Image } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
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

export default function PenyaluranTable() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [previewImage, setPreviewImage] = useState(null)
  const itemsPerPage = 5

  // 1. Definisikan loadData terlebih dahulu
  const loadData = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/api/distribution");
      const result = await res.json();
      
      if (result.success) {
        const mapped = result.data.map((item) => ({
          id: item.id,
          tanggal: item.distributed_at?.split("T")[0] || "-",
          program: item.program_title || "-",
          tujuan: item.purpose || "-",
          nominal: new Intl.NumberFormat("id-ID").format(Number(item.amount) || 0),
          keterangan: item.description || "-",
          bukti: item.image || item.proof_attachment || "", 
        }));
        setData(mapped);
      }
    } catch (err) {
      console.error("Gagal ambil data:", err);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin hapus data ini?")
    if (!confirmDelete) return

    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`http://localhost:5000/api/distribution/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      
      const result = await res.json()
      if (res.ok && result.success) {
        alert("Berhasil dihapus")
        await loadData()
      } else {
        alert("Gagal hapus: " + (result.message || "Izin ditolak"))
      }
    } catch (err) {
      console.error(err)
      alert("Server error")
    }
  }

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
              <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                {/* Tanggal */}
                <TableCell className="pl-6 align-top py-4 text-gray-600 font-medium">
                  {item.tanggal}
                </TableCell>

                {/* Program */}
                <TableCell className="align-top py-4">
                  <Badge>{item.program}</Badge>
                </TableCell>

                {/* Tujuan - Diarahkan ke bawah jika tidak muat */}
                <TableCell className="align-top py-4 max-w-[180px]">
                  <div className="text-sm text-gray-700 font-semibold break-words leading-relaxed">
                    {item.tujuan}
                  </div>
                </TableCell>

                {/* Nominal */}
                <TableCell className="align-top py-4">
                  <div className="text-right pr-4">
                    <p className="text-[10px] text-gray-400 uppercase font-extrabold">Rp</p>
                    <p className="font-bold text-[#A3C585] text-sm">{item.nominal}</p>
                  </div>
                </TableCell>

                {/* Keterangan - Diarahkan ke bawah jika tidak muat */}
                <TableCell className="align-top py-4 max-w-[250px]">
                  <div className="text-xs text-gray-500 whitespace-pre-wrap break-words leading-relaxed">
                    {item.keterangan}
                  </div>
                </TableCell>

                {/* Foto */}
                <TableCell className="align-top py-4">
                  <div
                    onClick={() => setPreviewImage(item.bukti)}
                    className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:ring-2 hover:ring-[#A3C585] transition-all active:scale-90 flex items-center justify-center border border-gray-100"
                  >
                    {item.bukti ? (
                      <img 
                        src={item.bukti} 
                        alt="Bukti" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null; 
                          e.target.src = "https://placehold.co/100x100?text=Error";
                        }}
                      />
                    ) : (
                      <Image size={18} className="text-gray-400" />
                    )}
                  </div>
                </TableCell>

                {/* Aksi */}
                <TableCell className="pr-6 align-top py-4">
                  <div className="flex justify-center">
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      className="h-9 w-9 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors"
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

      {/* Pagination */}
      <div className="px-6 py-4 flex justify-between items-center border-t">
        <p className="text-xs text-gray-400">Halaman {currentPage} dari {totalPages}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-2 text-sm ${currentPage === i + 1 ? "font-bold text-[#A3C585]" : "text-gray-400"}`}
            >
              {i + 1}
            </button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogHeader><DialogTitle className="text-sm text-gray-600">Detail Bukti Penyaluran</DialogTitle></DialogHeader>
          {previewImage && <img src={previewImage} className="w-full h-auto rounded-xl object-cover" />}
        </DialogContent>
      </Dialog>
    </div>
  )
}