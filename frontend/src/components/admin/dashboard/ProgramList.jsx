import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Home, Wrench, GraduationCap, LayoutGrid } from "lucide-react"

function ProgramList({ programs = [] }) {

  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (collected, target) => {
    if (!target || target === 0) return 0;
    const percentage = (collected / target) * 100;
    return Math.min(Math.round(percentage), 100);
  };

  const topPrograms = [...programs]
    .map(p => ({
      ...p,
      currentProgress: calculateProgress(p.collected_amount, p.target_amount)
    }))

    .sort((a, b) => b.currentProgress - a.currentProgress)
    .slice(0, 3);

  const iconConfig = [
    { icon: Home, color: "bg-green-100 text-green-600", bar: "bg-green-500" },
    { icon: Wrench, color: "bg-yellow-100 text-yellow-600", bar: "bg-yellow-500" },
    { icon: GraduationCap, color: "bg-blue-100 text-blue-600", bar: "bg-blue-500" },
  ];

  return (
    <Card className="rounded-2xl bg-white border shadow-md hover:shadow-lg transition-all ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base sm:text-lg">
          Mendekati Target
        </CardTitle>
        <button className="text-sm text-green-600 hover:underline">
          Lihat Semua
        </button>
      </CardHeader>

      <CardContent className="space-y-5">
        {topPrograms.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-4">Belum ada program.</p>
        ) : (
          topPrograms.map((p, i) => { 
            const progress = p.currentProgress;
            
            const style = iconConfig[i % iconConfig.length] || { 
              icon: LayoutGrid, 
              color: "bg-gray-100 text-gray-600", 
              bar: "bg-green-500" 
            };
            const Icon = style.icon;

            return (
              <div
                key={p.id || i}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition"
              >
                <div className={`p-2 rounded-lg ${style.color}`}>
                  <Icon size={18} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-800 truncate pr-2">
                      {p.title}
                    </p>
                    <span className="text-xs font-semibold text-gray-500">
                      {progress}%
                    </span>
                  </div>

                  <p className="text-xs text-gray-500">
                    Target: {formatIDR(p.target_amount)}
                  </p>

                  <div className="mt-2 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${style.bar} rounded-full transition-all duration-500`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            )
          })
        )}
      </CardContent>
    </Card>
  )
}

export default ProgramList;