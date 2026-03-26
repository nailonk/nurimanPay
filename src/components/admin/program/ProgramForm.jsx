import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { CardContent } from "@/components/ui/card";
import { ScrollText, Receipt, FileText, ImageIcon, UploadCloud, Save, Loader2 } from "lucide-react";

function ProgramForm({ onSubmit, initialData = {} }) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    target_amount: "",
    image: "",
    status: "aktif",
  });

  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        target_amount: initialData.target_amount || "",
        image: initialData.image || "",
        status: initialData.status || "aktif",
      });
    }
  }, [initialData]);

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
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.title.trim().length < 5) {
      alert("Judul program terlalu pendek. Minimal harus 5 karakter.");
      return;
    }

    const amount = Number(form.target_amount);
    if (amount < 100000) {
      alert("Target donasi minimal adalah Rp 100.000.");
      return;
    }

    if (!form.description.trim()) {
      alert("Deskripsi program wajib diisi.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        target_amount: amount,
        collected_amount: Number(initialData.collected_amount || 0),
        image: form.image || null,
        status: form.status.toLowerCase(),
      };

      await onSubmit(payload);
    } catch (error) {
      const serverError = error.response?.data?.error || "Gagal menyimpan ke database.";
      alert(serverError);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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
            className="bg-gray-50 border-gray-100 rounded-xl h-12 text-sm focus:border-[#A3C585] outline-none"
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
              className="pl-12 bg-gray-50 border-gray-100 rounded-xl h-12 text-sm font-bold text-[#A3C585] focus:border-[#A3C585]"
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
          />
        </div>

        {/* Upload Foto & Preview */}
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
                  >
                    <span className="sr-only">Hapus</span>
                    ×
                  </button>
                </>
              ) : (
                <span className="text-gray-300 text-[10px] font-bold uppercase tracking-widest">No Preview</span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-50">
          <button 
            type="button" 
            onClick={() => navigate("/admin/program")}
            className="px-8 h-12 rounded-xl text-gray-400 font-bold hover:bg-gray-50 transition-all"
          >
            Batal
          </button>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-[#A3C585] hover:bg-[#8eb074] disabled:bg-gray-200 disabled:cursor-not-allowed text-white h-12 px-10 rounded-xl font-bold shadow-lg shadow-green-100 flex items-center gap-2 transition-all active:scale-95"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
            {isSubmitting ? "Sedang Menyimpan..." : initialData.id ? "Simpan Perubahan" : "Simpan Program"}
          </button>
        </div>
      </form>
    </CardContent>
  );
}

export default ProgramForm;