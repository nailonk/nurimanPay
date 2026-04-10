import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight, Image as ImageIcon, Loader2 } from "lucide-react"
import { useCallback, useEffect, useState, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const Badge = ({ children }) => (
  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#f2f7f0] text-[#A3C585] uppercase tracking-wide">
    {children}
  </span>
)

export default function PenyaluranTable() {
  const [data, setData] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [previewImage, setPreviewImage] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const itemsPerPage = 5
  const API_URL = import.meta.env.VITE_API_URL

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch(`${API_URL}/distribution`)
      const result = await res.json()
      
      if (result.success) {
        setData(result.data || [])
      }
    } catch (err) {
      console.error("Gagal ambil data:", err)
    } finally {
      setIsLoading(false)
    }
  }, [API_URL])

  useEffect(() => {
    loadData()
  }, [loadData])

  const processedItems = useMemo(() => {
    const indexOfLast = currentPage * itemsPerPage
    const indexOfFirst = indexOfLast - itemsPerPage
    const currentRawData = data.slice(indexOfFirst, indexOfLast)

    return currentRawData.map((item) => ({
      ...item,
      tanggal: item.distributed_at?.split("T")[0] || "-",
      nominalFormat: new Intl.NumberFormat("id-ID").format(Number(item.amount) || 0),
      bukti: item.image || item.proof_attachment || "",
    }))
  }, [data, currentPage])

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  const handleDelete = async (id) => {
    setDeletingId(id)
    try {
      const token = localStorage.getItem("token")
      const res = await fetch(`${API_URL}/distribution/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.ok) {
        setData(prev => prev.filter(item => item.id !== id))
      }
    } catch (err) {
      console.error("Gagal menghapus:", err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="w-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="overflow-x-auto w-full relative">
        <Table className="min-w-[800px]">
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="pl-6 h-14 text-gray-700 font-bold">Tanggal</TableHead>
              <TableHead className="text-gray-700 font-bold">Program</TableHead>
              <TableHead className="text-gray-700 font-bold">Tujuan</TableHead>
              <TableHead className="text-right text-gray-700 font-bold">Nominal</TableHead>
              <TableHead className="text-gray-700 font-bold">Keterangan</TableHead>
              <TableHead className="text-gray-700 font-bold">Bukti</TableHead>
              <TableHead className="text-center pr-6 text-gray-700 font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={7} className="py-20 text-center">
                   <div className="flex justify-center items-center gap-3">
                      <Loader2 className="animate-spin text-[#A3C585]" />
                      <span className="text-gray-500">Memuat data...</span>
                   </div>
                </TableCell>
              </TableRow>
            ) : processedItems.map((item) => (
              <TableRow key={item.id} className={`group hover:bg-gray-50/50 transition-colors ${deletingId === item.id ? 'opacity-50 pointer-events-none' : ''}`}>
                <TableCell className="pl-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                  {item.tanggal}
                </TableCell>
                
                <TableCell className="py-4">
                  <Badge>{item.program_title || item.program}</Badge>
                </TableCell>

                <TableCell className="py-4 max-w-[200px]">
                  <p className="text-sm font-semibold text-gray-800 break-words line-clamp-2">
                    {item.purpose}
                  </p>
                </TableCell>

                <TableCell className="py-4 text-right">
                  <span className="text-xs text-gray-400 font-bold mr-1">RP</span>
                  <span className="font-bold text-[#A3C585]">{item.nominalFormat}</span>
                </TableCell>

                <TableCell className="py-4 max-w-[250px]">
                  <p className="text-xs text-gray-500 leading-relaxed break-words whitespace-pre-wrap">
                    {item.description}
                  </p>
                </TableCell>

                <TableCell className="py-4">
                  <button
                    onClick={() => setPreviewImage(item.bukti)}
                    className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200 hover:border-[#A3C585] transition-all cursor-pointer"
                  >
                    {item.bukti ? (
                      <img src={item.bukti} className="w-full h-full object-cover" alt="bukti" />
                    ) : (
                      <ImageIcon size={16} className="mx-auto text-gray-300" />
                    )}
                  </button>
                </TableCell>

                <TableCell className="py-4 pr-6 text-center">
                  {deletingId === item.id ? (
                    <Loader2 className="h-8 w-8 text-red-500 animate-spin mx-auto" />
                  ) : (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2rem] bg-white shadow-lg border-none">
                        <AlertDialogHeader className="flex flex-col items-center text-center">
                          <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <Trash2 className="h-8 w-8 text-red-500" />
                          </div>
                          <AlertDialogTitle className="text-xl font-bold text-gray-800">
                            Hapus Riwayat Penyaluran?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-gray-500 mt-2">
                            Tindakan ini tidak dapat dibatalkan. Data penyaluran ke <strong>{item.purpose}</strong> akan dihapus permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="mt-6 sm:justify-center gap-3">
                          <AlertDialogCancel className="rounded-xl px-6 border-gray-200 hover:bg-gray-50 font-semibold">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(item.id)}
                            className="bg-red-500 hover:bg-red-600 rounded-xl px-6 font-semibold text-white transition-all shadow-lg shadow-red-100 border-none"
                          >
                            Ya, Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Modern */}
      <div className="px-6 py-4 flex justify-between items-center bg-gray-50/30 border-t border-gray-100">
        <p className="text-[11px] text-gray-400 font-medium uppercase">
          Menampilkan {processedItems.length} dari {data.length} Data
        </p>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-md border-gray-200"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft size={14} />
          </Button>
          
          <div className="flex gap-1 px-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  currentPage === i + 1 
                  ? "bg-[#A3C585] text-white shadow-sm" 
                  : "text-gray-400 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 p-0 rounded-md border-gray-200"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight size={14} />
          </Button>
        </div>
      </div>

      {/* Modal Preview Foto */}
      <Dialog open={!!previewImage} onOpenChange={() => setPreviewImage(null)}>
        <DialogContent className="max-w-lg p-0 overflow-hidden rounded-3xl border-none">
          <div className="p-6 bg-white">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-gray-800 flex items-center gap-2">
                <ImageIcon size={18} className="text-[#A3C585]" />
                Bukti Penyaluran Dana
              </DialogTitle>
            </DialogHeader>
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-gray-100 border border-gray-100">
              <img src={previewImage} className="w-full h-full object-contain" alt="Preview" />
            </div>
            <Button 
              className="w-full mt-6 bg-[#A3C585] hover:bg-[#8eb36d] text-white rounded-xl border-none"
              onClick={() => setPreviewImage(null)}
            >
              Tutup Detail
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}