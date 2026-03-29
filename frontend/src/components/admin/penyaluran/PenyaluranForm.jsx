import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { Calendar, LayoutGrid, User, Receipt, FileText, UploadCloud, X, Save } from "lucide-react"

export default function FormPenyaluran({ editData, editIndex, refresh, setOpen }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    tanggal: "", program: "", tujuan: "", nominal: "", keterangan: "", bukti: "",
  })

  useEffect(() => {
    if (editData) setForm(editData)
  }, [editData])

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  
  const handleNominal = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    setForm({ ...form, nominal: value ? new Intl.NumberFormat("id-ID").format(value) : "" })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setForm({ ...form, bukti: reader.result })
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const data = JSON.parse(localStorage.getItem("penyaluran") || "[]")
    
    if (editData) data[editIndex] = form
    else data.push(form)
    
    localStorage.setItem("penyaluran", JSON.stringify(data))

    setOpen(false) 
    if (refresh) refresh();
  }

  return (
    <div className="w-full bg-white p-8 md:p-12">
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          {/* Tanggal */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
              <Calendar size={16} strokeWidth={2.5} /> <span className="text-gray-700">Tanggal Penyaluran</span>
            </label>
            <input type="date" name="tanggal" value={form.tanggal} onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none transition-all" />
          </div>

          {/* Program */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
              <LayoutGrid size={16} strokeWidth={2.5} /> <span className="text-gray-700">Nama Program Donasi</span>
            </label>
            <select name="program" value={form.program} onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 h-12 text-sm text-gray-500 focus:border-[#A3C585] outline-none transition-all">
              <option value="">Pilih Program Donasi</option>
              <option value="Santunan">Santunan</option>
              <option value="Operasional">Operasional</option>
            </select>
          </div>

          {/* Tujuan */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
              <User size={16} strokeWidth={2.5} /> <span className="text-gray-700">Tujuan Penyaluran</span>
            </label>
            <input type="text" name="tujuan" placeholder="Nama penerima atau lembaga" value={form.tujuan} onChange={handleChange}
              className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-4 h-12 text-sm focus:border-[#A3C585] outline-none transition-all" />
          </div>

          {/* Nominal */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
              <Receipt size={16} strokeWidth={2.5} /> <span className="text-gray-700">Nominal Dana (Rp)</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
              <input type="text" placeholder="0" value={form.nominal} onChange={handleNominal}
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl pl-10 pr-4 h-12 text-sm font-bold text-[#A3C585] focus:border-[#A3C585] outline-none transition-all" />
            </div>
          </div>
        </div>

        {/* Keterangan */}
        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
            <FileText size={16} strokeWidth={2.5} /> <span className="text-gray-700">Keterangan</span>
          </label>
          <textarea name="keterangan" placeholder="Detail penyaluran dana..." value={form.keterangan} onChange={handleChange}
            className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl p-4 text-sm h-32 focus:border-[#A3C585] outline-none resize-none transition-all" />
        </div>

        {/* Upload Bukti */}
        <div className="space-y-2 text-left">
          <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[11px] uppercase tracking-wider">
            <UploadCloud size={16} strokeWidth={2.5} /> <span className="text-gray-700">Upload Bukti Foto</span>
          </label>
          <label className="flex flex-col items-center justify-center w-full h-36 border-2 border-dashed border-[#A3C585]/30 rounded-2xl cursor-pointer hover:bg-green-50/30 transition-all group">
            <div className="flex flex-col items-center justify-center text-center">
              <UploadCloud className="text-[#A3C585] mb-2 group-hover:scale-110 transition-transform" size={32} />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Klik untuk unggah (PNG, JPG - Maks 5MB)</p>
            </div>
            <input type="file" className="hidden" onChange={handleFile} accept="image/*" />
          </label>
          {form.bukti && (
            <div className="relative w-32 h-32 mt-4 rounded-xl overflow-hidden border-2 border-[#A3C585]">
              <img src={form.bukti} className="w-full h-full object-cover" />
              <button type="button" onClick={() => setForm({...form, bukti: ""})} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"><X size={12}/></button>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-4 pt-8 border-t border-gray-50">
          <button 
            type="submit" 
            className="w-full md:w-[240px] justify-center bg-[#A3C585] hover:bg-[#8eb074] text-white h-12 px-8 rounded-xl font-bold shadow-lg shadow-green-100 transition-all flex items-center gap-2 order-1 md:order-2"
          >
            <Save size={18} /> Simpan Laporan
          </button>
          <button 
            type="button" 
            onClick={() => setOpen(false)}
            className="w-full md:w-auto px-10 h-12 rounded-xl text-white bg-red-600 font-bold transition-all order-2 md:order-1"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  )
}