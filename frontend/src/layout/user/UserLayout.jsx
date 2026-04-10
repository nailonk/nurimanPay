import Navbar from "@/layout/user/Navbar"
import Footer from "@/layout/user/Footer"
import { Outlet } from "react-router-dom"

export default function UserLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6f7]">
      <Navbar />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}