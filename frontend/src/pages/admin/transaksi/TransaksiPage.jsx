import { useEffect, useState } from "react";
import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import TransaksiStats from "@/components/admin/transaksi/StatsCard";
import TransaksiTable from "@/components/admin/transaksi/TransaksiTable";
import { Button } from "@/components/ui/button";
// 1. Import service API yang tadi Anda buat
import { transactionApi } from "@/api/transaction"; // Sesuaikan path filenya

function TransaksiPage() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // 2. Gunakan fungsi dari transactionApi
        // Jika di backend path-nya adalah /api/transactions, pastikan di service sudah sesuai
        const response = await transactionApi.getAll(); 
        
        // Axios menyimpan data di properti .data
        // Sesuaikan dengan struktur response BE Anda (result.success & result.data)
        if (response.data.success) {
          setTransactions(response.data.data);
        }
      } catch (err) {
        console.error("Detail Error Fetching:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleDownloadExcel = () => {
    if (transactions.length === 0) return alert("Tidak ada data untuk diunduh");

    const dataToExport = transactions.map((item, index) => ({
      No: index + 1,
      "Order ID": item.order_id,
      "Nama Donatur": item.name,
      "Nomor HP": item.phone_number,
      "Pesan": item.message || "-",
      "Nominal": item.amount,
      "Status": item.status,
      "Tanggal": new Date(item.created_at).toLocaleString("id-ID"),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Donasi");
    XLSX.writeFile(workbook, `Laporan_Donasi_${Date.now()}.xlsx`);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-[#f9fafb] min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500">Data real-time dari database & Midtrans</p>
        </div>
        <Button 
          onClick={handleDownloadExcel} 
          disabled={loading || transactions.length === 0}
          className="bg-[#A3C585] hover:bg-[#8eb074] flex gap-2"
        >
          <FileDown size={18} /> Excel
        </Button>
      </div>

      {loading ? (
        <div className="text-center p-10">Memuat data transaksi...</div>
      ) : (
        <>
          <TransaksiStats data={transactions} />
          <TransaksiTable data={transactions} />
        </>
      )}
    </div>
  );
}

export default TransaksiPage;