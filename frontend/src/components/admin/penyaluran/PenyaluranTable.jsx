import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

const Badge = ({ children }) => (
  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#f2f7f0] text-[#A3C585] uppercase tracking-wide">
    {children}
  </span>
)

export default function PenyaluranTable() {
  const [data, setData] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("penyaluran")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 25

  useEffect(() => {
    const syncData = () => {
      const saved = localStorage.getItem("penyaluran")
      if (saved) setData(JSON.parse(saved))
    }
    window.addEventListener("storage", syncData)
    return () => window.removeEventListener("storage", syncData)
  }, [])

  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = data.slice(indexOfFirstItem, indexOfLastItem)
  
  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage))

  const handleDelete = (originalIndex) => {
    const newData = [...data]
    newData.splice(originalIndex, 1)
    localStorage.setItem("penyaluran", JSON.stringify(newData))
    setData(newData)
    
    const newTotalPages = Math.ceil(newData.length / itemsPerPage)
    if (currentPage > newTotalPages && newTotalPages > 0) {
      setCurrentPage(newTotalPages)
    }
  }

  return (
    <div className="bg-white">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="border-none">
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider pl-6">Tanggal</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Program</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Tujuan</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Nominal</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Keterangan</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider">Bukti</TableHead>
            <TableHead className="text-[11px] font-bold uppercase text-gray-400 tracking-wider text-center pr-6">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                Belum ada data penyaluran
              </TableCell>
            </TableRow>
          ) : (
            currentItems.map((item, i) => {
              const originalIndex = indexOfFirstItem + i
              return (
                <TableRow key={originalIndex} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                  <TableCell className="pl-6 py-5 text-sm text-gray-600 font-medium">{item.tanggal}</TableCell>
                  <TableCell><Badge>{item.program}</Badge></TableCell>
                  <TableCell>
                    <span className="text-sm font-bold text-gray-800">{item.tujuan}</span>
                  </TableCell>
                  <TableCell>
                    <div className="text-right pr-10">
                      <p className="text-[10px] text-gray-400 font-bold uppercase">Rp</p>
                      <p className="text-sm font-bold text-[#A3C585]">{item.nominal}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[250px]">
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{item.keterangan}</p>
                  </TableCell>
                  <TableCell>
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                      <img src={item.bukti || "https://via.placeholder.com/40"} className="w-full h-full object-cover" alt="bukti" />
                    </div>
                  </TableCell>
                  <TableCell className="pr-6">
                    <div className="flex justify-center">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(originalIndex)}
                        className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>

      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
        <p className="text-[11px] text-gray-400 font-medium">
          {data.length === 0 
            ? "Menampilkan 0 data" 
            : `Menampilkan ${indexOfFirstItem + 1} - ${Math.min(indexOfLastItem, data.length)} dari ${data.length} data`
          }
        </p>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          <div className="flex items-center gap-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1
              if (
                pageNumber === 1 || 
                pageNumber === totalPages || 
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
              ) {
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-7 h-7 flex items-center justify-center rounded text-xs font-bold transition-all ${
                      currentPage === pageNumber 
                      ? "bg-[#A3C585] text-white shadow-sm shadow-[#A3C585]/20" 
                      : "text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                )
              } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return <span key={pageNumber} className="text-gray-300 text-xs">...</span>
              }
              return null
            })}
          </div>

          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  )
}