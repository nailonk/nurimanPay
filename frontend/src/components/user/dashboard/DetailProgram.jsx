import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ShieldCheck, CircleAlert, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const programs = [
  {
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const DetailProgram = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [donatur, setDonatur] = useState([]);
  const [totalDonatur, setTotalDonatur] = useState(0);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getPrograms();
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const found = list.find((item) => String(item.id) === String(id));
        setData(found);

        const donaturRes = await transactionApi.getDonaturByProgram(id);
        const donaturData = donaturRes?.data?.data || [];
        const validDonatur = donaturData
          .filter((d) => d.status === "success")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setDonatur(validDonatur.slice(0, 5));
        setTotalDonatur(validDonatur.length);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
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

  const progress = Math.round(
    (Number(data.collected_amount) / Number(data.target_amount)) * 100
  ) || 0;

  return (
    <div className="bg-[#f5f6f7] min-h-screen py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* HERO */}
        <div className="relative rounded-2xl overflow-hidden shadow-lg">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[320px] md:h-[380px] object-cover"
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
            <Card className="p-5 rounded-xl bg-white shadow-md border-0 ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
              <h2 className="text-lg font-bold text-[#7da85f] mt-1">
                {progress}% <span className="text-gray-400 font-medium text-sm">Tercapai</span>
              </h2>

              <Progress value={progress} className="mt-3 h-2 bg-[#A3C585]/20 [&>div]:bg-[#A3C585]" />

              <div className="flex items-center gap-1 text-xs text-gray-400 mt-3">
                <CircleAlert className="w-3 h-3 text-[#A3C585]" />
                <span className="capitalize">{data.status || "Aktif"}</span>
              </div>

              <div className="grid grid-cols-3 text-sm mt-6 pt-4 border-t border-gray-50">
                <div>
                  <p className="text-gray-500 text-xs uppercase tracking-tight">Terkumpul</p>
                  <p className="font-bold text-[#A3C585]">{formatRupiah(data.collected_amount)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-500 text-xs uppercase tracking-tight">Target</p>
                  <p className="font-bold">{formatRupiah(data.target_amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-xs uppercase tracking-tight">Donatur</p>
                  <p className="font-bold">{totalDonatur}</p>
                </div>
              </div>
            </Card>

              <div className="border-b border-gray-100 pb-2 mb-4">
                <span className="text-[#A3C585] font-bold text-sm border-b-2 border-[#A3C585] pb-2">
                  Deskripsi Program
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">
                {data.description}
              </p>
          </div>

          <div className="space-y-4">
              <Button
                onClick={() => navigate("/form-transaction", { state: { programId: data.id } })}
                className="w-full h-12 bg-[#A3C585] hover:bg-[#8eb16f] text-white shadow-md border-0 transition flex gap-2"
              >
                <Heart size={18} />
                Donasi Sekarang
              </Button>
              <div className="mt-3 h-12 flex gap-2 text-[11px] text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <ShieldCheck size={14} className="text-[#A3C585] shrink-0" />
                <span>Pembayaran aman diproses melalui sistem enkripsi otomatis.</span>
              </div>

            <Card className="p-5 rounded-xl bg-white border-0 shadow-md ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
              <h4 className="font-bold text-gray-800 mb-4 text-sm">Donatur Terakhir</h4>
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
                        <p className="font-bold text-xs text-gray-800">{d.name}</p>
                        <p className="text-[10px] text-gray-400">Menyumbang {formatRupiah(d.amount)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">Belum ada donatur.</p>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProgram;