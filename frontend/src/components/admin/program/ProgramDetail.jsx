import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProgramById, getProgramTransactions, deleteProgram } from "@/api/program"; 
import { Trash2, ArrowLeft, ReceiptText, User, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image";

function ProgramDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [program, setProgram] = useState(null);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFullData = async () => {
      setLoading(true);
      try {
        const programRes = await getProgramById(id);
        const data = programRes.data?.data || programRes.data;

        if (!data) throw new Error("Data program tidak ditemukan");

        const target = Number(data.target_amount) || 0;
        const collected = Number(data.collected_amount) || 0;
        const isImageValid = data.image && data.image !== "null" && String(data.image).length > 50;

        const formatDate = (dateString) => {
          if (!dateString) return "-";
          return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          });
        };

        setProgram({
          ...data,
          formattedCollected: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(collected),
          formattedTarget: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(target),
          formattedEndDate: formatDate(data.end_date),
          image: isImageValid ? data.image : PLACEHOLDER,
        });

        const donationsRes = await getProgramTransactions(id);
        const donationData = donationsRes.data?.data || donationsRes.data || [];
        setDonations(Array.isArray(donationData) ? donationData : []);

      } catch (err) {
        console.error("Gagal memuat detail program:", err);
        navigate("/admin/program");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus program ini?")) return;
    
    try {
      await deleteProgram(id);
      alert("Program berhasil dihapus.");
      navigate("/admin/program");
    } catch (err) {
      console.error("Gagal menghapus:", err);
      alert("Gagal menghapus program. Silakan coba lagi.");
    }
  };

  if (loading || !program) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium tracking-widest">Memuat Data...</p>
    </div>
  );

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER NAVIGATION */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate("/admin/program")} 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#A3C585] transition-colors"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar
        </button>
        <Button 
          variant="ghost" 
          onClick={handleDelete} 
          className="text-red-400 hover:bg-red-50 hover:text-red-600 gap-2 text-xs font-bold uppercase tracking-widest"
        >
          <Trash2 size={16} /> Hapus Program
        </Button>
      </div>

      {/* DETAIL PROGRAM CARD */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        <div className="relative h-64 lg:h-auto min-h-[300px]">
          <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
        </div>

        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-3 leading-tight">{program.title}</h1>
            <div className="flex items-center gap-2 text-[11px] font-bold text-orange-500 uppercase tracking-[0.1em] bg-orange-50 w-fit px-3 py-1 rounded-lg">
              <Calendar size={13} />
              <span>Berakhir pada: {program.formattedEndDate}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-1 overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Terkumpul</p>
                <p className="text-lg md:text-xl font-bold text-[#A3C585] break-words">{program.formattedCollected}</p>
            </div>
            <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 flex flex-col gap-1 overflow-hidden">
                <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Target</p>
                <p className="text-lg md:text-xl font-bold text-gray-700 break-words">{program.formattedTarget}</p>
            </div>
          </div>

          <div className="mt-8 text-gray-500 text-sm leading-relaxed whitespace-pre-line border-t pt-6 border-gray-50">
            {program.description}
          </div>
        </div>
      </div>

      {/* SECTION RIWAYAT TRANSAKSI */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm space-y-8">
        <div className="flex items-center justify-between border-b border-gray-50 pb-5">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#f2f7f0] text-[#A3C585] rounded-xl"><ReceiptText size={22} /></div>
            <h2 className="text-xl font-bold text-gray-800 tracking-tight">Riwayat Donasi</h2>
          </div>
          <span className="text-[10px] font-bold text-gray-400 px-4 py-1.5 bg-gray-50 rounded-full border border-gray-100 uppercase tracking-widest">
            {donations.length} Transaksi
          </span>
        </div>

        <div className="w-full">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-b border-gray-100">
                <TableHead className="py-4 pl-0 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Donatur</TableHead>
                <TableHead className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Order ID</TableHead>
                <TableHead className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Nominal</TableHead>
                <TableHead className="py-4 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Status</TableHead>
                <TableHead className="py-4 text-right pr-0 text-[11px] font-bold text-gray-400 uppercase tracking-widest">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations.length > 0 ? (
                donations.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors border-b border-gray-50 last:border-0">
                    <TableCell className="py-5 pl-0">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                          <User size={18} />
                        </div>
                        <span className="text-sm font-semibold text-gray-700">
                          {item.is_anonymous || (!item.donor_name && !item.name) 
                            ? "Hamba Allah" 
                            : (item.donor_name || item.name)}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-mono text-[11px] text-gray-400 uppercase">
                      #{item.order_id || item.transaction_id || (typeof item.id === 'string' ? item.id.slice(0, 8) : "N/A")}
                    </TableCell>
                    
                    <TableCell className="text-[#A3C585] font-bold text-sm">
                      Rp {new Intl.NumberFormat("id-ID").format(item.amount || 0)}
                    </TableCell>
                    
                    <TableCell>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {item.status || "Success"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-gray-400 text-xs pr-0">
                      {item.createdAt || item.created_at || item.date
                        ? new Date(item.createdAt || item.created_at || item.date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric'
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-20 text-gray-400 text-sm italic">
                    Belum ada riwayat donasi untuk program ini.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <footer className="text-center py-6">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
        </p>
      </footer>
    </div>
  );
}

export default ProgramDetail;