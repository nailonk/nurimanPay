import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown, MoreVertical, Trash2 } from "lucide-react";

/* StatusBadge */
const StatusBadge = ({ status = "" }) => {
  const styles = {
    berhasil: "bg-green-50 text-green-600 border-green-100",
    pending: "bg-orange-50 text-orange-600 border-orange-100",
    gagal: "bg-red-50 text-red-600 border-red-100",
  };
  const label = (status || "pending").toLowerCase();
  return (
    <div
      className={`flex items-center gap-1.5 w-fit px-3 py-1 rounded-full border text-[11px] font-bold capitalize ${styles[label]}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${label === "berhasil" ? "bg-green-500" : label === "pending" ? "bg-orange-500" : "bg-red-500"}`}
      />
      {label}
    </div>
  );
};

function TransaksiTable() {
  const [transaksi, setTransaksi] = useState(() => {
    try {
      const rawData = localStorage.getItem("transaksi");
      if (rawData) {
        const saved = JSON.parse(rawData);
        return Array.isArray(saved) ? saved : [];
      }
      return [];
    } catch {
      return [];
    }
  });
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("Semua Program");

  const [daftarProgram] = useState(() => {
    try {
      const programs = JSON.parse(localStorage.getItem("programs")) || [];
      return programs.map((p) => p.title).filter(Boolean);
    } catch {
      return [];
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?")) {
      const updatedData = transaksi.filter((item) => item.id !== id);
      setTransaksi(updatedData);
      localStorage.setItem("transaksi", JSON.stringify(updatedData));
    }
  };

  const filteredData = transaksi.filter((item) => {
    const nama = item.nama?.toLowerCase() || "";
    const hp = item.hp || "";
    const searchLower = search.toLowerCase();
    const matchesSearch = nama.includes(searchLower) || hp.includes(search);
    const matchesProgram =
      filterProgram === "Semua Program" || item.program === filterProgram;
    return matchesSearch && matchesProgram;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-6 flex flex-col md:flex-row gap-4 border-b border-gray-50">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari Nama Donatur atau Nomor HP..."
            className="pl-11 h-12 border-gray-100 rounded-xl
              bg-gray-100/60
              text-sm text-gray-700
              placeholder:text-gray-400
              focus:outline-none focus:ring-2 focus:ring-[#A3C585]/20 focus:bg-white
              transition-all border border-transparent focus:border-[#A3C585]"
          />
        </div>

        <div className="relative">
          <select
            value={filterProgram}
            onChange={(e) => setFilterProgram(e.target.value)}
            className="appearance-none bg-gray-50/50 border border-gray-100 rounded-xl px-5 pr-12 text-sm h-12 outline-none focus:border-[#A3C585] text-gray-700 font-medium cursor-pointer w-full md:w-[220px]"
          >
            <option value="Semua Program">Semua Program</option>
            {daftarProgram.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Tabel */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50/50 border-b border-gray-100">
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
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-gray-50/80 transition-colors group"
                >
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
                  <td className="px-6 py-4 text-[12px] text-gray-500">
                    {item.metode}
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 text-[12px] text-gray-500">
                    {item.tanggal}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="px-6 py-20 text-center text-gray-400 text-sm font-medium"
                >
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
