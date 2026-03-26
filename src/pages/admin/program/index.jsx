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
          <p className="text-gray-500 text-sm">
            Kelola dan pantau seluruh inisiatif penggalang dana.
          </p>
        </div>

        <Button
          onClick={() => navigate("/admin/program/create")}
          className="bg-[#A3C585] hover:bg-[#A3C585]/70 flex gap-2 text-white"
        >
          <Plus size={16} />
          Tambah Program Baru
        </Button>
      </div>

      <div>
        <ProgramList />
      </div>
    </div>
  )
}

export default ProgramPage