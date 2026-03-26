import { useState } from "react"

import Header from "@/components/admin/penyaluran/Header"
import SummaryCard from "@/components/admin/penyaluran/SummaryCard"
import TablePenyaluran from "@/components/admin/penyaluran/Table"
import FormModal from "@/components/admin/penyaluran/FormModal"

export default function Penyaluran() {
  const [open, setOpen] = useState(false)
  const [editData, setEditData] = useState(null)
  const [editIndex, setEditIndex] = useState(null)

  return (
    <div className="p-6 space-y-6">

      {/* HEADER */}
      <Header
        setOpen={setOpen}
        setEditData={setEditData}
      />

      <SummaryCard />

      {/* TABLE */}
      <TablePenyaluran
        setOpen={setOpen}
        setEditData={setEditData}
        setEditIndex={setEditIndex}
      />

      {/* MODAL */}
      <FormModal
        open={open}
        setOpen={setOpen}
        editData={editData}
        editIndex={editIndex}
      />

    </div>
  )
}