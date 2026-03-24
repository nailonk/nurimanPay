import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Header({ setOpen, setEditData }) {
  return (
    <div className="flex justify-between items-center">
      
      <div>
        <h1 className="text-2xl font-bold">Penyaluran Dana</h1>
        <p className="text-sm text-muted-foreground">
          Kelola data penyaluran dana operasional dan sosial masjid
        </p>
      </div>

      <Button
        onClick={() => {
          setEditData(null) // reset edit
          setOpen(true)     // buka modal
        }}
        className="bg-green-600 hover:bg-green-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Tambah Laporan
      </Button>

    </div>
  )
}