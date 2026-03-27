import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Heart, ShieldCheck, CircleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPrograms } from "@/api/program";
import { transactionApi } from "@/api/transaction";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPrograms();

        const list = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];

        const found = list.find(
          (item) => String(item.id) === String(id)
        );

        setData(found);

        // ambil donatur
        const donaturRes = await transactionApi.getDonaturByProgram(id);
        console.log("DONATUR RESPONSE:", donaturRes.data); 

        const donaturData = donaturRes?.data?.data || [];

        const validDonatur = donaturData
          .filter((d) => d.status === "success")
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setDonatur(validDonatur.slice(0, 5));
        setTotalDonatur(validDonatur.length);

      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, [id]);

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
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={data.image}
            alt={data.title}
            className="w-full h-[320px] md:h-[380px] object-cover"
          />

          <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-6">
            <span className="text-[10px] bg-[#A3C585] text-white px-3 py-1 rounded-sm w-fit mb-2">
              PEMBANGUNAN
            </span>

            <h1 className="text-white text-xl md:text-2xl font-bold">
              {data.title}
            </h1>
          </div>
        </div>

        {/* CONTENT */}
        <div className="grid md:grid-cols-3 gap-6 mt-6">

          {/* LEFT */}
          <div className="md:col-span-2 space-y-6">

            <Card className="p-5 rounded-xl bg-white shadow-md border-0 hover:shadow-lg transition ring-0 focus-visible:ring-0 focus:outline-none">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  Progress Pembangunan
                </p>
              </div>

              <h2 className="text-lg font-bold text-[#7da85f] mt-1">
                {progress}%{" "}
                <span className="text-gray-400 font-medium">
                  Tercapai
                </span>
              </h2>

              <Progress
                value={progress}
                className="mt-3 h-2 bg-[#A3C585]/20 [&>div]:bg-[#A3C585]"
              />

              <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                <CircleAlert className="w-3 h-3 text-[#A3C585]" />
                <span>{data.status}</span>
              </div>

              <div className="grid grid-cols-3 text-sm mt-4">
                <div>
                  <p className="text-gray-600">Terkumpul</p>
                  <p className="font-bold">
                    {formatRupiah(data.collected_amount)}
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-gray-600">Target</p>
                  <p className="font-bold">
                    {formatRupiah(data.target_amount)}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-gray-600">Donatur</p>
                  <p className="font-bold">{totalDonatur}</p>
                </div>
              </div>
            </Card>

            <div>
              <div className="border-b border-gray-200">
                <span className="text-[#7da85f] font-semibold text-sm pb-1 border-b-2 border-[#7da85f]">
                  Deskripsi
                </span>
              </div>

              <p className="text-gray-600 pt-4 text-sm leading-relaxed">
                {data.description || data.desc}
              </p>
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-4">

            <div className="p-5">
              <Button
                onClick={() => navigate("/form-transaction", { state: { programId: data.id } })} 
                className="w-full h-12 bg-[#A3C585] text-white shadow-md border-0 hover:shadow-lg transition"
              >
                <Heart size={16} />
                Donasi Sekarang
              </Button>

              <div className="mt-3 flex gap-2 text-xs text-gray-500 bg-[#A3C585]/10 p-3 rounded-lg">
                <ShieldCheck size={16} className="text-[#A3C585]" />
                <span>Transaksi aman & terpercaya</span>
              </div>
            </div>

            <Card className="p-5 rounded-xl bg-white border-0 shadow-md hover:shadow-lg transition ring-0 focus-visible:ring-0 focus:outline-none">
              <h4 className="font-semibold mb-3">
                Donatur Terakhir
              </h4>
              <div className="space-y-3">
                {donatur.map((d, i) => (
                  <div key={i} className="flex gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="font-bold text-[#A3C585] bg-gray-50">
                        {d.name?.[0] || "A"}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <p className="font-bold text-sm">{d.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatRupiah(d.amount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailProgram;