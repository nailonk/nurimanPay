import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { User, ChevronDown } from "lucide-react"
import logo from "@/assets/logo.png"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleScroll = (sectionId) => {
    if (location.pathname !== "/") {
      navigate("/")
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: "smooth" })
        }
      }, 300)
    } else {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
  }

  const handleUserClick = () => {
    navigate("/login")
  }

  return (
    <nav className="w-full bg-white border-b px-4 sm:px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      
      {/* Branding Section */}
      <div 
        className="flex items-center gap-2 cursor-pointer" 
        onClick={() => navigate("/")}
      >
        <img src={logo} alt="NurimanPay" className="h-7 w-7" />
        <h1 className="text-base md:text-lg font-bold text-[#A3C585]/80">
          NurimanPay
        </h1>
      </div>

      <div className="flex items-center gap-6">
        
        {/* Navigation Links */}
        <div className="hidden sm:flex items-center gap-6 text-sm font-semibold text-gray-800">
          
          {/* Dropdown Program */}
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1 hover:text-green-600 transition-colors outline-none">
              Program <ChevronDown size={14} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48 bg-white ring-0 outline-none">
              <DropdownMenuItem 
                onClick={() => handleScroll("program-section")}
                className="cursor-pointer border-n font-medium hover:text-green-600"
              >
                Program Donasi
              </DropdownMenuItem>
             <DropdownMenuItem 
                onClick={() => handleScroll("completed-program-section")} 
                className="cursor-pointer font-medium hover:text-green-600"
              >
                Program Selesai
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button 
            onClick={() => handleScroll("about-section")}
            className="hover:text-green-600 transition-colors"
          >
            Tentang Kami
          </button>
          <button 
            onClick={() => handleScroll("contact-section")}
            className="hover:text-green-600 transition-colors"
          >
            Kontak
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleUserClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition"
            title="Login"
          >
            <User size={18} className="text-[#A3C585]/80" />
          </button>
        </div>

      </div>
    </nav>
  )
}

export default Navbar