import { ArrowLeft, ArrowRight, Shield } from "lucide-react"
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

  const [nominal, setNominal] = useState("")
  const [selectedNominal, setSelectedNominal] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  const [errors, setErrors] = useState({})

  // HANDLE NOMINAL INPUT
  const handleNominalChange = (e) => {
    let value = e.target.value.replace(/\D/g, "")

    if (value) {
      value = new Intl.NumberFormat("id-ID").format(value)
      setNominal(`Rp ${value}`)
      setSelectedNominal(null)
    } else {
      setNominal("")
    }
  }

  // RAW NOMINAL (UNTUK BACKEND)
  const getRawNominal = () => {
    return nominal.replace(/\D/g, "")
  }

  // VALIDATION
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
      newErrors.phone = "Format nomor tidak valid"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // SUBMIT
  const handleSubmit = () => {
    if (!validate()) return

    const payload = {
      nominal: Number(getRawNominal()),
      name,
      phone,
      message,
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

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex justify-center px-4 py-10 md:py-16">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-md p-6">

        {/* HEADER */}
        <div className="mb-5 pb-3 border-b border-gray-300">
          <div className="flex items-center justify-center relative">
            <ArrowLeft
              className="w-5 h-5 absolute left-0 cursor-pointer text-gray-600"
              onClick={() => navigate("/")}
            />
            <h1 className="text-sm font-bold">
              Donasi Masjid Nurul Iman
            </h1>
          </div>
        </div>

        {/* LOGO */}
        <div className="text-center mb-6">
          <img src={logo} className="w-14 h-14 mx-auto mb-3" />
          <h2 className="font-bold text-base text-gray-800">
            Infaq & Sedekah
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Mari bantu kemakmuran masjid melalui donasi terbaik Anda.
          </p>
        </div>

        {/* NOMINAL CEPAT */}
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-700 mb-2">
            Pilih Nominal Cepat
          </p>

          <div className="grid grid-cols-2 gap-3">
            {nominalList.map((item, i) => (
              <button
                key={i}
                onClick={() => {
                  setSelectedNominal(item)
                  setNominal(formatRupiah(item))
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

        {/* INPUT NOMINAL */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Nominal Lainnya
          </p>
          <Input
            value={nominal}
            onChange={handleNominalChange}
            placeholder="Masukkan jumlah"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.nominal && (
            <p className="text-xs text-red-500 mt-1">{errors.nominal}</p>
          )}
        </div>

        {/* NAMA */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Nama Lengkap
          </p>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Hamba Allah"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
          )}
        </div>

        {/* NOMOR */}
        <div className="mb-4">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Nomor WhatsApp
          </p>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            placeholder="08xxxxxxxxxx"
            className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
          )}
        </div>

        {/* PESAN */}
        <div className="mb-5">
          <p className="text-xs font-medium text-gray-700 mb-1">
            Pesan / Doa
          </p>
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Opsional..."
            className="bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]"
          />
        </div>

        {/* INFO */}
        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 mb-5">
          <Shield className="w-3 h-3 text-[#A3C585]" />
          <span>DONASI AMAN & TERPERCAYA</span>
        </div>

        {/* BUTTON */}
        <Button
          onClick={handleSubmit}
          disabled={!nominal || !name || !phone}
          className="w-full bg-[#A3C585] hover:bg-[#92b874] text-white h-11 rounded-lg flex items-center justify-center gap-2 disabled:opacity-50"
        >
          Lanjutkan Donasi
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}

export default FormTransaction