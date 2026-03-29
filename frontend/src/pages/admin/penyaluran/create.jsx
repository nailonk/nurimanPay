import Header from "@/components/admin/penyaluran/Header"
import SummaryCard from "@/components/admin/penyaluran/SummaryCard"
import TablePenyaluran from "@/components/admin/penyaluran/Table"

export default function Penyaluran() {
  return (
    <div className="p-6 md:p-6 space-y-6 bg-[#f9fafb] min-h-screen">
      <Header /> 
      <SummaryCard />
      <div>
        <TablePenyaluran />
      </div>
    </div>
  )
}