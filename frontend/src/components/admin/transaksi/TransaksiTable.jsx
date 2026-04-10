import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const StatusBadge = ({ status = "" }) => {
  const styles = {
    success: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    failed: "bg-red-50 text-red-600 border-red-100",
  };
  
  const labelMap = { success: "Berhasil", pending: "Pending", failed: "Gagal" };
  const currentStatus = status?.toLowerCase() || "pending";

  return (
    <div className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border text-[11px] font-bold capitalize ${styles[currentStatus] || styles.pending}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${currentStatus === "success" ? "bg-green-500" : currentStatus === "pending" ? "bg-orange-500" : "bg-red-500"}`} />
      {labelMap[currentStatus] || currentStatus}
    </div>
  );
};

function TransaksiTable({ data = [] }) {
  const [search, setSearch] = useState("");

  // Memfilter data yang diterima dari props parent (TransaksiPage)
  const filteredData = data.filter((item) => {
    const searchLower = search.toLowerCase();
    return (
      item.name?.toLowerCase().includes(searchLower) ||
      item.phone_number?.includes(search) ||
      item.order_id?.toLowerCase().includes(searchLower)
    );
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 border-b border-gray-50">
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama, No HP, atau Order ID..."
            className="pl-11 h-12 bg-gray-100/60 border-none rounded-xl focus:ring-[#A3C585]"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              <th className="px-6 py-4">Donatur</th>
              <th className="px-6 py-4">Order ID</th>
              <th className="px-6 py-4 text-center">Nominal</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Tanggal</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-gray-700">{item.name}</div>
                    <div className="text-[11px] text-gray-400">{item.phone_number}</div>
                  </td>
                  <td className="px-6 py-4 text-[12px] font-mono text-gray-500">
                    {item.order_id}
                  </td>
                  <td className="px-6 py-4 text-center font-bold text-gray-700">
                    Rp {Number(item.amount).toLocaleString("id-ID")}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500">
                    {item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID", {
                      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-10 text-center text-gray-400">
                  Data transaksi tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default TransaksiTable;