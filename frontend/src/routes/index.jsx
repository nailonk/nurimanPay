import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

/* USER */
import UserLayout from "@/layout/user/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import DetailProgram from "@/components/user/dashboard/DetailProgram";
import DetailCompletedProgram from "@/components/user/dashboard/DetailCompletedProgram";
import FormTransaction from "@/components/user/dashboard/FormTransaction";

/* ADMIN */
import AdminLayout from "@/layout/admin/AdminLayout";
import DashboardPage from "@/pages/admin/dashboard/AdminDashboard";
import ProgramPage from "@/pages/admin/program/ProgramPage";
import ProgramDetail from "@/components/admin/program/ProgramDetail";
import ProgramForm from "@/components/admin/program/ProgramForm";
import PenyaluranPage from "@/pages/admin/penyaluran/PenyaluranPage";
import TransaksiPage from "@/pages/admin/transaksi/TransaksiPage";

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
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />

        <Route path="program" element={<ProgramPage />}>
          <Route path="detail/:id" element={<ProgramDetail />} />
          <Route path="create" element={<ProgramForm />} />
          <Route path="edit/:id" element={<ProgramForm />} />
        </Route>

        <Route path="penyaluran" element={<PenyaluranPage />} />
        <Route path="transaksi" element={<TransaksiPage />} />
      </Route>

      {/* AUTH */}
      <Route path="/login" element={<Login />} />

      {/* USER */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<UserDashboard />} />
        <Route path="/detail-program/:id" element={<DetailProgram />} />
        <Route path="/detail-completed-program/:id" element={<DetailCompletedProgram />} />
      </Route>

      {/* Tanpa Layout */}
      <Route path="/form-transaction" element={<FormTransaction />} />

      {/* 404 Redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
