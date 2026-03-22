import { Routes, Route } from "react-router-dom"

/* USER */
import UserLayout from "@/layout/UserLayout"
import UserDashboard from "@/pages/user/UserDashboard"
import DetailProgram from "@/components/user/dashboard/DetailProgram"
import FormTransaction from "@/components/user/dashboard/FormTransaction"

/* ADMIN */
import AdminLayout from "@/pages/admin"
import DashboardPage from "@/pages/admin/dashboard"
import ProgramPage from "@/pages/admin/program"

/* AUTH */
import Login from "@/pages/auth/login"
import ForgotPassword from "@/pages/auth/forgotpassword"

export default function AppRoutes() {
  return (
    <Routes>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="program" element={<ProgramPage />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* TANPA LAYOUT */}
      <Route path="/form-transaction" element={<FormTransaction />} />

      {/* USER */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/detail-program/:id" element={<DetailProgram />} />
      </Route>

    </Routes>
  )
}