import {
  LayoutDashboard,
  HandHeart,
  Wallet,
  History,
  LogOut,
  Menu
} from "lucide-react"

import { useNavigate, useLocation } from "react-router-dom"
import { useState } from "react"
import logo from "@/assets/logo.png"

function Sidebar({ isMobileOpen, setIsMobileOpen }) {
  const navigate = useNavigate()
  const location = useLocation()

  const [isOpen, setIsOpen] = useState(true)

  // ✅ PATH SUDAH DISAMAKAN
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
      {/* OVERLAY MOBILE */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <div
        className={`
          fixed md:relative z-50
          h-full
          bg-[#A3C586] text-white
          flex flex-col justify-between
          p-5 transition-all duration-300

          ${isOpen ? "w-64" : "w-20"}

          /* MOBILE SLIDE */
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* TOP */}
        <div>

          {/* TOGGLE */}
          <button
            onClick={() => {
              if (window.innerWidth < 768) {
                setIsMobileOpen(false)
              } else {
                setIsOpen(!isOpen)
              }
            }}
            className="mb-6 text-white"
          >
            <Menu />
          </button>

          {/* USER */}
          {isOpen && (
            <div className="mb-8 flex items-center gap-3">

  {/* LOGO */}
  <img
    src={logo}
    alt="Logo"
    className="w-10 h-10 object-contain"
  />

  {/* TEXT */}
  <div>
    <h1 className="text-lg font-semibold leading-tight">
      Nurul Iman
    </h1>
    <p className="text-sm text-green-100">
      Admin Panel
    </p>
  </div>

</div>
          )} 

          {/* MENU */}
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
                    relative flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all

                    ${
                      isActive
                        ? "bg-white/30 text-white"
                        : "text-green-50 hover:bg-white/20"
                    }
                  `}
                >
                  {/* ACTIVE BAR */}
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-[4px] bg-white rounded-r" />
                  )}

                  <Icon size={20} />

                  <span
                    className={`whitespace-nowrap transition-all duration-300 ${
                      isOpen ? "opacity-100 ml-1" : "opacity-0 w-0 overflow-hidden"
                    }`}
                  >
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
          className="flex items-center gap-2 text-sm text-green-100 hover:text-red-200 transition"
        >
          <LogOut size={18} />
          <span className={`${isOpen ? "block" : "hidden"}`}>
            Logout
          </span>
        </button>
      </div>
    </>
  )
}

export default Sidebar