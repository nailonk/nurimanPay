import { useState, useEffect } from "react";
import api from "@/api/axios"; 
import Navbar from "@/layout/admin/Navbar";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import ChartSection from "@/components/admin/dashboard/ChartSection";
import ProgramList from "@/components/admin/dashboard/ProgramList";
import TransactionTable from "@/components/admin/dashboard/TransactionTable";

function AdminDashboard() {
  const [programs, setPrograms] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [resPrograms, resTransactions] = await Promise.all([
          api.get("/program"),
          api.get("/transaction")
        ]);

        const dataPrograms = resPrograms.data?.data || resPrograms.data || [];
        const dataTransactions = resTransactions.data?.data || resTransactions.data || [];

        setPrograms(Array.isArray(dataPrograms) ? dataPrograms : []);
        setTransactions(Array.isArray(dataTransactions) ? dataTransactions : []);
      } catch (err) {
          console.error("Koneksi ke database gagal:", err);
        setError("Gagal memuat data dari database Nuriman.");
      } finally {
          setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredPrograms = programs.filter((p) =>
    p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTransactions = transactions.filter((t) => {
    const nameMatch = (t.name || "Hamba Allah").toLowerCase().includes(searchTerm.toLowerCase());
    const idMatch = (t.order_id || "").toLowerCase().includes(searchTerm.toLowerCase());
    return nameMatch || idMatch;
  });

return (
  <div className="min-h-screen">

    {/* Navbar selalu tampil */}
    <Navbar onSearch={(val) => setSearchTerm(val)} />

    {loading ? (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
        <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium animate-pulse">
          Memuat data dashboard...
        </p>
      </div>
    ) : error ? (
      <div className="max-w-md mx-auto mt-20 p-8 text-center bg-white rounded-3xl border border-red-100 shadow-sm">
        <div className="w-16 h-16 bg-red-50 text-red-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">!</span>
        </div>
        <p className="text-gray-800 font-bold text-lg mb-2">Terjadi Kesalahan</p>
        <p className="text-gray-500 text-sm mb-6">{error}</p>
      </div>
    ) : (
      <>
        <div className="px-4 sm:px-6 lg:px-8 space-y-6 pb-10">

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6 mt-4">
            <StatsCard programs={programs} transactions={transactions} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ChartSection transactions={transactions} />
            </div>

            <div>
              <ProgramList programs={filteredPrograms} />
            </div>
          </div>

          <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
            <TransactionTable transactions={filteredTransactions} />
          </div>

        </div>

        <footer className="text-center py-6">
          <p className="text-[11px] text-gray-400 font-medium tracking-wide">
            © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
          </p>
        </footer>
      </>
    )}

  </div>
);
}

export default AdminDashboard;