import Header from "@/components/admin/penyaluran/Header"
import StatCard from "@/components/admin/penyaluran/StatCard"
import TablePenyaluran from "@/components/admin/penyaluran/Table"

export default function Penyaluran() {
  return (
    <div className="p-6 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      <Header /> 
      <StatCard />
      <div>
        <TablePenyaluran />
      </div>
    </div>
  )
}