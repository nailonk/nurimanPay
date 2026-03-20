import { BrowserRouter, Routes, Route } from "react-router-dom"

import DashboardAdmin from "@/pages/admin/dashboard/index"
import UserPage from "@/pages/user/page"

import Login from "@/pages/auth/login"
import ForgotPassword from "@/pages/auth/forgotpassword"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ADMIN */}
        <Route path="/admin/dashboard" element={<DashboardAdmin />} />

        {/* USER */}
        <Route path="/user" element={<UserPage />} />

        {/* AUTH */}
        <Route path="/login" element={<Login />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes