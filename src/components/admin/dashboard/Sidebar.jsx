import {
  LayoutDashboard,
  HandHeart,
  Wallet,
  History,
  LogOut,
  Menu, // Icon buka
  X     // Icon tutup
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import logo from "@/assets/logo.png"

function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  
  // State untuk Desktop (Collapse/Expand)
  const [isOpen, setIsOpen] = useState(true)
  // State untuk Mobile (Show/Hide)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Program Donasi", icon: HandHeart, path: "/admin/program" },
    { name: "Penyaluran Dana", icon: Wallet, path: "/admin/penyaluran" },
    { name: "Riwayat Transaksi", icon: History, path: "/admin/transaksi" },
  ]

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  return (
    <>
      {/* TOMBOL HAMBURGER */}
      {!isMobileOpen && (
        <button 
          onClick={() => setIsMobileOpen(true)}
          className="fixed top-4 left-4 z-[40] md:hidden p-2 bg-[#A3C586] text-white rounded-lg shadow-lg"
        >
          <Menu size={24} />
        </button>
      )}

      {/* OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR CORE */}
      <div
        className={`
          fixed md:sticky top-0 left-0 z-[70]
          h-screen bg-[#A3C586] text-white
          flex flex-col justify-between
          p-5 transition-all duration-300 ease-in-out
          
          /* Lebar Sidebar */
          ${isOpen ? "w-64" : "w-20"}
          
          /* Logika Sembunyi di Mobile */
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          {/* HEADER: Logo & Toggle Button */}
          <div className="flex items-center justify-between mb-8">
            {(isOpen || isMobileOpen) && (
              <div className="flex items-center gap-3">
                <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
                <div className="leading-tight">
                  <h1 className="text-lg font-bold">Nurul Iman</h1>
                  <p className="text-[10px] text-green-100 uppercase tracking-widest">Admin Panel</p>
                </div>
              </div>
            )}

            {/* Tombol Toggle Desktop / Close Mobile */}
            <button 
              onClick={() => isMobileOpen ? setIsMobileOpen(false) : setIsOpen(!isOpen)}
              className="p-1 hover:bg-white/20 rounded-lg"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* MENU NAVIGASI */}
          <ul className="space-y-2">
            {menus.map((menu, i) => {
              const isActive = location.pathname === menu.path
              const Icon = menu.icon

              return (
                <li
                  key={i}
                  onClick={() => {
                    navigate(menu.path)
                    setIsMobileOpen(false)
                  }}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all
                    ${isActive ? "bg-white/30 text-white hover:bg-white/20" : "text-white hover:bg-white/10"}
                  `}
                >
                  <Icon size={22} />
                  <span className={`font-medium transition-all ${isOpen ? "block" : "hidden"}`}>
                    {menu.name}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        {/* LOGOUT */}
        <button
          onClick={logout}
          className="flex items-center gap-3 px-4 py-3 text-white/80 hover:text-white hover:bg-red-500/20 rounded-xl transition-all"
        >
          <LogOut size={20} />
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>Logout</span>
        </button>
      </div>
    </>
  )
}

export default Sidebar