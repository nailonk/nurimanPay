import Navbar from "./Navbar"
import Footer from "./Footer"
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