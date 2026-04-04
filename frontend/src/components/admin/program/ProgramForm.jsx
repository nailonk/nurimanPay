import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { 
  ScrollText, Receipt, FileText, ImageIcon, 
  UploadCloud, Save, Loader2, ArrowLeft, Info, Eye, CheckCircle2 
} from "lucide-react";
import api from "@/api/axios";

function ProgramForm() {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const isEdit = Boolean(id); 

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEdit);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    target_amount: "",
    image: "",
    status: "aktif",
    collected_amount: 0
  });

  useEffect(() => {
    if (isEdit) {
      const fetchProgram = async () => {
        try {
          const response = await api.get(`/program/${id}`);
          const data = response.data?.data || response.data;
          setForm({
            title: data.title || "",
            description: data.description || "",
            target_amount: data.target_amount || "",
            image: data.image || "",
            status: data.status || "aktif",
            collected_amount: data.collected_amount || 0
          });
        } catch {
          alert("Gagal mengambil data program.");
          navigate("/admin/program");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchProgram();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert("File terlalu besar. Maksimal 5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.title.trim().length < 5) return alert("Judul minimal 5 karakter.");
    if (Number(form.target_amount) < 100000) return alert("Target minimal Rp 100.000.");

    setIsSubmitting(true);
    try {
      const payload = {
        ...form,
        target_amount: Number(form.target_amount),
        title: form.title.trim(),
        description: form.description.trim(),
      };

      if (isEdit) {
        await api.put(`/program/${id}`, payload);
        alert("Program berhasil diperbarui!");
      } else {
        await api.post("/program/create", payload);
        alert("Program berhasil ditambahkan!");
      }
      navigate("/admin/program");
    } catch (error) {
      const msg = error.response?.data?.error || "Gagal menyimpan data.";
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
      <Loader2 className="w-10 h-10 animate-spin text-[#A3C585]" />
      <p className="text-sm font-medium">Memuat data program...</p>
    </div>
  );

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
        <h1 className="text-2xl font-bold text-gray-800">
          {isEdit ? "Edit Program Donasi" : "Tambah Program Donasi"}
        </h1>
        <p className="text-gray-500 text-sm">
          {isEdit ? "Perbarui informasi program agar tetap akurat." : "Lengkapi formulir di bawah untuk membuat kampanye donasi baru."}
        </p>
      </div>

      <div className="bg-white shadow-sm rounded-[32px] border border-gray-100 overflow-hidden">
        <CardContent className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Nama Program */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <ScrollText size={16} /> <span className="text-gray-700">Nama Program Donasi</span>
              </label>
              <Input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Contoh: Renovasi Atap Masjid"
                className="bg-gray-50 border-gray-100 rounded-xl h-12 text-sm focus:border-[#A3C585]"
                required
              />
            </div>

            {/* Target Donasi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <Receipt size={16} /> <span className="text-gray-700">Target Donasi (Rp)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                <Input
                  name="target_amount"
                  type="number"
                  value={form.target_amount}
                  onChange={handleChange}
                  placeholder="0"
                  className="pl-12 bg-gray-50 border-gray-100 rounded-xl h-12 text-sm font-bold text-[#A3C585]"
                  required
                />
              </div>
            </div>

            {/* Deskripsi */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <FileText size={16} /> <span className="text-gray-700">Deskripsi Lengkap</span>
              </label>
              <Textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                placeholder="Tuliskan detail program di sini..."
                className="bg-gray-50 border-gray-100 rounded-xl p-4 text-sm focus:border-[#A3C585] resize-none"
                required
              />
            </div>

            {/* Upload Foto */}
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
                <ImageIcon size={16} /> <span className="text-gray-700">Foto Utama Program</span>
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-[#A3C585]/30 rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all group">
                  <UploadCloud className="text-[#A3C585] group-hover:scale-110 transition-transform mb-2" size={32} />
                  <p className="text-[10px] text-gray-400 font-bold uppercase text-center px-4">Klik untuk Unggah Foto</p>
                  <input type="file" className="hidden" onChange={handleImage} accept="image/*" />
                </label>

                <div className="h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative group">
                  {form.image ? (
                    <>
                      <img src={form.image} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setForm({...form, image: ""})}
                        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      > × </button>
                    </>
                  ) : (
                    <span className="text-gray-300 text-[10px] font-bold uppercase">No Preview</span>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
              <button 
                type="button" 
                onClick={() => navigate("/admin/program")}
                className="px-8 h-12 rounded-xl bg-red-600 text-white font-bold transition-all"
              >
                Batal
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="bg-[#A3C585] hover:bg-[#8eb074] disabled:bg-gray-200 text-white h-12 px-10 rounded-xl font-bold shadow-lg flex items-center gap-2 transition-all active:scale-95"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                {isSubmitting ? "Sedang Menyimpan..." : isEdit ? "Simpan Perubahan" : "Simpan Program"}
              </button>
            </div>
          </form>
        </CardContent>
      </div>

      {/* Info Cards */}
      {!isEdit && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10">
          <InfoCard icon={<Info size={18}/>} title="Tips Deskripsi" text="Jelaskan urgensi program untuk menarik minat donatur." />
          <InfoCard icon={<Eye size={18}/>} title="Visual Terbuka" text="Gunakan foto asli kondisi masjid untuk kepercayaan jamaah." />
          <InfoCard icon={<CheckCircle2 size={18}/>} title="Verifikasi" text="Program akan langsung tayang secara otomatis di portal." />
        </div>
      )}

      <footer className="mt-16 text-center">
        <p className="text-[11px] text-gray-400 font-medium tracking-wide">
          © 2026 NURIMANPAY • SYSTEM MANAGEMENT DONASI
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

export default ProgramForm;