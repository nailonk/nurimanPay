import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Loader2, Table as TableIcon, Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getPrograms } from "@/api/program";
import { transactionApi } from "@/api/transaction";
import { distributionApi } from "@/api/distribution";
import noImage from "@/assets/noImage.png";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const DetailCompletedProgram = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [donatur, setDonatur] = useState([]);
  const [distributions, setDistributions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getPrograms();
        const list = Array.isArray(res.data) ? res.data : res.data?.data || [];
        const found = list.find((item) => String(item.id) === String(id));
        setData(found);

        const donaturRes = await transactionApi.getDonaturByProgram(id);
        const donaturData = donaturRes?.data?.data || [];
        const validDonatur = donaturData.filter((d) => d.status === "success");
        setDonatur(validDonatur);

        const distRes = await distributionApi.getByProgramId(id);
        setDistributions(distRes?.data?.data || distRes?.data || []);
      } catch (err) {
        console.error("Error fetching detail data:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchData();
  }, [id]);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-2">
        <Loader2 className="w-10 h-10 animate-spin text-[#A3C585]" />
        <p className="text-gray-500 animate-pulse">Memuat laporan...</p>
      </div>
    );

  if (!data)
    return <div className="text-center py-20">Data tidak ditemukan</div>;

  const cardStyle =
    "border-0 shadow-xl rounded-2xl bg-white ring-1 ring-slate-100 overflow-hidden";

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FEF9C3] border border-yellow-100 p-4 rounded-lg mb-8 text-center shadow-sm">
          <p className="text-yellow-700 text-sm font-medium">
            Satu Kebaikan, Berjuta Harapan. Target donasi telah tercapai. Terima
            kasih telah mewujudkan harapan mereka.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-8">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-video bg-slate-200">
              <img
                src={data.image || noImage}
                className="w-full h-full object-cover"
                alt={data.title}
              />
              <div className="absolute top-4 left-4">
                <span className="bg-[#A3C585] text-white text-[11px] px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-md">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />{" "}
                  Selesai
                </span>
              </div>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-slate-800">
              {data.title}
            </h1>

            {/* CARD LAPORAN KEBERHASILAN PROGRAM */}
            <Card className={`p-8 ${cardStyle}`}>
              <h2 className="text-lg font-bold text-slate-800 mb-4">
                Laporan Keberhasilan Program
              </h2>
              <div className="text-slate-600 text-sm leading-relaxed space-y-6">
                {distributions.length > 0 ? (
                  distributions.map((item, index) => (
                    <div key={item.id || index} className="space-y-2">
                      <div className="text-slate-700 whitespace-pre-line">
                        {item.description}
                      </div>
                      {index !== distributions.length - 1 && (
                        <hr className="border-slate-100" />
                      )}
                    </div>
                  ))
                ) : (
                  <p className="italic text-slate-400">
                    {data.description ||
                      "Laporan penyaluran sedang dalam proses pembaharuan."}
                  </p>
                )}
                <p className="font-medium text-[#A3C585] pt-4 border-t border-slate-50">
                  Jazakumullah khairan katsiran kepada para donatur.
                </p>
              </div>
            </Card>

            {/* CARD RINCIAN PENYALURAN DANA */}
            <Card className={cardStyle}>
              <div className="bg-[#A3C585] p-4 flex items-center gap-2 text-white">
                <TableIcon size={18} />
                <h3 className="font-bold text-xs uppercase tracking-widest">
                  Rincian Penyaluran Dana
                </h3>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-slate-400 uppercase text-[10px] font-bold border-b border-slate-100">
                        <th className="pb-4 px-2">Tanggal</th>
                        <th className="pb-4 px-2">Tujuan Penyaluran</th>
                        <th className="pb-4 px-2 text-right">Jumlah</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      {distributions.length > 0 ? (
                        distributions.map((item) => (
                          <tr
                            key={item.id}
                            className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors"
                          >
                            <td className="py-5 px-2 text-[11px]">
                              {new Date(item.created_at).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              )}
                            </td>
                            <td className="py-5 px-2">
                              <p className="text-xs font-bold text-slate-700">
                                {item.purpose}
                              </p>
                            </td>
                            <td className="py-5 px-2 text-right font-bold text-[#A3C585] text-xs">
                              {formatRupiah(item.amount)}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan="3"
                            className="py-10 text-center text-slate-400 text-xs italic"
                          >
                            Belum ada data penyaluran yang tercatat.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>

            {/* CARD DAFTAR DONATUR */}
            <Card className={`p-6 ${cardStyle}`}>
              <div className="flex justify-between items-center mb-5">
                <h4 className="font-bold text-slate-800 text-sm">
                  Daftar Donatur
                </h4>
              </div>
              <div className="space-y-3">
                {donatur.length > 0 ? (
                  donatur.slice(0, 5).map((d, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 bg-slate-50/70 p-3 rounded-xl border border-slate-100/50"
                    >
                      <Avatar className="h-9 w-9 border-2 border-white shadow-sm">
                        <AvatarFallback className="font-bold text-[#A3C585] bg-white text-[10px]">
                          {d.name?.substring(0, 2).toUpperCase() || "AN"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-bold text-[11px] text-slate-800 line-clamp-1">
                          {d.name}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          Telah berdonasi
                        </p>
                      </div>
                      <p className="font-bold text-[11px] text-slate-700">
                        {formatRupiah(d.amount)}
                      </p>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Info className="mx-auto w-5 h-5 text-slate-200 mb-2" />
                    <p className="text-[11px] text-slate-400">
                      Belum ada data donatur.
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card className={cardStyle + " p-6"}>
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">
                  Total Terkumpul
                </p>
                <h2 className="text-3xl font-extrabold text-[#A3C585] mb-1">
                  {formatRupiah(data.target_amount)}
                </h2>
                <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-slate-50 pb-4">
                  <span className="text-[#A3C585]">100% Tercapai</span>
                  <span>Target: {formatRupiah(data.target_amount)}</span>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Donatur
                    </p>
                    <p className="text-lg font-bold text-slate-800">
                      {donatur.length}
                    </p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-xl text-center">
                    <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Status
                    </p>
                    <p className="text-xs font-bold text-[#A3C585] uppercase">
                      Disalurkan
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                  <p className="text-[11px] text-green-700 leading-relaxed text-center font-medium">
                    Program telah selesai dan dana telah disalurkan sepenuhnya.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailCompletedProgram;
