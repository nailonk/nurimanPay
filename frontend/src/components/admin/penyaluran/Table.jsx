import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { useEffect, useState } from "react"

const Badge = ({ children }) => (
  <span className="px-3 py-1 text-[10px] font-bold rounded-full bg-[#f2f7f0] text-[#A3C585] uppercase tracking-wide">
    {children}
  </span>
)

export default function TablePenyaluran() {
  const [data, setData] = useState([])

  const loadData = () => {
    const result = JSON.parse(localStorage.getItem("penyaluran") || "[]")
    setData(result)
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleDelete = (index) => {
    const newData = [...data]
    newData.splice(index, 1)
    localStorage.setItem("penyaluran", JSON.stringify(newData))
    setData(newData)
  }

  return (
    <div className="bg-white">
      <Table>
        <TableHeader className="bg-gray-50/50">
          <TableRow className="border-none">
            {/* Header Kolom */}
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
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-10 text-gray-400 text-sm">
                Belum ada data penyaluran
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <TableRow key={i} className="hover:bg-gray-50/50 border-b border-gray-50 transition-colors">
                {/* TANGGAL */}
                <TableCell className="pl-6 py-5 text-sm text-gray-600 font-medium">
                  {item.tanggal}
                </TableCell>

                {/* PROGRAM */}
                <TableCell>
                  <Badge>{item.program}</Badge>
                </TableCell>

                {/* TUJUAN */}
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-800">{item.tujuan}</span>
                  </div>
                </TableCell>

                {/* NOMINAL */}
                <TableCell>
                  <div className="text-right pr-10">
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Rp</p>
                     <p className="text-sm font-bold text-[#A3C585]">{item.nominal}</p>
                  </div>
                </TableCell>

                {/* KETERANGAN */}
                <TableCell className="max-w-[250px]">
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {item.keterangan}
                  </p>
                </TableCell>

                {/* BUKTI */}
                <TableCell>
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                    <img
                      src={item.bukti || "https://via.placeholder.com/40"}
                      className="w-full h-full object-cover"
                      alt="bukti"
                    />
                  </div>
                </TableCell>

                {/* AKSI */}
                <TableCell className="pr-6">
                  <div className="flex justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(i)}
                      className="w-9 h-9 rounded-lg bg-gray-50 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all"
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

      {/* FOOTER TABEL */}
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-50">
        <p className="text-[11px] text-gray-400 font-medium">
          Menampilkan {data.length} data
        </p>
        <div className="flex items-center gap-1">
          <button className="w-7 h-7 flex items-center justify-center rounded bg-[#A3C585] text-white text-xs font-bold">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs font-bold">2</button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs font-bold">3</button>
          <span className="mx-1 text-gray-300">...</span>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100 text-gray-400 text-xs font-bold">12</button>
        </div>
      </div>
    </div>
  )
}