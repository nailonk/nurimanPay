import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"

import ProgramForm from "@/components/admin/program/ProgramForm"

function ProgramEdit() {
  const { id } = useParams()
  const navigate = useNavigate()

  // 🔥 DUMMY DATA
  const [data] = useState({
    id,
    title: "Infaq Pembangunan",
    description: "Perbaikan atap masjid",
    target: "50000000",
    deadline: "2025-12-30",
  })

  const handleUpdate = (form) => {
    console.log("UPDATE:", form)
    navigate("/admin/program")
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Edit Program
      </h1>

      <ProgramForm
        initialData={data}
        onSubmit={handleUpdate}
      />
    </div>
  )
}

export default ProgramEdit