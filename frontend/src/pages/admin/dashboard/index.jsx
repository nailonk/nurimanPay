import StatsCard from "@/components/admin/dashboard/StatsCard"
import ChartSection from "@/components/admin/dashboard/ChartSection"
import ProgramList from "@/components/admin/dashboard/ProgramList"
import TransactionTable from "@/components/admin/dashboard/TransactionTable"

function DashboardPage() {
  return (
    <div className="space-y-6">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
        <StatsCard />
      </div>

      {/* CHART + PROGRAM */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <ChartSection />
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <ProgramList />
        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 overflow-x-auto">
        <TransactionTable />
      </div>

    </div>
  )
}

export default DashboardPage