import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "@/components/admin/dashboard/Sidebar"
import Navbar from "@/components/admin/dashboard/Navbar"

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">

      {/* OVERLAY MOBILE */}
      {openSidebar && (
        <div
          className="fixed inset-0 bg-black/40 z-10 md:hidden"
          onClick={() => setOpenSidebar(false)}
        />
      )}

      {/* SIDEBAR */}
      <Sidebar
        isMobileOpen={openSidebar}
        setIsMobileOpen={setOpenSidebar}
      />

      {/* RIGHT */}
      <div className="flex flex-col flex-1 overflow-hidden">

        {/* NAVBAR */}
        <header className="sticky top-0 z-20 bg-white border-b">
          <Navbar openSidebar={() => setOpenSidebar(true)} />
        </header>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout