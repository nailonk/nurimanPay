import { useState, useEffect } from "react"
import { Calendar, LayoutGrid, User, Receipt, FileText, UploadCloud, X, Save } from "lucide-react"

export default function FormPenyaluran({ editData, refresh, setOpen }) {

  const isEdit = !!editData

  const [form, setForm] = useState({
    tanggal: "",
    program: "",
    tujuan: "",
    nominal: "",
    keterangan: "",
    bukti: "",
  })

  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (editData) {
      setForm({
        tanggal: editData.distributed_at || "",
        program: editData.program_id ? String(editData.program_id) : "",
        tujuan: editData.purpose || "",
        nominal: editData.amount
          ? new Intl.NumberFormat("id-ID").format(editData.amount)
          : "",
        keterangan: editData.description || "",
        bukti: editData.bukti || "",
      })
    }

    fetchPrograms()
  }, [editData])

  const fetchPrograms = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/program")
      const data = await res.json()

      const filtered = (data.data || []).filter(p => {
        const target = p.target_amount || 0
        const collected = p.collected_amount || 0
        if (target === 0) return false
        return (collected / target) * 100 >= 100
      })

      setPrograms(filtered)
    } catch (err) {
      console.error("Gagal ambil program:", err)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleNominal = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    setForm(prev => ({
      ...prev,
      nominal: value ? new Intl.NumberFormat("id-ID").format(value) : "",
    }))
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm(prev => ({ ...prev, bukti: reader.result }))
    }
    reader.readAsDataURL(file)
  }

  // menghitung sisa saldo program (target - collected - distribusi lain)
  const getSaldo = () => {
    const selected = programs.find(p => String(p.id) === String(form.program))
    if (!selected) return 0

    let saldo = (selected.collected_amount || 0) - (selected.distributed_amount || 0)

    if (editData) {
      saldo += editData.amount || 0
    }

    return saldo
  }

  // validasi dan submit form
  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem("token")
    if (!token) return alert("Kamu belum login ❌")

    if (!form.program) return alert("Program wajib dipilih ❌")
    if (!form.tanggal) return alert("Tanggal wajib diisi ❌")
    if (!form.tujuan) return alert("Tujuan wajib diisi ❌")
    if (!form.nominal) return alert("Nominal wajib diisi ❌")
    if (!form.keterangan) return alert("Deskripsi wajib diisi ❌")
    if (!form.bukti) return alert("Bukti wajib diupload ❌")

    if (form.keterangan.length < 100) {
      return alert("Deskripsi minimal 100 karakter ❌")
    }

    const amount = parseInt(form.nominal.replace(/\./g, ""))
    if (isNaN(amount) || amount <= 0) {
      return alert("Nominal tidak valid ❌")
    }

    const saldo = getSaldo()
    if (amount > saldo) {
      return alert(`Saldo tidak cukup ❌ Sisa: Rp ${saldo.toLocaleString("id-ID")}`)
    }

    const payload = {
      program_id: form.program,
      purpose: form.tujuan, 
      amount: amount,
      description: form.keterangan,
      distributed_at: form.tanggal,
      bukti: form.bukti,
    }

    try {
      setLoading(true)

      const url = isEdit
        ? `http://localhost:5000/api/distribution/${editData.id}`
        : "http://localhost:5000/api/distribution/create"

      const method = isEdit ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok) {
        return alert(data.error || "Terjadi kesalahan server ❌")
      }

      alert(isEdit ? "Berhasil update ✅" : "Berhasil simpan ✅")

      refresh && refresh()
      setOpen(false)

    } catch (err) {
      console.error(err)
      alert("Server error ❌")
    } finally {
      setLoading(false)
    }
  }

