import { BrowserRouter, Routes, Route } from "react-router-dom"

import AdminPage from "@/pages/admin/page"
import UserPage from "@/pages/user/page"

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/user" element={<UserPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes