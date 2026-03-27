import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function Header({ setOpen, setEditData }) {
  return (
    <div className="flex justify-between items-center">
      
      <div>
        <h1 className="text-2xl font-bold">Penyaluran Dana</h1>
        <p className="text-sm text-gray-500">
          Kelola data penyaluran dana operasional dan sosial masjid secara transparan.
        </p>
      </div>

          <Button 
            onClick={() => {
              setEditData(null); // Reset data edit jika ada
              setOpen(true);     // Munculkan form
            }}
            className="bg-[#A3C585] hover:bg-[#A3C585]/70 flex gap-2 text-white"
          >
          <Plus size={16} />
          Tambah Laporan Penyaluran
        </Button>

    </div>
  )
}