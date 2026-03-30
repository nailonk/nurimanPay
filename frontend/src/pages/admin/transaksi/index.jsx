import { FileDown } from "lucide-react";
import * as XLSX from "xlsx";
import TransaksiList from "@/components/admin/transaksi/TransaksiList";
import TransaksiStats from "@/components/admin/transaksi/TransaksiStats";
import { Button } from "@/components/ui/button";
import { useState } from "react";

function TransaksiPage() {

  const [showDialog, setShowDialog] = useState(false);

  const handleDownloadExcel = () => {
    const rawData = JSON.parse(localStorage.getItem("transaksi")) || [];

    if (rawData.length === 0) {
      setShowDialog(true);
      return;
    }

    const dataToExport = rawData.map((item, index) => ({
      No: index + 1,
      "Nama Donatur": item.nama || "-",
      "Nomor HP": item.hp || "-",
      "Program Donasi": item.program || "-",
      "Nominal (Rp)": item.nominal || 0,
      "Metode": item.metode || "-",
      "Status": item.status || "pending",
      "Tanggal": item.tanggal || "-",
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Riwayat Transaksi");

    const fileName = `Laporan_Donasi_NurimanPay_${new Date().toLocaleDateString("id-ID")}.xlsx`;
    XLSX.writeFile(workbook, fileName);
  };

  return (
    <div className="p-4 md:p-6 space-y-8 bg-[#f9fafb] min-h-screen animate-in fade-in duration-500">
      
      {/* DIALOG */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-[999]">
          <div className="bg-white rounded-2xl shadow-lg p-6 w-[320px] text-center">
            <p className="text-gray-700 font-medium">
              Maaf, tidak ada data transaksi untuk diunduh.
            </p>
            <Button
              onClick={() => setShowDialog(false)}
              className="mt-4 bg-[#A3C585] hover:bg-[#8eb074] text-white w-full"
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500">
            Kelola dan pantau semua data donasi masuk secara real-time
          </p>
        </div>

        {/* TOMBOL DOWNLOAD EXCEL */}
        <Button 
          onClick={handleDownloadExcel}
          className="bg-[#A3C585] hover:bg-[#8eb074] text-white rounded-xl px-6 h-11 flex items-center gap-2 shadow-sm transition-all active:scale-95"
        >
          <FileDown size={18} />
          Download Excel
        </Button>
      </div>

      {/* STATS SECTION */}
      <TransaksiStats />
      
      {/* TABLE SECTION */}
      <div className="bg-white rounded-[24px] shadow-sm border border-gray-100 overflow-hidden">
        <TransaksiList />
      </div>
    </div>
  );
}

export default TransaksiPage;