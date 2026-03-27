import { useNavigate } from "react-router-dom";
import ProgramForm from "@/components/admin/program/ProgramForm";
import { Info, Eye, CheckCircle2, ArrowLeft } from "lucide-react";
import axios from "axios"; // 1. Import Axios

function ProgramCreate() {
  const navigate = useNavigate();

  const handleCreate = async (data) => {
    try {
      // Kirim data ke endpoint backend
      const response = await axios.post("http://localhost:5000/program/create", data);
      
      if (response.status === 201 || response.status === 200) {
        alert("Program berhasil ditambahkan ke database!");
        navigate("/admin/program");
      }
    } catch (err) {
      console.error("Gagal menambah program:", err.response?.data || err.message);
      alert("Gagal menyimpan ke database. Pastikan server backend jalan.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 mb-20 px-6 animate-in fade-in zoom-in duration-300">
      <button
        onClick={() => navigate("/admin/program")}
        className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 mb-8 transition-colors font-medium group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Kembali ke Daftar Program
      </button>

      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Tambah Program Donasi</h1>
        <p className="text-gray-500 text-sm">
          Lengkapi formulir di bawah untuk membuat kampanye donasi baru bagi jamaah.
        </p>
      </div>

      {/* FORM CARD */}
      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden mb-10">
        <ProgramForm onSubmit={handleCreate} />
      </div>

      {/* 3 INFO CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        {/* Tips Deskripsi */}
        <div className="bg-[#f2f7f0]/50 p-6 rounded-2xl border border-[#e2ece0] transition-all hover:shadow-md hover:shadow-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
               <Info size={18} className="text-[#A3C585]" strokeWidth={2.5} />
            </div>
            <h5 className="text-[11px] font-bold text-[#A3C585] uppercase tracking-wider">Tips Deskripsi</h5>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Jelaskan urgensi dan manfaat dari program untuk menarik minat donatur secara emosional.
          </p>
        </div>

        {/* Visual Terbuka */}
        <div className="bg-[#f2f7f0]/50 p-6 rounded-2xl border border-[#e2ece0] transition-all hover:shadow-md hover:shadow-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
               <Eye size={18} className="text-[#A3C585]" strokeWidth={2.5} />
            </div>
            <h5 className="text-[11px] font-bold text-[#A3C585] uppercase tracking-wider">Visual Terbuka</h5>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Gunakan foto asli kondisi masjid untuk membangun kepercayaan penuh bagi para jamaah.
          </p>
        </div>

        {/* Verifikasi */}
        <div className="bg-[#f2f7f0]/50 p-6 rounded-2xl border border-[#e2ece0] transition-all hover:shadow-md hover:shadow-green-50">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white rounded-lg shadow-sm">
               <CheckCircle2 size={18} className="text-[#A3C585]" strokeWidth={2.5} />
            </div>
            <h5 className="text-[11px] font-bold text-[#A3C585] uppercase tracking-wider">Verifikasi</h5>
          </div>
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Program akan langsung tayang secara otomatis di portal jamaah setelah Anda menyimpannya.
          </p>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 text-center">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          © 2026 NURIMANPAY • SYSTEM MANAGEMENT DONASI
        </p>
      </footer>
    </div>
  );
}

export default ProgramCreate;