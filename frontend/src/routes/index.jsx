import { Routes, Route, Navigate } from "react-router-dom"; 
import { useAuth } from "@/hooks/useAuth";

/* USER */
import UserLayout from "@/layout/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import DetailProgram from "@/components/user/dashboard/DetailProgram";
import FormTransaction from "@/components/user/dashboard/FormTransaction";

/* ADMIN */
import AdminLayout from "@/pages/admin";
import DashboardPage from "@/pages/admin/dashboard";
import ProgramPage from "@/pages/admin/program";
import ProgramCreate from "@/pages/admin/program/create";
import ProgramEdit from "@/pages/admin/program/edit";
import ProgramDetailAdmin from "@/pages/admin/program/detail";
import Penyaluran from "@/pages/admin/penyaluran";
import TransaksiPage from "@/pages/admin/transaksi";

/* AUTH */
import Login from "@/pages/auth/login";

const ProtectedRoute = ({ children }) => {
  const { admin, loading } = useAuth();
  
  if (loading) return null; 

  if (!admin || !admin.email) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* ADMIN */}
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="program" element={<ProgramPage />} />
        <Route path="program/create" element={<ProgramCreate />} />
        <Route path="program/edit/:id" element={<ProgramEdit />} />
        <Route path="program/:id" element={<ProgramDetailAdmin />} />
        <Route path="penyaluran" element={<Penyaluran />} />
        <Route path="transaksi" element={<TransaksiPage />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      {/* USER */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/detail-program/:id" element={<DetailProgram />} />
      </Route>

      {/* Tanpa Layout */}
      <Route path="/form-transaction" element={<FormTransaction />} />
    </Routes>
  );
}