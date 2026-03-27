import { useState } from "react" // Tambahkan useState
import { Menu, Search, X } from "lucide-react" // Tambah X untuk tombol clear

function Navbar({ openSidebar, onSearch }) {
  const [query, setQuery] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Kirim data ke parent (ProgramList atau Dashboard) 
    // agar data bisa difilter secara real-time
    if (onSearch) {
      onSearch(value);
    }
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div className="w-full border-b bg-white sticky top-0 z-10">
      <div className="flex items-center justify-between px-4 md:px-6 py-4">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          {/* MOBILE MENU */}
          <button
            onClick={openSidebar}
            className="md:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-lg transition-colors"
          >
            <Menu size={20} />
          </button>

          <h1 className="text-xl font-bold text-gray-800 tracking-tight">
            Dashboard Admin
          </h1>
        </div>

        {/* RIGHT - SEARCH AREA */}
        <div className="hidden md:flex items-center">
          <div className="relative w-[240px] lg:w-[320px] group">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#A3C585] transition-colors"
            />

            <input
              type="text"
              value={query}
              onChange={handleInputChange}
              placeholder="Cari program atau data..."
              className="
                w-full pl-9 pr-9 py-2
                rounded-xl
                bg-gray-100/80
                text-sm text-gray-700
                placeholder:text-gray-400
                focus:outline-none focus:ring-2 focus:ring-[#A3C585]/20 focus:bg-white
                transition-all border border-transparent focus:border-[#A3C585]
              "
            />

            {/* Tombol Clear (X) - Muncul hanya jika ada teks */}
            {query && (
              <button 
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Navbar