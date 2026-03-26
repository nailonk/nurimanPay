import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import FormModal from "./FormModal"

/* badge fallback */
const Badge = ({ children }) => (
  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-600">
    {children}
  </span>
)

export default function TablePenyaluran() {
  const [data, setData] = useState([])
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  // ambil data dari localStorage
  const loadData = () => {
    const result = JSON.parse(localStorage.getItem("penyaluran") || "[]")
    setData(result)
  }

  useEffect(() => {
    loadData()
  }, [])

  // DELETE
  const handleDelete = (index) => {
    const newData = [...data]
    newData.splice(index, 1)
    localStorage.setItem("penyaluran", JSON.stringify(newData))
    setData(newData)
  }

  // EDIT
  const handleEdit = (item, index) => {
    setEditData(item)
    setEditIndex(index)
    setOpen(true)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-4">

      {/* BUTTON TAMBAH */}
      {/* <div className="flex justify-end mb-4">
        <Button
          onClick={() => {
            setEditData(null)
            setOpen(true)
          }}
          className="bg-green-600 hover:bg-green-700"
        >
          + Tambah Laporan
        </Button>
      </div> */}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Program</TableHead>
            <TableHead>Tujuan</TableHead>
            <TableHead>Nominal</TableHead>
            <TableHead>Bukti</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead className="text-center">Aksi</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                Belum ada data
              </TableCell>
            </TableRow>
          ) : (
            data.map((item, i) => (
              <TableRow key={i}>
                <TableCell>{item.tanggal}</TableCell>

                <TableCell>
                  <Badge>{item.program}</Badge>
                </TableCell>

                <TableCell>{item.tujuan}</TableCell>

                <TableCell className="text-green-600 font-semibold">
                  Rp {item.nominal}
                </TableCell>

                <TableCell>
                  <img
                    src={item.bukti}
                    className="w-12 h-12 rounded-md object-cover border"
                  />
                </TableCell>

                <TableCell className="max-w-[200px] truncate">
                  {item.keterangan}
                </TableCell>

                <TableCell>
                  <div className="flex justify-center gap-2">

                    {/* EDIT */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleEdit(item, i)}
                    >
                      <Pencil className="w-4 h-4 text-blue-600" />
                    </Button>

                    {/* HAPUS */}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => handleDelete(i)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>

                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* MODAL */}
      <FormModal
        open={open}
        setOpen={setOpen}
        editData={editData}
        editIndex={editIndex}
        refresh={loadData}
      />
    </div>
  )
}