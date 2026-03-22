import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

function ProgramCard({ data }) {
  const progress = data.progress

  return (
    <Card className="rounded-2xl shadow-sm hover:shadow-md transition">
      <div className="w-full h-48 overflow-hidden rounded-t-2xl">
        <img
          src={data.image}
          alt={data.title}
          className="w-full h-full object-cover"
        />
      </div>

      <CardContent className="p-5 space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-lg font-semibold">{data.title}</h2>
          <p className="text-sm text-muted-foreground">
            {data.description}
          </p>
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span>Progress Pengumpulan</span>
            <span>{progress}%</span>
          </div>

          <div className="w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Nominal */}
        <div className="flex justify-between text-sm">
          <div>
            <p className="text-muted-foreground">Terkumpul</p>
            <p className="font-semibold">{data.collected}</p>
          </div>

          <div className="text-right">
            <p className="text-muted-foreground">Target</p>
            <p className="font-semibold">{data.target}</p>
          </div>
        </div>

        {/* Button */}
        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Detail Program →
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProgramCard