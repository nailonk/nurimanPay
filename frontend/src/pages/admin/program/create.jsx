import { useNavigate } from "react-router-dom"
import ProgramForm from "@/components/admin/program/ProgramForm"

function ProgramCreate() {
  const navigate = useNavigate()

  const handleCreate = (data) => {
  const old = JSON.parse(localStorage.getItem("programs")) || []

  const newData = [...old, data]

  localStorage.setItem("programs", JSON.stringify(newData))

  navigate("/admin/program")
}

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">
        Tambah Program
      </h1>

      <ProgramForm onSubmit={handleCreate} />
    </div>
  )
}

export default ProgramCreate