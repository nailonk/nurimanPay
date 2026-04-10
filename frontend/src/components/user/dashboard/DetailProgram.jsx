import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Heart,
  ShieldCheck,
  CircleAlert,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import FormTransaction from "./FormTransaction";
import { getPrograms } from "@/api/program";
import { transactionApi } from "@/api/transaction";
import noImage from "@/assets/noImage.png";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const DetailProgram = () => {
  const { id } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [donatur, setDonatur] = useState([]);
  const [totalDonatur, setTotalDonatur] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showErrorAlert, setShowErrorAlert] = useState(false);

  const handleSuccessDonasi = () => {
    setShowSuccessAlert(true);
  };

  const handleErrorDonasi = (msg) => {
    setErrorMessage(
      msg ||
        "Maaf, transaksi Anda tidak dapat diproses atau telah kedaluwarsa.",
    );
    setShowErrorAlert(true);
  };

  useEffect(() => {
    const status = searchParams.get("transaction_status");

    if (status) {
      if (status === "settlement" || status === "capture") {
        setShowSuccessAlert(true);

        window.history.pushState(null, "", window.location.pathname);
      } else if (["deny", "cancel", "expire"].includes(status)) {
        setShowErrorAlert(true);
        setSearchParams({}, { replace: true });
      }
    }
  }, [searchParams, setSearchParams]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPrograms();
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const found = list.find((item) => String(item.id) === String(id));
        if (found) setData(found);

        const donaturRes = await transactionApi.getDonaturByProgram(id);
        const donaturData = donaturRes?.data?.data || [];
        const validDonatur = donaturData.filter((d) => {
          const s = d.status?.toLowerCase();
          return s === "success" || s === "settlement" || s === "capture";
        });

        setDonatur(validDonatur.reverse().slice(0, 5));
        setTotalDonatur(validDonatur.length);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#A3C585]" />
        <p className="text-gray-500 animate-pulse">Memuat data program...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Data tidak ditemukan</p>
      </div>
    );
  }

  const progress =
    Math.round(
      (Number(data.collected_amount) / Number(data.target_amount)) * 100,
    ) || 0;

  return (
    <div className="bg-[#f5f6f7] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* GAMBAR */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={data.image || noImage}
            alt={data.title}
            className="w-full h-[320px] md:h-[380px] object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = noImage;
            }}
          />
          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <span className="text-[10px] bg-[#A3C585] text-white px-3 py-1 rounded-sm w-fit mb-2 font-bold tracking-wider">
              PROGRAM DONASI
            </span>
            <h1 className="text-white text-xl md:text-2xl font-bold uppercase">
              {data.title}
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">
          <div className="md:col-span-2 space-y-6">
            <Card className="p-5 rounded-xl bg-white shadow-md border-0 ring-0 outline-0">
              <div className="flex items-baseline gap-2">
                <h2 className="text-xl font-bold text-[#7da85f]">
                  {progress}%
                </h2>
                <span className="text-gray-400 font-medium text-sm">
                  Tercapai
                </span>
              </div>

              <Progress
                value={progress}
                className="mt-3 h-2 bg-[#A3C585]/20 [&>div]:bg-[#A3C585]"
              />

              <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                <CircleAlert className="w-3 h-3 text-[#A3C585]" />
                <span className="capitalize">{data.status || "Aktif"}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-4 border-t border-gray-50">
                <div className="flex flex-col">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Terkumpul
                  </p>
                  <p className="font-bold text-[#A3C585] text-base truncate">
                    {formatRupiah(data.collected_amount)}
                  </p>
                </div>
                <div className="flex flex-col sm:items-center">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Target
                  </p>
                  <p className="font-bold text-gray-700 text-base truncate">
                    {formatRupiah(data.target_amount)}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end">
                  <p className="text-gray-500 text-[10px] uppercase tracking-wider">
                    Donatur
                  </p>
                  <p className="font-bold text-gray-700 text-base">
                    {totalDonatur}{" "}
                    <span className="text-xs font-normal text-gray-400">
                      Orang
                    </span>
                  </p>
                </div>
              </div>
            </Card>

            {/* DESKRIPSI */}
            <div className="space-y-4">
              <div className="inline-block border-b-2 border-[#A3C585] pb-1">
                <span className="text-[#A3C585] font-bold text-sm uppercase tracking-wide">
                  Deskripsi Program
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
            </div>
          </div>

          <div className="space-y-4 pb-10 md:pb-0">
            {/* DIALOG MODAL DONASI */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full h-12 bg-[#A3C585] hover:bg-[#8eb16f] text-white shadow-md border-0 transition flex gap-2">
                  <Heart size={18} />
                  Donasi Sekarang
                </Button>
              </DialogTrigger>
              <DialogContent
                className="bg-white p-0 
                          w-full h-full max-h-screen 
                          sm:max-w-[425px] sm:h-auto sm:max-h-[90vh] 
                          sm:rounded-xl border-0 
                          flex flex-col 
                          outline-none ring-0 focus:ring-0 focus-visible:ring-0"
              >
                <DialogHeader className="p-4 border-b">
                  <DialogTitle className="text-center text-sm font-bold">
                    Form Transaksi Donasi
                  </DialogTitle>
                </DialogHeader>

                {/* SROLLABEL */}
                <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
                  {data && data.id ? (
                    <FormTransaction
                      programId={data.id}
                      onSuccess={handleSuccessDonasi}
                      onError={handleErrorDonasi}
                    />
                  ) : (
                    <div className="flex justify-center p-4">
                      <Loader2 className="animate-spin text-[#A3C585]" />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <div className="mt-3 flex gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <ShieldCheck size={14} className="text-[#A3C585] shrink-0" />
              <span>
                Pembayaran aman diproses melalui sistem enkripsi otomatis.
              </span>
            </div>

            <Card className="p-5 rounded-xl bg-white border-0 shadow-md ring-0 outline-none">
              <h4 className="font-bold text-gray-800 mb-4 text-sm">
                Donatur Terakhir
              </h4>
              <div className="space-y-4">
                {donatur.length > 0 ? (
                  donatur.map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-gray-100">
                        <AvatarFallback className="font-bold text-[#A3C585] bg-[#A3C585]/10 text-xs">
                          {d.name?.substring(0, 2).toUpperCase() || "AN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-bold text-xs text-gray-800">
                          {d.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Menyumbang {formatRupiah(d.amount)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">
                    Belum ada donatur.
                  </p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ALERT SUKSES */}
      <AlertDialog open={showSuccessAlert} onOpenChange={setShowSuccessAlert}>
        <AlertDialogContent className="max-w-[320px] bg-white rounded-2xl border-0 shadow-2xl ring-0 outline-none">
          <AlertDialogHeader className="flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center w-full">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="w-8 h-8 text-green-600" />
              </div>
              <AlertDialogTitle className="text-center font-bold text-lg w-full">
                Terima Kasih!
              </AlertDialogTitle>
              <AlertDialogDescription className="text-center text-xs mt-2 w-full">
                Donasi Anda telah kami terima. Semoga menjadi amal jariyah yang
                berkah.
              </AlertDialogDescription>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowSuccessAlert(false)}
              className="w-full bg-[#A3C585] hover:bg-[#92b874] border-0"
            >
              Tutup
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ALERT GAGAL */}
      <AlertDialog open={showErrorAlert} onOpenChange={setShowErrorAlert}>
        <AlertDialogContent className="max-w-[320px] bg-white rounded-2xl border-0 outline-none shadow-2xl">
          <AlertDialogHeader>
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-2 mx-auto">
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
            <AlertDialogTitle className="text-center text-red-600">
              Transaksi Bermasalah
            </AlertDialogTitle>

            <AlertDialogDescription className="text-center text-xs">
              {errorMessage ||
                "Maaf, transaksi Anda tidak dapat diproses atau telah kedaluwarsa."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => setShowErrorAlert(false)}
              className="w-full bg-gray-800 hover:bg-gray-700 border-0"
            >
              Mengerti
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DetailProgram;
