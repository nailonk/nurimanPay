import { useState } from "react"
import { Outlet } from "react-router-dom"

import Sidebar from "@/components/admin/dashboard/Sidebar"

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

        {/* CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-0 sm:px-0 lg:px-0 py-0 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>

      </div>
    </div>
  )
}

export default AdminLayout