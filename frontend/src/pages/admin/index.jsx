import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "@/components/admin/dashboard/Sidebar"
import Navbar from "@/components/admin/dashboard/Navbar"

function AdminLayout() {
  const [openSidebar, setOpenSidebar] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">

      {/* SIDEBAR */}
      <Sidebar
        isMobileOpen={openSidebar}
        setIsMobileOpen={setOpenSidebar}
      />

      {/* RIGHT */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* NAVBAR */}
        <div className="sticky top-0 z-20 bg-white border-b">
          <Navbar openSidebar={() => setOpenSidebar(true)} />
        </div>

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout