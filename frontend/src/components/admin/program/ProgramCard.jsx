import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CalendarDays, Pencil, Trash2 } from "lucide-react"
import { useNavigate } from "react-router-dom"

function ProgramCard({ data, onDelete }) {
  const navigate = useNavigate()
  const progress = data.progress

  const handleDelete = () => {
    const confirmDelete = confirm(`Yakin hapus "${data.title}"?`)
    if (!confirmDelete) return

    onDelete(data.id)
  }

  return (
    <Card className="rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition">

      <div className="relative h-56 w-full">
        <img
  src={data.image || "https://picsum.photos/400"}
  onError={(e) => {
    e.target.src = "https://picsum.photos/400"
  }}
  alt={data.title}
  className="w-full h-full object-cover"
/>
        {data.badge && (
          <span className="absolute top-3 left-3 bg-green-600 text-white text-xs px-3 py-1 rounded-full">
            {data.badge}
          </span>
        )}
      </div>

      <CardContent className="p-6 space-y-4">

        <div className="flex justify-between">
          <h2 className="font-semibold">{data.title}</h2>

          <div className="flex gap-2">
            <Pencil
              size={18}
              onClick={() => navigate(`/admin/program/edit/${data.id}`)}
              className="cursor-pointer hover:text-green-600"
            />
            <Trash2
              size={18}
              onClick={handleDelete}
              className="cursor-pointer hover:text-red-500"
            />
          </div>
        </div>

        <p className="text-sm text-muted-foreground">
          {data.description}
        </p>

        {/* PROGRESS */}
        <div>
          <div className="flex justify-between text-sm">
            <span>Progres</span>
            <span className="text-green-600">{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <CalendarDays size={14} />
            {data.deadline}
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/admin/program/${data.id}`)}
          >
            Detail →
          </Button>
        </div>

      </CardContent>
    </Card>
  )
}

export default ProgramCard