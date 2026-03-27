import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { useNavigate } from "react-router-dom";

function TransactionTable({ transactions = [] }) {
  const navigate = useNavigate();

  // Fungsi untuk mendapatkan inisial dari nama donatur
  const getInitials = (name) => {
    if (!name) return "AN";
    return name
      .trim()
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Format Mata Uang Rupiah
  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format Tanggal sesuai database (ISO String)
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }).replace(/\./g, ':');
  };

  return (
    <Card className="bg-white rounded-xl shadow-sm border border-gray-100 transition duration-300 hover:shadow-md">
      
      {/* HEADER */}
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <h3 className="text-base font-bold text-gray-800 tracking-tight">
          Transaksi Terbaru
        </h3>
      </div>

      {/* TABLE */}
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[750px]">
            
            <thead className="bg-gray-50/50">
              <tr className="text-left text-xs font-bold text-gray-500 uppercase tracking-widest">
                <th className="py-3 px-4">ID Transaksi</th>
                <th className="px-4">Donatur</th>
                <th className="px-4">Nominal</th>
                <th className="px-4">Tanggal</th>
                <th className="px-4">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-10 text-center text-gray-400 italic">
                    Belum ada data transaksi yang tersinkronisasi.
                  </td>
                </tr>
              ) : (
                transactions.slice(0, 10).map((item, i) => (
                  <tr key={item.id || i} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* ORDER ID */}
                    <td className="py-4 px-4 font-mono text-xs text-gray-600">
                      {item.order_id}
                    </td>

                    {/* DONATUR */}
                    <td className="px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                          {getInitials(item.name)}
                        </div>
                        <span className="text-gray-700 font-medium capitalize">
                          {item.name || "Hamba Allah"}
                        </span>
                      </div>
                    </td>

                    {/* NOMINAL */}
                    <td className="px-4 font-semibold text-gray-900">
                      {formatIDR(item.amount)}
                    </td>

                    {/* TANGGAL */}
                    <td className="px-4 text-gray-500 text-xs">
                      {formatDate(item.created_at)}
                    </td>

                    {/* STATUS (Success, Pending, Settlement) */}
                    <td className="px-4">
                      <span
                        className={`
                          px-3 py-1 text-[10px] rounded-full font-bold uppercase tracking-tighter border
                          ${
                            item.status === "success" || item.status === "settlement"
                              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                              : item.status === "pending"
                              ? "bg-amber-50 text-amber-600 border-amber-100"
                              : "bg-rose-50 text-rose-600 border-rose-100"
                          }
                        `}
                      >
                        {item.status === "success" || item.status === "settlement" ? "Berhasil" : item.status}
                      </span>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* FOOTER */}
        <div className="mt-6 text-center border-t border-gray-50 pt-4">
          <button 
              onClick={() => navigate("/admin/transaksi")}
              className="text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition">
            Lihat Semua Riwayat Donasi
          </button>
        </div>
      </CardContent>
    </Card>
  );
}

export default TransactionTable;