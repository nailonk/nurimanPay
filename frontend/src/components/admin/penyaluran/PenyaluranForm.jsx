import { useState, useEffect } from "react";
import { 
  Calendar, LayoutGrid, User, Receipt, FileText, 
  UploadCloud, X, Save, Loader2, Info, Eye, CheckCircle2 
} from "lucide-react";

export default function FormPenyaluran({ refresh, setOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [programs, setPrograms] = useState([]);

 const API_URL = import.meta.env.VITE_API_URL
  const [form, setForm] = useState({
    tanggal: "",
    program: "",
    tujuan: "",
    nominal: "",
    keterangan: "",
    bukti: "",
  });

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await fetch(`${API_URL}/program`);
        const data = await res.json();
        const allPrograms = data.data || [];

        const filtered = allPrograms.filter(p => {
          const target = p.target_amount || 0;
          const collected = p.collected_amount || 0;
          return target > 0 && (collected / target) * 100 >= 100;
        });

        setPrograms(filtered);
      } catch (err) {
        console.error("Gagal ambil program:", err);
      }
    };
    fetchPrograms();
  }, [API_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleNominal = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm(prev => ({
      ...prev,
      nominal: value ? new Intl.NumberFormat("id-ID").format(value) : "",
    }));
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) return alert("File maksimal 2MB");

    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, bukti: reader.result }));
    reader.readAsDataURL(file);
  };

  const getSaldo = () => {
    const selected = programs.find(p => String(p.id) === String(form.program));
    if (!selected) return 0;
    return (selected.collected_amount || 0) - (selected.distributed_amount || 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("Kamu belum login ❌");

    // Menghilangkan titik dari format rupiah agar menjadi angka murni
    const amount = parseInt(form.nominal.replace(/\./g, ""));
    const saldo = getSaldo();

    if (amount > saldo) return alert("Saldo tidak cukup ❌");
    if (form.keterangan.length < 100) return alert("Deskripsi minimal 100 karakter ❌");

    setIsSubmitting(true);
    try {
      const payload = {
        program_id: form.program,
        purpose: form.tujuan.trim(),
        amount: amount,
        description: form.keterangan.trim(),
        distributed_at: form.tanggal,
        // SESUAIKAN DENGAN CONTROLLER: pakai nama 'image'
        image: form.bukti, 
      };

      const res = await fetch(`${API_URL}/distribution/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json(); // Ambil response dari server

      if (!res.ok) {
        // Jika error, tampilkan pesan error dari Controller
        throw new Error(result.error || "Gagal menyimpan data");
      }

      alert("Berhasil disimpan ✅");
      refresh?.(); // Refresh tabel
      setOpen(false); // Tutup modal/form
    } catch (err) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-10 mb-20 px-6 animate-in fade-in zoom-in duration-300">
      <div className="mb-8 space-y-2">
        <h1 className="text-2xl font-bold text-gray-800">Buat Laporan Penyaluran</h1>
        <p className="text-gray-500 text-sm">Catat penyaluran dana donasi ke penerima manfaat.</p>
      </div>

      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                  <Calendar size={16}/> <span className="text-gray-700">Tanggal Penyaluran</span>
                </label>
                <input 
                  type="date"
                  name="tanggal"
                  value={form.tanggal}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                  <LayoutGrid size={16}/> <span className="text-gray-700">Program Donasi</span>
                </label>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none"
                  required
                >
                  <option value="">Pilih Program</option>
                  {programs.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.title}</option>
                  ))}
                </select>
                {form.program && (
                  <p className="text-[10px] text-blue-500 font-bold mt-1">
                    SALDO TERSEDIA: Rp {getSaldo().toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                  <User size={16}/> <span className="text-gray-700">Tujuan / Penerima</span>
                </label>
                <input
                  type="text"
                  name="tujuan"
                  value={form.tujuan}
                  onChange={handleChange}
                  placeholder="Nama lembaga atau orang"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                  <Receipt size={16}/> <span className="text-gray-700">Nominal Dana (Rp)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                  <input
                    type="text"
                    value={form.nominal}
                    onChange={handleNominal}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 h-12 text-sm font-bold text-[#A3C585] outline-none"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <FileText size={16} /> <span className="text-gray-700">Detail Laporan Penyaluran</span>
              </label>
              <textarea
                name="keterangan"
                value={form.keterangan}
                onChange={handleChange}
                rows={4}
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm focus:border-[#A3C585] outline-none resize-none"
                placeholder="Tuliskan bukti aktivitas penyaluran..."
                required
              />
              <div className="flex justify-between text-[10px] font-bold">
                <span className={form.keterangan.length < 100 ? "text-red-400" : "text-green-500"}>
                  {form.keterangan.length < 100 ? `MINIMAL 100 KARAKTER (KURANG ${100 - form.keterangan.length})` : "DESKRIPSI VALID ✅"}
                </span>
                <span className="text-gray-400">{form.keterangan.length}/100</span>
              </div>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <UploadCloud size={16} /> <span className="text-gray-700">Bukti Foto Penyaluran</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#A3C585]/30 rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all group">
                  <UploadCloud className="text-[#A3C585] group-hover:scale-110 transition-transform mb-2" size={32} />
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Klik untuk Unggah Bukti</p>
                  <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
                </label>

                <div className="h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group">
                  {form.bukti ? (
                    <>
                      <img src={form.bukti} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm({...form, bukti: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      > <X size={14}/> </button>
                    </>
                  ) : (
                    <span className="text-gray-300 text-[10px] font-bold uppercase">No Preview</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
              <button 
                type="button" 
                onClick={() => setOpen(false)}
                className="px-8 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#A3C585] hover:bg-[#8eb074] disabled:bg-gray-200 text-white h-12 px-10 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSubmitting ? "Menyimpan..." : "Simpan Laporan"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
        <InfoCard icon={<Info size={18}/>} title="Akurasi Data" text="Pastikan nominal yang diinput sesuai dengan kwitansi." />
        <InfoCard icon={<Eye size={18}/>} title="Transparansi" text="Foto bukti yang jelas meningkatkan kepercayaan donatur." />
        <InfoCard icon={<CheckCircle2 size={18}/>} title="Saldo Otomatis" text="Saldo program akan berkurang setelah laporan disimpan." />
      </div>

      <footer className="mt-16 text-center">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide uppercase">
            © 2026 NurimanPay • Seluruh Hak Cipta Dilindungi
        </p>
      </footer>
    </div>
  );
}

function InfoCard({ icon, title, text }) {
  return (
    <div className="bg-[#f2f7f0]/50 p-6 rounded-2xl border border-[#e2ece0] transition-all hover:shadow-md">
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-white rounded-lg shadow-sm text-[#A3C585]">{icon}</div>
        <h5 className="text-[11px] font-bold text-[#A3C585] uppercase tracking-wider">{title}</h5>
      </div>
      <p className="text-[11px] text-gray-500 leading-relaxed">{text}</p>
    </div>
  );
}