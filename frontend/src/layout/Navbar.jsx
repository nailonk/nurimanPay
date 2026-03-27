import React from "react"
import { useNavigate } from "react-router-dom"
import { User } from "lucide-react"
import logo from "@/assets/logo.png"

function Navbar() {
  const navigate = useNavigate()

  return (
    <nav className="w-full bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between">

      {/* LOGO */}
      <div className="flex items-center gap-2">
        <img src={logo} alt="NurimanPay" className="h-7 w-7" />
        <h1 className="text-base md:text-lg font-bold text-[#A3C585]/80">
          NurimanPay
        </h1>
      </div>

      {/* RIGHT SIDE */}
      <div className="flex items-center gap-6">

        {/* MENU */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-800">
          <button 
            onClick={() => navigate("/program-section")}
            className="hover:text-green-600"
          >
            Program
          </button>

          <button 
            onClick={() => navigate("/about")}
            className="hover:text-green-600"
          >
            Tentang Kami
          </button>

          <button 
            onClick={() => navigate("/contact")}
            className="hover:text-green-600"
          >
            Kontak
          </button>
        </div>

        {/* USER ICON */}
        <button
          className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition"
        >
          <User size={18} className="text-[#A3C585]/80" />
        </button>

      </div>
    </nav>
  )
}

export default Navbar