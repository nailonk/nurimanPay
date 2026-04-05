import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProgramById, getProgramTransactions, deleteProgram } from "@/api/program"; 
import { Trash2, ArrowLeft, ReceiptText, User, Target, Wallet } from "lucide-react";
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

        setProgram({
          ...data,
          progress: target > 0 ? Math.round((collected / target) * 100) : 0,
          formattedCollected: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(collected),
          formattedTarget: new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(target),
          image: isImageValid ? data.image : PLACEHOLDER,
        });

        try {
          const donationsRes = await getProgramTransactions(id);
          const donationData = donationsRes.data?.data || donationsRes.data || [];
          setDonations(Array.isArray(donationData) ? donationData : []);
        } catch (donErr) {
          console.warn("Data donasi belum tersedia:", donErr.message);
          setDonations([]); 
        }

      } catch (err) {
        console.error("Gagal memuat detail program:", err);
        alert("Program tidak ditemukan atau server bermasalah.");
        navigate("/admin/program");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchFullData();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (!window.confirm("Hapus program ini secara permanen?")) return;
    try {
      await deleteProgram(id);
      alert("Berhasil dihapus.");
      navigate("/admin/program");
    } catch (err) {
      console.error("Detail error hapus:", err); 
      alert("Gagal menghapus program.");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Sinkronisasi data...</p>
    </div>
  );

  if (!program) return null;

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-8">
      {/* HEADER NAVIGATION */}
      <div className="flex justify-between items-center">
        <button 
          onClick={() => navigate("/admin/program")} 
          className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#A3C585] transition-colors bg-white px-4 py-2 rounded-full border border-gray-100 shadow-sm"
        >
          <ArrowLeft size={16} /> Kembali ke Daftar
        </button>
        
        <Button 
          variant="ghost" 
          onClick={handleDelete} 
          className="text-red-400 hover:bg-red-50 hover:text-red-600 rounded-full gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <Trash2 size={16} /> Hapus Program
        </Button>
      </div>

      {/* MAIN LAYOUT: IMAGE LEFT, INFO RIGHT */}
      <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-2">
        {/* KOLOM KIRI: GAMBAR */}
        <div className="relative h-80 lg:h-full min-h-[350px]">
          <img src={program.image} alt={program.title} className="w-full h-full object-cover" />
          <div className="absolute top-6 left-6">
            <span className="bg-[#A3C585] text-white text-[10px] font-bold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
              {program.status || "AKTIF"}
            </span>
          </div>
        </div>

        {/* KOLOM KANAN: KETERANGAN */}
        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-6">
          <div className="space-y-3">
            <h1 className="text-3xl font-extrabold text-gray-800 leading-tight">{program.title}</h1>
            <div className="w-20 h-1.5 bg-[#A3C585] rounded-full"></div>
          </div>
          
          <p className="text-gray-500 text-sm leading-relaxed whitespace-pre-line">
            {program.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-white rounded-xl text-[#A3C585] shadow-sm"><Wallet size={20}/></div>
               <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold">Terkumpul</p>
                 <p className="text-lg font-bold text-gray-800">{program.formattedCollected}</p>
               </div>
            </div>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="p-3 bg-white rounded-xl text-gray-400 shadow-sm"><Target size={20}/></div>
               <div>
                 <p className="text-[10px] text-gray-400 uppercase font-bold">Target Dana</p>
                 <p className="text-lg font-bold text-gray-800">{program.formattedTarget}</p>
               </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIWAYAT TRANSAKSI (DIBAWAH) */}
      <div className="bg-white rounded-[32px] border border-gray-100 p-8 space-y-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#f2f7f0] text-[#A3C585] rounded-xl"><ReceiptText size={20} /></div>
            <h2 className="text-xl font-bold text-gray-800">Riwayat Donasi</h2>
          </div>
          <span className="text-xs font-medium text-gray-400 bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            Total {donations.length} Transaksi
          </span>
        </div>

        <div className="rounded-2xl border border-gray-50 overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50 border-b border-gray-100">
              <TableRow className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                <TableHead className="py-4">Donatur</TableHead>
                <TableHead className="py-4">Order ID</TableHead>
                <TableHead>Nominal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Tanggal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {donations && donations.length > 0 ? (
                donations.map((item) => (
                  <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <TableCell className="font-medium flex items-center gap-3 py-4">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <User size={16} />
                      </div>
                      <span className="text-gray-700">
                        {/* CEK NAMA: Coba donor_name, jika tidak ada coba name, jika anonim/kosong tampilkan Hamba Allah */}
                        {item.is_anonymous || (!item.donor_name && !item.name) 
                          ? "Hamba Allah" 
                          : (item.donor_name || item.name)}
                      </span>
                    </TableCell>

                    {/* KOLOM ORDER ID */}
                    <TableCell className="font-mono text-[11px] text-gray-500 uppercase">
                      #{item.order_id || item.transaction_id || item.id?.slice(0, 8) || "N/A"}
                    </TableCell>
                    
                    <TableCell className="text-[#A3C585] font-bold">
                      Rp {new Intl.NumberFormat("id-ID").format(item.amount || 0)}
                    </TableCell>
                    
                    <TableCell>
                      <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tighter">
                        {item.status || "Success"}
                      </span>
                    </TableCell>

                    <TableCell className="text-right text-gray-400 text-xs">
                      {/* CEK TANGGAL: Coba createdAt, jika tidak ada coba created_at, atau date */}
                      {item.createdAt || item.created_at || item.date
                        ? new Date(item.createdAt || item.created_at || item.date).toLocaleDateString('id-ID', {
                            day: '2-digit',
                            month: 'long',
                            year: 'numeric'
                          })
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-16 text-gray-400 text-sm italic">
                    Belum ada riwayat donasi.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <footer className="mt-16 text-center">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
            © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
        </p>
      </footer>
    </div>
  );
}

export default ProgramDetail;