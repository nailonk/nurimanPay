import TransaksiList from "@/components/admin/transaksi/TransaksiList"
import TransaksiStats from "@/components/admin/transaksi/TransaksiStats"
import { Button } from "@/components/ui/button"
import { Download, Plus } from "lucide-react"

function TransaksiPage() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div className="flex justify-between items-center">
        
        <div>
          <h1 className="text-2xl font-bold">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500">
            Kelola dan pantau semua transaksi donasi
          </p>
        </div>

        {/* ACTION BUTTON */}
        <div className="flex gap-2">
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

        </div>

      </div>

      {/* LIST (SUDAH INCLUDE TABLE + STATUS BADGE) */}
      <TransaksiList />

      {/* STATS */}
      <TransaksiStats />

    </div>
  )
}

export default TransaksiPage