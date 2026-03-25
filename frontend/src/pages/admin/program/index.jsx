import { useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"

import ProgramList from "@/components/admin/program/ProgramList"
import { Button } from "@/components/ui/button"

function ProgramPage() {
  const navigate = useNavigate()

  return (
    <div className="p-4 md:p-6 space-y-6">

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Program Donasi</h1>
          <p className="text-muted-foreground text-sm">
            Kelola program donasi
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/program/create")}
          className="bg-green-600 hover:bg-green-700 flex gap-2"
        >
          <Plus size={16} />
          Tambah Program
        </Button>
      </div>

      <ProgramList />
    </div>
  )
}

export default ProgramPage