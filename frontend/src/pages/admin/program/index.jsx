import ProgramList from "@/components/admin/program/ProgramList"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function ProgramPage() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Program Donasi</h1>
          <p className="text-muted-foreground text-sm">
            Kelola dan pantau seluruh inisiatif penggalangan dana masjid.
          </p>
        </div>

        <Button className="bg-green-600 hover:bg-green-700">
          + Tambah Program Baru
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <Input placeholder="Cari program donasi..." />
      </div>

      {/* List */}
      <ProgramList />
    </div>
  )
}

export default ProgramPage