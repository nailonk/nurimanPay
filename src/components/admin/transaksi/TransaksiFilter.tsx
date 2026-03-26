import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, ChevronDown } from "lucide-react";

function TransaksiFilter({ search, setSearch, filterProgram, setFilterProgram }) {
  const [daftarProgram, setDaftarProgram] = useState([]);

  useEffect(() => {
    const programs = JSON.parse(localStorage.getItem("programs")) || [];
    const titles = programs.map(p => p.title);
    setDaftarProgram(titles);
  }, []);

  return (
    <div className="p-6 flex flex-col md:flex-row gap-4 bg-white">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Nama Donatur atau Nomor HP..."
          className="pl-11 h-12 bg-gray-50/50 border-gray-100 rounded-xl focus:ring-[#A3C585]"
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
            <option key={index} value={title}>{title}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}

export default TransaksiFilter;