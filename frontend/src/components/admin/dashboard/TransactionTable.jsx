import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

function TransactionTable() {

  const data = [
    {
      id: "#TX-88210",
      nama: "H. Ridwan",
      program: "Sedekah Makan Jumat",
      nominal: "500.000",
      tanggal: "21 Jun 2024, 10:30",
      status: "berhasil",
      initials: "HR",
    },
    {
      id: "#TX-88209",
      nama: "Anonim",
      program: "Beasiswa Santri",
      nominal: "1.250.000",
      tanggal: "21 Jun 2024, 09:15",
      status: "berhasil",
      initials: "AN",
    },
    {
      id: "#TX-88208",
      nama: "Siti Mariam",
      program: "Renovasi Masjid",
      nominal: "250.000",
      tanggal: "20 Jun 2024, 21:45",
      status: "pending",
      initials: "SM",
    },
    {
      id: "#TX-88207",
      nama: "Bambang S.",
      program: "Sedekah Makan Jumat",
      nominal: "100.000",
      tanggal: "20 Jun 2024, 18:20",
      status: "berhasil",
      initials: "BS",
    },
  ]

  return (
    <Card>

      {/* HEADER */}
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base">
          Transaksi Terbaru
        </CardTitle>

        <button className="text-sm text-primary hover:underline">
          Lihat Semua
        </button>
      </CardHeader>

      {/* CONTENT */}
      <CardContent>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">

            {/* HEADER */}
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b">
                <th className="py-3">ID</th>
                <th>Donatur</th>
                <th>Program</th>
                <th>Nominal</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {data.map((item, i) => (
                <tr
                  key={i}
                  className="border-b last:border-0 hover:bg-muted/50 transition"
                >

                  {/* ID */}
                  <td className="py-4 font-medium">
                    {item.id}
                  </td>

                  {/* DONATUR */}
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 flex items-center justify-center rounded-full bg-muted text-xs font-semibold">
                        {item.initials}
                      </div>
                      <span>{item.nama}</span>
                    </div>
                  </td>

                  {/* PROGRAM */}
                  <td className="text-muted-foreground">
                    {item.program}
                  </td>

                  {/* NOMINAL */}
                  <td className="font-semibold">
                    Rp {item.nominal}
                  </td>

                  {/* TANGGAL */}
                  <td className="text-muted-foreground">
                    {item.tanggal}
                  </td>

                  {/* STATUS */}
                  <td>
                    <span
                      className={`
                        px-2.5 py-1 text-xs rounded-full font-medium
                        ${
                          item.status === "berhasil"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }
                      `}
                    >
                      {item.status === "berhasil"
                        ? "Berhasil"
                        : "Pending"}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>

      </CardContent>
    </Card>
  )
}

export default TransactionTable