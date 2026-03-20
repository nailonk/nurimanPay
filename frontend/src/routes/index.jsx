import { Routes, Route } from "react-router-dom"
import UserLayout from "@/layout/UserLayout"
import UserDashboard from "@/pages/user/UserDashboard"
import DetailProgram from "@/components/user/dashboard/DetailProgram"
import FormTransaction from "@/components/user/dashboard/FormTransaction"
import ProgramSection from "@/components/user/dashboard/ProgramSection"
import AboutSection from "@/components/user/dashboard/AboutSection"

export default function AppRoutes() {
  return (
    <Routes>

      {/* TANPA LAYOUT */}
      <Route path="/form-transaction" element={<FormTransaction />} />

      {/* USER LAYOUT */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/program-section" element={<ProgramSection />} />
        <Route path="/detail-program/:id" element={<DetailProgram />} />
        <Route path="/about-section" element={<AboutSection />} />
      </Route>

    </Routes>
  )
}