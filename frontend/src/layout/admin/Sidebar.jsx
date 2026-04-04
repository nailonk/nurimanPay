import {
  LayoutDashboard,
  HandHeart,
  Wallet,
  History,
  LogOut,
  Menu,
  X,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import logo from "@/assets/logo.png";
import { createPortal } from "react-dom"

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout: authLogout } = useAuth();

  const [isOpen, setIsOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const menus = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Program Donasi", icon: HandHeart, path: "/admin/program" },
    { name: "Penyaluran Dana", icon: Wallet, path: "/admin/penyaluran" },
    { name: "Riwayat Transaksi", icon: History, path: "/admin/transaksi" },
  ];

  const handleFinalLogout = () => {
    authLogout();
    setShowLogoutConfirm(false);
    navigate("/", { replace: true });
  };

  return (
    <>
      {/*  MOBILE OVERLAY */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[60] md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <div
        className={`
          fixed top-0 left-0 z-[70]
          h-screen bg-[#A3C586] text-white
          flex flex-col justify-between
          p-5 transition-all duration-300 ease-in-out
          ${isOpen ? "w-64" : "w-20"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div>
          {/* HEADER */}
          <div className="flex items-center justify-between mb-8">
            {(isOpen || isMobileOpen) && (
              <div className="flex items-center gap-3 overflow-hidden">
                <img
                  src={logo}
                  alt="Logo"
                  className="w-10 h-10 object-contain"
                />
                <div className="leading-tight whitespace-nowrap">
                  <h1 className="text-lg font-bold">Nurul Iman</h1>
                  <p className="text-[10px] text-green-100 uppercase tracking-widest">
                    Admin Panel
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={() =>
                isMobileOpen ? setIsMobileOpen(false) : setIsOpen(!isOpen)
              }
              className="p-1 hover:bg-white/20 rounded-lg transition-colors"
            >
              {isMobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* NAVIGATION MENU */}
          <ul className="space-y-2">
            {menus.map((menu, i) => {
              const isActive = location.pathname === menu.path;
              const Icon = menu.icon;

              return (
                <li
                  key={i}
                  onClick={() => {
                    navigate(menu.path);
                    setIsMobileOpen(false);
                  }}
                  className={`
                    w-full flex items-center
                    ${isOpen ? "gap-3 px-4 justify-start" : "justify-center"}
                    py-3 rounded-xl cursor-pointer transition-all
                    ${isActive ? "bg-white/30 text-white" : "text-white/80 hover:bg-white/10 hover:text-white"}
                  `}
                >
                  <Icon size={22} className="min-w-[22px]" />
                  <span
                    className={`font-medium whitespace-nowrap transition-all ${isOpen ? "opacity-100 block" : "opacity-0 hidden"}`}
                  >
                    {menu.name}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className={`flex items-center ${isOpen ? "px-4 justify-start gap-3" : "justify-center"} py-3 text-white/80 hover:text-white rounded-xl transition-all group`}
        >
          <LogOut
            size={20}
            className="min-w-[20px] group-hover:translate-x-1 transition-transform"
          />
          <span className={`${isOpen ? "block" : "hidden"} font-medium`}>
            Logout
          </span>
        </button>
      </div>

      {/*LO GOUT CONFIRMATION DIALOG */}
      {showLogoutConfirm &&
        createPortal(
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
              onClick={() => setShowLogoutConfirm(false)}
            />

            <div className="relative bg-white rounded-3xl w-full max-w-[320px] p-6 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-2">
                  <AlertCircle size={32} />
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-gray-900">
                    Konfirmasi Keluar
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Apakah anda yakin ingin mengakhiri sesi admin ini?
                  </p>
                </div>

                <div className="flex w-full gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-2xl border-gray-200 text-gray-600 font-semibold h-12"
                    onClick={() => setShowLogoutConfirm(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-semibold h-12 shadow-lg shadow-red-200 transition-all"
                    onClick={handleFinalLogout}
                  >
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )
      }
    </>
  );
}

export default Sidebar;
