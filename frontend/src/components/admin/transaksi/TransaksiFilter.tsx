import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

function TransaksiFilter({ search, setSearch }) {
  return (
    <div className="flex gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Nama Donatur..."
          className="pl-9"
        />
      </div>

      <select className="border rounded-md px-3 text-sm h-10">
        <option>Semua Program</option>
      </select>
    </div>
  )
}

export default TransaksiFilter