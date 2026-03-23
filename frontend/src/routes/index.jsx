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
import ProgramCreate from "@/pages/admin/program/create"
import ProgramEdit from "@/pages/admin/program/edit"
import ProgramDetailAdmin from "@/pages/admin/program/detail"
import Penyaluran from "@/pages/admin/penyaluran"
import TransaksiPage from "@/pages/admin/transaksi"


/* AUTH */
import Login from "@/pages/auth/login"
import ForgotPassword from "@/pages/auth/forgotpassword"

export default function AppRoutes() {
  return (
    <Routes>

      {/* ================= ADMIN ================= */}
      <Route path="/admin" element={<AdminLayout />}>

        <Route path="dashboard" element={<DashboardPage />} />

        {/* PROGRAM */}
        <Route path="program" element={<ProgramPage />} />
        <Route path="program/create" element={<ProgramCreate />} />
        <Route path="program/edit/:id" element={<ProgramEdit />} />
        <Route path="program/:id" element={<ProgramDetailAdmin />} />

        <Route path="penyaluran" element={<Penyaluran />} />
        <Route path="transaksi" element={<TransaksiPage />} />
        

      </Route>

      {/* ================= AUTH ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgotpassword" element={<ForgotPassword />} />

      {/* ================= TANPA LAYOUT ================= */}
      <Route path="/form-transaction" element={<FormTransaction />} />

      {/* ================= USER ================= */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/detail-program/:id" element={<DetailProgram />} />
      </Route>

    </Routes>
  )
}