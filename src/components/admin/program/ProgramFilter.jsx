import { Input } from "@/components/ui/input"

function ProgramFilter({ search, setSearch }) {
  return (
    <div className="max-w-md">
      <Input
        placeholder="Cari program donasi..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

export default ProgramFilter