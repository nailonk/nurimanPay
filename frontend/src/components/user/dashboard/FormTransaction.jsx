import { useEffect, useState } from "react" 
import { useSearchParams } from "react-router-dom"
import { ArrowRight, Shield, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog"
import logo from "@/assets/logo.png"
import { transactionApi } from "@/api/transaction"

const nominalList = [10000, 20000, 50000, 100000]

const formatRupiah = (angka) => {
  return `Rp ${new Intl.NumberFormat("id-ID").format(angka)}`
}

const FormTransaction = ({ programId }) => {
  const [nominal, setNominal] = useState("")
  const [selectedNominal, setSelectedNominal] = useState(null)
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState("")
  
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  
  // State Alert
  const [showSuccessAlert, setShowSuccessAlert] = useState(false)
  const [showErrorAlert, setShowErrorAlert] = useState(false)
  const [apiError, setApiError] = useState("")

  // LOGIC DETEKSI STATUS DARI MIDTRANS (URL) 
  useEffect(() => {
    const status = searchParams.get("transaction_status");
    const orderId = searchParams.get("order_id"); 

    if (orderId && status) {
      const syncStatus = async () => {
        setLoading(true);
        try {
          await transactionApi.checkStatus(orderId); 
          
          if (status === "settlement" || status === "capture") {
            setShowSuccessAlert(true);
          } else if (["deny", "cancel", "expire"].includes(status)) {
            setApiError("Transaksi gagal atau kedaluwarsa.");
            setShowErrorAlert(true);
          }
        } catch (err) {
          console.error("Gagal sinkronisasi status:", err);
        } finally {
          setLoading(false);
          setSearchParams({}); 
        }
      };

      syncStatus();
    }
  }, [searchParams, setSearchParams]);

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

  const getRawNominal = () => nominal.replace(/\D/g, "")

  const validate = () => {
    const newErrors = {}
    const rawNominal = getRawNominal()
    if (!rawNominal || Number(rawNominal) < 1000) newErrors.nominal = "Minimal donasi Rp 1.000"
    if (!name.trim()) newErrors.name = "Nama wajib diisi"
    if (!phone.trim()) {
      newErrors.phone = "Nomor wajib diisi"
    } else if (!/^08[0-9]{8,13}$/.test(phone)) {
      newErrors.phone = "Format nomor tidak valid (08xxx)"
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // PROSES KIRIM DATA & REDIRECT
  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    setApiError("")

    const payload = {
      amount: Number(getRawNominal()),
      name,
      phone_number: phone,
      message,
      program_id: programId,
    }

    try {
      const response = await transactionApi.create(payload)
      const snapToken = response.data.snap_token || response.data.data?.token;
      if (snapToken && window.snap) {
        window.snap.pay(snapToken, {
          onSuccess: function () {
            setShowSuccessAlert(true);
            setLoading(false);
          },
          onPending: function (result) {
            console.log("Pending:", result);
            setLoading(false);
          },
          onError: function () {
            setApiError("Pembayaran gagal diproses.");
            setShowErrorAlert(true);
            setLoading(false);
          },
          onClose: function () {
            setLoading(false);
          }
        });
      } else {
        const url = response.data.redirect_url || response.data.data?.redirect_url
        if (url) window.location.href = url 
      }
    } catch (error) {
      setApiError(error.response?.data?.error || "Gagal menghubungi server.")
      setShowErrorAlert(true)
      setLoading(false)
    }
  }
  return (
    <div className="w-full max-w-sm mx-auto bg-white p-2">
      {/* HEADER */}
      <div className="text-center mb-6">
        <img src={logo} className="w-14 h-14 mx-auto mb-3" alt="Logo" />
        <h2 className="font-bold text-base text-gray-800">Infaq & Sedekah</h2>
        <p className="text-xs text-gray-500 mt-1">Mari bantu kemakmuran masjid melalui donasi terbaik Anda.</p>
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

      {/* INPUTS */}
      <div className="space-y-4 mb-6">
        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Nominal Lainnya</p>
          <Input value={nominal} onChange={handleNominalChange} placeholder="Contoh: Rp 25.000" className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]" />
          {errors.nominal && <p className="text-[10px] text-red-500 mt-1">{errors.nominal}</p>}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Nama Lengkap</p>
          <Input value={name} onChange={(e) => { setName(e.target.value); setErrors({ ...errors, name: null }) }} placeholder="Hamba Allah" className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]" />
          {errors.name && <p className="text-[10px] text-red-500 mt-1">{errors.name}</p>}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Nomor WhatsApp</p>
          <Input value={phone} onChange={(e) => { setPhone(e.target.value.replace(/\D/g, "")); setErrors({ ...errors, phone: null }) }} placeholder="08xxxxxxxxxx" className="h-10 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585]" />
          {errors.phone && <p className="text-[10px] text-red-500 mt-1">{errors.phone}</p>}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-700 mb-1">Pesan / Doa (Opsional)</p>
          <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Semoga berkah..." className="bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-[#A3C585] resize-none" />
        </div>
      </div>

      <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-gray-500 mb-5">
        <Shield className="w-3 h-3 text-[#A3C585]" />
        <span>DONASI AMAN & TERPERCAYA</span>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={loading || !nominal || !name || !phone}
        className="w-full bg-[#A3C585] hover:bg-[#92b874] text-white h-11 rounded-lg flex items-center justify-center gap-2"
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</>
        ) : (
          <><ArrowRight className="w-4 h-4" /> Lanjutkan Donasi</>
        )}
      </Button>

      {/* --- ALERT SUCCESS --- */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent className="max-w-[320px] bg-white rounded-2xl border-0 outline-none ring-0 focus:ring-0">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <AlertDialogTitle className="text-center">Terima Kasih!</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs">
              Donasi Anda telah kami terima. Semoga menjadi amal jariyah yang berkah.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowSuccessAlert(false)}
              className="w-full bg-[#A3C585] hover:bg-[#92b874] border-0 outline-none"
            >
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- ALERT ERROR --- */}
      <AlertDialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <AlertDialogContent className="max-w-[320px] bg-white rounded-2xl border-0 outline-none ring-0 focus:ring-0">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-red-600">Transaksi Bermasalah</AlertDialogTitle>
            <AlertDialogDescription className="text-center text-xs">
              {apiError}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction 
              onClick={() => setShowErrorAlert(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 border-0 outline-none"
            >
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FormTransaction;