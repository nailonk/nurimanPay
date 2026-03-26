import { Card, CardContent } from "@/components/ui/card"

export default function SummaryCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Total Penyaluran Bulan Ini
          </p>
          <h2 className="text-xl font-bold text-green-600">
            Rp 12.500.000
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Sisa Saldo Kas
          </p>
          <h2 className="text-xl font-bold">
            Rp 45.230.000
          </h2>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">
            Program Berjalan
          </p>
          <h2 className="text-xl font-bold">
            8 Program
          </h2>
        </CardContent>
      </Card>
    </div>
  )
}