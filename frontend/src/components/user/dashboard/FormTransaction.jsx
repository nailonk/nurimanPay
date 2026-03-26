import { ArrowLeft, ArrowRight, Shield, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import logo from "@/assets/logo.png"
import { useNavigate, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { transactionApi } from "@/api/transaction"

const nominalList = [10000, 20000, 50000, 100000]

const formatRupiah = (angka) => {
  return `Rp ${new Intl.NumberFormat("id-ID").format(angka)}`
}

const FormTransaction = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // AMBIL PROGRAM ID DARI STATE NAVIGATION
  const programId = location.state?.programId

  // --- PENGECEKAN AWAL ---
  useEffect(() => {
    if (!programId) {
      // Jika tidak ada programId, arahkan kembali ke home
      console.warn("Akses ditolak: Program ID tidak ditemukan.")
      navigate("/", { replace: true })
    }
  }, [programId, navigate])

  // STATE FORM
  const [nominal, setNominal] = useState("")
  const [selectedNominal, setSelectedNominal] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  
  // STATE UI & ERROR
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState("")

  // HANDLE NOMINAL INPUT (Masking Rupiah)
  const handleNominalChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value) {
      const formatted = new Intl.NumberFormat("id-ID").format(value)
      setNominal(`Rp ${formatted}`)
      setSelectedNominal(null)
    } else {
      setNominal("")
    }
  }

  // AMBIL ANGKA SAJA (Untuk dikirim ke backend)
  const getRawNominal = () => {
    return nominal.replace(/\D/g, "")
  }

  // VALIDASI FORM
  const validate = () => {
    const newErrors = {}
    const rawNominal = getRawNominal()

    if (!rawNominal || Number(rawNominal) < 1000) {
      newErrors.nominal = "Minimal donasi Rp 1.000"
    }
    if (!name.trim()) {
      newErrors.name = "Nama wajib diisi"
    }
    if (!phone.trim()) {
      newErrors.phone = "Nomor wajib diisi"
    } else if (!/^08[0-9]{8,13}$/.test(phone)) {
      newErrors.phone = "Format nomor tidak valid (08xxx)"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // SUBMIT KE BACKEND
  const handleSubmit = async () => {
    if (!validate()) return

    setLoading(true)
    setApiError("")

    const payload = {
      amount: Number(getRawNominal()),
      name,
      phone_number: phone,
      message,
      program_id: programId, // KIRIM PROGRAM ID KE BACKEND
    }

    try {
      const response = await transactionApi.create(payload)
      
      if (response.data.success) {
        // Ambil redirect_url dari response backend
        const redirectUrl = response.data.redirect_url || response.data.data?.redirect_url
        
        if (redirectUrl) {
          window.location.href = redirectUrl 
        } else {
          alert("Transaksi berhasil dibuat!")
          navigate("/") 
        }
      }
    } catch (error) {
      console.error("Submission Error:", error)
      const errorMsg = error.response?.data?.error || "Gagal memproses transaksi. Coba lagi nanti."
      setApiError(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  // Jika programId belum ada (saat proses redirect useEffect), jangan rendern form dulu
  if (!programId) return null

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">

        {/* HEADER */}
        <div className="mb-5 pb-3 border-b border-gray-300">
          <div className="flex items-center justify-center relative">
            <ArrowLeft
              className="w-5 h-5 absolute left-0 cursor-pointer text-gray-600 hover:text-black"
              onClick={() => navigate(-1)} // Kembali ke halaman sebelumnya
            />
            <h1 className="text-sm font-bold">Donasi Masjid Nurul Iman</h1>
          </div>
        </div>

        {/* LOGO & DESCRIPTION */}
        <div className="text-center mb-6">
          <img src={logo} className="w-14 h-14 mx-auto mb-3" alt="Logo" />
          <h2 className="font-bold text-base text-gray-800">Infaq & Sedekah</h2>
          <p className="text-xs text-gray-500 mt-1">
            Mari bantu kemakmuran masjid melalui donasi terbaik Anda.
          </p>
        </div>

        {/* NOMINAL CEPAT */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-700 mb-2">Pilih Nominal Cepat</p>
          <div className="grid grid-cols-2 gap-3">
            {nominalList.map((item, i) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setSelectedNominal(item)
                  setNominal(formatRupiah(item))
                  setErrors({ ...errors, nominal: null })
                }}
                className={`h-10 rounded-lg border text-xs font-medium transition
                  ${selectedNominal === item
                    ? "bg-[#A3C585] text-white border-[#A3C585]"
                    : "border-[#A3C585] text-[#7da85f] hover:bg-[#eef6e9]"
                  }`}
              >
                {formatRupiah(item)}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT NOMINAL LAINNYA */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">Nominal Lainnya</p>
          <Input
            value={nominal}
            onChange={handleNominalChange}
            placeholder="Contoh: Rp 25.000"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.nominal && <p className="text-[10px] text-red-500 mt-1">{errors.nominal}</p>}
        </div>

        {/* NAMA LENGKAP */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">Nama Lengkap</p>
          <Input
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setErrors({ ...errors, name: null })
            }}
            placeholder="Hamba Allah"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
        </div>

        {/* NOMOR WHATSAPP */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</p>
          <Input
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value.replace(/\D/g, ""))
              setErrors({ ...errors, phone: null })
            }}
            placeholder="08xxxxxxxxxx"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
        </div>

        {/* PESAN / DOA */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-700 mb-1">Pesan / Doa (Opsional)</p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Semoga berkah..."
            className="bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585] resize-none"
          />
        </div>

        {/* ERROR MESSAGE DARI API */}
        {apiError && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-[10px] text-red-600 text-center">
            {apiError}
          </div>
        )}

        {/* SECURITY INFO */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 mb-5">
          <Shield className="w-3 h-3 text-[#A3C585]" />
          <span>DONASI AMAN & TERPERCAYA</span>
        </div>

        {/* SUBMIT BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={loading || !nominal || !name || !phone}
          className="w-full bg-[#A3C585] hover:bg-[#92b874] text-white h-11 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Lanjutkan Donasi
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

export default FormTransaction