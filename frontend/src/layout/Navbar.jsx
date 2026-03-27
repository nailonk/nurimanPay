import React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { User, LogOut } from "lucide-react"
import { useAuth } from "@/hooks/useAuth" // Import hook auth
import logo from "@/assets/logo.png"

function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { admin, logout } = useAuth() // Ambil state admin dan fungsi logout

  /**
   * Section scroll handler
   */
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

  /**
   * Secure Logout Handler
   * Triggers global state reset and redirects to login
   */
  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah anda yakin ingin keluar dari sistem?")
    if (confirmLogout) {
      logout() // Ini akan menghapus localStorage DAN setAdmin(null)
      navigate("/login", { replace: true })
    }
  }

  /**
   * Navigation Guard for User Icon
   */
  const handleUserClick = () => {
    if (admin) {
      navigate("/admin/dashboard")
    } else {
      navigate("/login")
    }
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

      {/* Navigation & Actions */}
      <div className="flex items-center gap-6">
        
        {/* Navigation Links */}
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

        {/* User Session Controls */}
        <div className="flex items-center gap-2">
          {/* Dashboard/Login Link */}
          <button
            onClick={handleUserClick}
            className="w-9 h-9 flex items-center justify-center rounded-full bg-green-100 hover:bg-green-200 transition"
            title={admin ? "Go to Dashboard" : "Login"}
          >
            <User size={18} className="text-[#A3C585]/80" />
          </button>

          {/* Conditional Logout Button: Only shown if admin is logged in */}
          {admin && (
            <button
              onClick={handleLogout}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-red-50 hover:bg-red-100 transition text-red-500"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>

      </div>
    </nav>
  )
}

export default Navbar