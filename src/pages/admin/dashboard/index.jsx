import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "@/components/admin/dashboard/Navbar";
import StatsCard from "@/components/admin/dashboard/StatsCard";
import ChartSection from "@/components/admin/dashboard/ChartSection";
import ProgramList from "@/components/admin/dashboard/ProgramList";
import TransactionTable from "@/components/admin/dashboard/TransactionTable";

function DashboardPage() {
  const [programs, setPrograms] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const apiBaseUrl = "http://localhost:5000";

        const [resPrograms, resTransactions] = await Promise.all([
          axios.get(`${apiBaseUrl}/program`),
          axios.get(`${apiBaseUrl}/transaksi`)
        ]);

        const dataPrograms = Array.isArray(resPrograms.data) ? resPrograms.data : (resPrograms.data.data || []);
        const dataTransactions = Array.isArray(resTransactions.data) ? resTransactions.data : (resTransactions.data.data || []);

        setPrograms(dataPrograms);
        setTransactions(dataTransactions);
      } catch (err) {
        console.error("Koneksi ke database gagal:", err);
        setError("Gagal memuat data dari database Nuriman.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm animate-pulse">Loading...</p>
    </div>
  )

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center font-medium">
        {error} <br />
        <span className="text-sm text-gray-500">Pastikan backend (server.js) Anda sudah berjalan dan CORS aktif.</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="sticky top-0 z-20 bg-white border-b">
        <Navbar />
      </header>

      <div className="px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* STATS: Sekarang mengirim programs DAN transactions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
          <StatsCard programs={programs} transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartSection transactions={transactions} />
          </div>

          <div>
            <ProgramList programs={programs} />
          </div>
        </div>

        <div>
          <TransactionTable transactions={transactions} />
        </div>

      </div>
    </div>
  );
}

export default DashboardPage;