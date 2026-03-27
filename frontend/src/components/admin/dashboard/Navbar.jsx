import { useState, useEffect } from "react";
import { Menu, Search, X } from "lucide-react";

function Navbar({ openSidebar, onSearch, initialValue = "", title = "Dashboard Admin" }) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    setQuery(initialValue);
  }, [initialValue]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <nav className="w-full border-b bg-white/80 backdrop-blur-md sticky top-0 z-30">
      {/* Menggunakan max-w-full dan px-4-8 untuk memastikan menyentuh ujung layar dengan padding cantik */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* LEFT: Menu & Dynamic Title */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={openSidebar}
              className="lg:hidden text-gray-500 hover:bg-gray-100 p-2 rounded-xl transition-all active:scale-95"
              aria-label="Open Sidebar"
            >
              <Menu size={24} />
            </button>

            <h1 className="text-lg sm:text-xl font-bold text-gray-800 tracking-tight truncate">
              {title}
            </h1>
          </div>

          {/* RIGHT: Dynamic Search Area */}
          <div className="flex-1 flex justify-end items-center max-w-md">
            <div className="relative w-full group">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#A3C585] transition-colors"
              />

              <input
                type="text"
                value={query}
                onChange={handleInputChange}
                placeholder="Cari sesuatu..."
                className="
                  w-full pl-10 pr-10 py-2.5
                  rounded-2xl
                  bg-gray-100/60
                  text-sm text-gray-700
                  placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-[#A3C585]/20 focus:bg-white
                  transition-all border border-transparent focus:border-[#A3C585]
                "
              />

              {/* Clear Button */}
              {query && (
                <button 
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full p-1 transition-all"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          </div>

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
    </nav>
  );
}

export default Navbar;