import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

const IMAGE_PLACEHOLDER = "/images/gradient-default.png";

function ProgramCard({ data, onDelete }) {
  const navigate = useNavigate()
  const progress = data.progress

  const handleDelete = () => {
    const confirmDelete = confirm(`Yakin hapus "${data.title}"?`)
    if (!confirmDelete) return
    onDelete(data.id)
  }

  return (
    <Card className="rounded-2xl border border-gray-100 shadow-md overflow-hidden hover:shadow-lg transition ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
      
      {/* IMAGE SECTION */}
      <div className="relative h-56 w-full bg-gray-100">
        <img
          src={data.image ? data.image : IMAGE_PLACEHOLDER} 
          onError={(e) => {
            e.target.src = IMAGE_PLACEHOLDER 
          }}
          alt={data.title}
          className="w-full h-full object-cover"
        />

        {/* BADGE */}
        {data.badge && (
          <span className="absolute top-3 left-3 bg-[#1b602f] text-white text-[10px] font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
            {data.badge}
          </span>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* TITLE & ACTIONS */}
        <div className="flex justify-between items-start gap-4">
          <h1 className="font-bold text-gray-800 leading-tight">
            {data.title}
          </h1>
          <div className="flex gap-3 text-gray-400 mt-1">
            <Pencil
              size={18}
              onClick={() => navigate(`/admin/program/edit/${data.id}`)}
              className="cursor-pointer hover:text-orange-500 transition-colors"
            />
            <Trash2
              size={18}
              onClick={handleDelete}
              className="cursor-pointer hover:text-red-500 transition-colors"
            />
          </div>
        </div>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-500 line-clamp-2">
          {data.description || "Tidak ada deskripsi program."}
        </p>

        {/* PROGRESS BAR SECTION */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-500">Progres Pengumpulan</span>
            <span className="text-[#7FAE5A]">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-[#A3C585] rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* DONATION DETAILS */}
        <div className="flex justify-between items-end pt-1">
          <div className="space-y-0.5">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Terkumpul</p>
            <p className="font-bold text-gray-800 text-sm">{data.collected}</p>
          </div>
          <div className="text-right space-y-0.5">
            <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Target</p>
            <p className="text-gray-600 text-sm font-medium">{data.target}</p>
          </div>
        </div>

        {/* DETAIL BUTTON */}
        <div className="flex justify-end pt-2 border-t border-gray-50">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#7FAE5A] hover:text-[#1b602f] hover:bg-[#A3C585]/10 font-semibold p-0 h-auto"
            onClick={() => navigate(`/admin/program/${data.id}`)}
          >
            Detail Program →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramCard