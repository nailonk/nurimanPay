import StatusBadge from "./StatusBadge"
import { MoreVertical } from "lucide-react"

function TransaksiTable({ data = [], onDelete }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
            <th className="px-6 py-4">Donatur</th>
            <th className="px-6 py-4">Program Donasi</th>
            <th className="px-6 py-4 text-center">Nominal</th>
            <th className="px-6 py-4">Metode</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4">Tanggal</th>
            <th className="px-6 py-4 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {data.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50/80 transition-colors group">
              <td className="px-6 py-4">
                <div className="font-bold text-gray-700">{item.nama}</div>
                <div className="text-[11px] text-gray-400">{item.hp}</div>
              </td>
              <td className="px-6 py-4">
                <span className="px-3 py-1 bg-green-50 text-[#A3C585] text-[10px] font-bold rounded-full border border-green-100 uppercase">
                  {item.program}
                </span>
              </td>
              <td className="px-6 py-4 text-center font-bold text-gray-700">
                Rp {Number(item.nominal).toLocaleString("id-ID")}
              </td>
              <td className="px-6 py-4 text-[12px] text-gray-500">{item.metode}</td>
              <td className="px-6 py-4">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-4 text-[12px] text-gray-500">{item.tanggal}</td>
              <td className="px-6 py-4 text-center">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                  <MoreVertical size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default TransaksiTable