return (
  <div className="max-w-4xl mx-auto py-8 md:py-10 mb-20 px-4 md:px-6 animate-in fade-in zoom-in duration-300">

    <div className="bg-white shadow-sm rounded-2xl md:rounded-[28px] border border-gray-100">
      <div className="p-5 md:p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
                <Calendar size={14}/> 
                <span className="text-gray-700">Tanggal Penyaluran</span>
              </label>
              <input 
                type="date"
                name="tanggal"
                value={form.tanggal}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-11 text-sm focus:border-[#A3C585] focus:ring-2 focus:ring-[#A3C585]/20 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
                <LayoutGrid size={14}/> 
                <span className="text-gray-700">Nama Program Donasi</span>
              </label>
              <select
                name="program"
                value={form.program}
                onChange={handleChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-11 text-sm focus:border-[#A3C585] focus:ring-2 focus:ring-[#A3C585]/20 outline-none"
              >
                <option value="">Pilih Program Donasi</option>
                {programs.map(p => (
                  <option key={p.id} value={String(p.id)}>
                    {p.title}
                  </option>
                ))}
              </select>

              {form.program && (
                <p className="text-[11px] text-gray-400 mt-1">
                  Sisa dana: Rp {getSaldo().toLocaleString("id-ID")}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
                <User size={14}/> 
                <span className="text-gray-700">Tujuan Penyaluran</span>
              </label>
              <input
                type="text"
                name="tujuan"
                value={form.tujuan}
                onChange={handleChange}
                placeholder="Nama penerima atau lembaga"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 h-11 text-sm focus:border-[#A3C585] focus:ring-2 focus:ring-[#A3C585]/20 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
                <Receipt size={14}/> 
                <span className="text-gray-700">Nominal Dana (Rp)</span>
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">Rp</span>
                <input
                  type="text"
                  value={form.nominal}
                  onChange={handleNominal}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 h-11 text-sm font-semibold text-black focus:border-[#A3C585] focus:ring-2 focus:ring-[#A3C585]/20 outline-none"
                />
              </div>
            </div>

          </div>

          {/* KETERANGAN */}
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
              <FileText size={14}/> 
              <span className="text-gray-700">Keterangan</span>
            </label>

            <textarea
              name="keterangan"
              value={form.keterangan}
              onChange={handleChange}
              rows={4}
              placeholder="Detail laporan keberhasilan penyaluran dana..."
              className={`w-full bg-gray-50 border rounded-xl p-4 text-sm resize-none outline-none
                ${form.keterangan.length > 0 && form.keterangan.length < 100 
                  ? "border-red-300 focus:border-red-400 focus:ring-red-200" 
                  : "border-gray-200 focus:border-[#A3C585] focus:ring-[#A3C585]/20"
                }`}
            />

            <div className="flex justify-between items-center">
              <span className={`text-[10px] font-medium ${
                form.keterangan.length < 100 ? "text-red-400" : "text-green-500"
              }`}>
                {form.keterangan.length < 100
                  ? `Minimal 100 karakter (kurang ${100 - form.keterangan.length})`
                  : "Deskripsi sudah valid ✅"}
              </span>

              <span className="text-[10px] text-gray-400">
                {form.keterangan.length}/100
              </span>
            </div>
          </div>

          {/* UPLOAD */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[#A3C585] font-bold text-[10px] uppercase tracking-wider">
              <UploadCloud size={14}/> 
              <span className="text-gray-700">Upload Bukti Foto</span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <label className="flex flex-col items-center justify-center w-full h-36 md:h-40 border-2 border-dashed border-[#A3C585]/40 rounded-2xl cursor-pointer bg-[#f6fbf4] hover:bg-[#eef7ea] transition group">
                <UploadCloud className="text-[#A3C585] group-hover:scale-110 transition mb-2" size={28} />
                <p className="text-[10px] text-gray-500 font-semibold text-center">
                  Klik untuk unggah atau seret file
                </p>
                <input type="file" className="hidden" onChange={handleFile} />
              </label>

              <div className="h-36 md:h-40 bg-gray-50 rounded-2xl overflow-hidden border border-gray-200 flex items-center justify-center relative group">
                {form.bukti ? (
                  <>
                    <img src={form.bukti} className="w-full h-full object-cover"/>
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, bukti: "" }))}
                      className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow opacity-0 group-hover:opacity-100 transition"
                    >
                      <X size={12}/>
                    </button>
                  </>
                ) : (
                  <span className="text-gray-300 text-[10px] font-bold uppercase">
                    Preview
                  </span>
                )}
              </div>

            </div>
          </div>

          {/* BUTTON */}
          <div className="flex flex-col-reverse md:flex-row md:justify-end gap-3 pt-6 border-t border-gray-100">

            <button 
              type="button"
              onClick={() => setOpen(false)}
              className="w-full md:w-auto px-6 h-11 rounded-xl bg-gray-200 text-gray-600 font-semibold hover:bg-gray-300 transition"
            >
              Batal
            </button>

            <button 
              type="submit"
              disabled={loading}
              className="w-full md:w-auto bg-[#A3C585] hover:bg-[#8eb074] text-white h-11 px-8 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2 transition active:scale-95"
            >
              <Save size={16}/>
              {loading 
                ? "Menyimpan..." 
                : isEdit 
                  ? "Simpan Perubahan" 
                  : "Simpan Laporan"}
            </button>

          </div>

        </form>
      </div>
    </div>

    <footer className="mt-12 md:mt-16 text-center">
      <p className="text-[10px] text-gray-400 font-medium tracking-wide">
        © 2026 NurimanPay. Seluruh Hak Cipta Dilindungi.
      </p>
    </footer>

  </div>
)
}