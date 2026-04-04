import { useState } from "react";
import Sidebar from "@/layout/admin/Sidebar";
import { Outlet } from "react-router-dom";
import { Menu } from "lucide-react";

export default function AdminLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f6f7]">
      
      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[60] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-[70] w-64 bg-white transform transition-transform duration-300 ease-in-out
        md:translate-x-0 
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <Sidebar closeMobile={() => setIsMobileOpen(false)} />
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64">
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-100 sticky top-0 z-40">
          <h1 className="font-bold text-[#1b602f]">Nuriman</h1>
          <button 
            onClick={() => setIsMobileOpen(true)}
            className="p-2 text-gray-500"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* CONTENT*/}
        <main className="flex-1">
          <div className="w-full h-full">
            <Outlet />
          </div>
        </main>
      </div>

    </div>
  );
}