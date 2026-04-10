import { useState, useEffect } from "react";
import { 
  Calendar, LayoutGrid, User, Receipt, FileText, 
  UploadCloud, X, Save, Loader2, AlertCircle 
} from "lucide-react";

export default function FormPenyaluran({ refresh, setOpen }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmStep, setConfirmStep] = useState(false); // State konfirmasi inline
  const [programs, setPrograms] = useState([]);
  const [allDist, setAllDist] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL;
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
        const [resProgram, resDistribusi] = await Promise.all([
          fetch(`${API_URL}/program`),
          fetch(`${API_URL}/distribution`)
        ]);

        const dataP = await resProgram.json();
        const dataD = await resDistribusi.json();

        const rawPrograms = Array.isArray(dataP) ? dataP : (dataP.data || []);
        const rawDistributions = Array.isArray(dataD) ? dataD : (dataD.data || []);
        
        setAllDist(rawDistributions);

        const availablePrograms = rawPrograms.filter(p => {
          const collected = parseFloat(p.collected_amount) || 0;
          const programId = String(p.id).trim();

          const totalTersalurkan = rawDistributions
            .filter(d => String(d.program_id).trim() === programId)
            .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);
          
          const sisaSaldo = collected - totalTersalurkan;
          return collected > 0 && sisaSaldo > 0;
        });

        setPrograms(availablePrograms);
      } catch (err) {
        console.error("Gagal sinkronisasi data:", err);
      }
    };

    fetchPrograms();
  }, [API_URL, refresh]);

  const getSaldo = () => {
    const selected = programs.find(p => String(p.id) === String(form.program));
    if (!selected) return 0;

    const collected = Number(selected.collected_amount) || 0;
    const tersalurkan = allDist
      .filter(d => String(d.program_id || "").trim().toLowerCase() === String(selected.id || "").trim().toLowerCase())
      .reduce((sum, item) => sum + (Number(item.amount) || 0), 0);

    return collected - tersalurkan;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    setConfirmStep(false); 
  };

  const handleNominal = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    setForm(prev => ({
      ...prev,
      nominal: value ? new Intl.NumberFormat("id-ID").format(value) : "",
    }));
    setConfirmStep(false);
  };

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file || file.size > 2 * 1024 * 1024) return; 
    const reader = new FileReader();
    reader.onloadend = () => {
        setForm(prev => ({ ...prev, bukti: reader.result }));
        setConfirmStep(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePreSubmit = async (e) => {
    e.preventDefault();
    const amountStr = form.nominal.replace(/\./g, "");
    const amount = parseInt(amountStr);
    const saldo = getSaldo();

    if (!form.program || !amount || amount > saldo || form.keterangan.length < 100 || !form.bukti) {
      return; 
    }

    if (!confirmStep) {
      setConfirmStep(true);
      return;
    }

    setIsSubmitting(true);
    const token = localStorage.getItem("token");

    try {
      const payload = {
        program_id: form.program,
        purpose: form.tujuan.trim(),
        amount: amount,
        description: form.keterangan.trim(),
        distributed_at: form.tanggal,
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

      if (res.ok) {
        refresh();
        setOpen(false); 
      }
    } catch (err) {
      console.error(err);
      setConfirmStep(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8 mb-20 bg-white">
      <div className="bg-white shadow-sm rounded-[18px] border border-gray-100 overflow-hidden">
        <div className="p-8 bg-white">
          <form onSubmit={handlePreSubmit} className="space-y-6 bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
              <div className="space-y-2 bg-white">
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

              <div className="space-y-2 bg-white">
                <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                  <LayoutGrid size={16}/> <span className="text-gray-700">Program Donasi</span>
                </label>
                <select
                  name="program"
                  value={form.program}
                  onChange={handleChange}
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none cursor-pointer"
                  required
                >
                  <option value="">{programs.length > 0 ? "Pilih Program" : "Tidak ada saldo tersedia"}</option>
                  {programs.map(p => (
                    <option key={p.id} value={String(p.id)}>{p.title}</option>
                  ))}
                </select>
                {form.program && (
                  <p className="text-[10px] text-blue-500 font-bold mt-1 uppercase tracking-tight">
                    SISA SALDO: Rp {getSaldo().toLocaleString("id-ID")}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white">
               <div className="space-y-2 bg-white">
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

              <div className="space-y-2 bg-white">
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

            <div className="space-y-2 bg-white">
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
              <div className="flex justify-between text-[10px] font-bold bg-white">
                <span className={form.keterangan.length < 100 ? "text-red-400" : "text-green-500"}>
                  {form.keterangan.length < 100 ? `MINIMAL 100 KARAKTER (${100 - form.keterangan.length} LAGI)` : "DESKRIPSI VALID"}
                </span>
                <span className="text-gray-400">{form.keterangan.length}/100</span>
              </div>
            </div>

            <div className="space-y-2 bg-white">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <UploadCloud size={16} /> <span className="text-gray-700">Bukti Foto Penyaluran</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#A3C585]/30 rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all group bg-white">
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
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border-none cursor-pointer"
                      > <X size={14}/> </button>
                    </>
                  ) : (
                    <span className="text-gray-300 text-[10px] font-bold uppercase">No Preview</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50 bg-white">
              <button 
                type="button" 
                onClick={() => setOpen(false)}
                className="px-8 h-12 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all border-none cursor-pointer"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className={`h-12 px-10 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95 border-none cursor-pointer text-white 
                  ${confirmStep ? 'bg-orange-500 hover:bg-orange-600 animate-pulse' : 'bg-[#A3C585] hover:bg-[#8eb074]'}`}
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (confirmStep ? <AlertCircle size={18}/> : <Save size={18} />)}
                {isSubmitting ? "Menyimpan..." : (confirmStep ? "Klik Sekali Lagi untuk Konfirmasi" : "Simpan Laporan")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}