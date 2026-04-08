import { useRef, useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  CheckCircle,
  Info,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { getPrograms } from "@/api/program";
import { distributionApi } from "@/api/distribution";
import noImage from "@/assets/noImage.png";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const CompletedProgramSection = () => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const [mergedData, setMergedData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [resPrograms, resDistributions] = await Promise.all([
          getPrograms(),
          distributionApi.getAll(),
        ]);

        const listPrograms = Array.isArray(resPrograms.data)
          ? resPrograms.data
          : resPrograms.data?.data || [];
        const listDistributions = Array.isArray(resDistributions.data)
          ? resDistributions.data
          : resDistributions.data?.data || [];

        const combined = listDistributions.map((dist) => {
          const programMatch = listPrograms.find(
            (p) => String(p.id) === String(dist.program_id),
          );
          return {
            ...dist,
            displayTitle: programMatch
              ? programMatch.title
              : "Program Penyaluran",
            displayImage: programMatch?.image || dist.image || noImage,
          };
        });

        setMergedData(combined);
      } catch (error) {
        console.error("Error merging data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="py-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6 px-6">
        <div>
          <h2 className="text-xl font-bold text-[#A3C585]">
            Program Selesai Disalurkan
          </h2>
          <p className="text-sm text-gray-500">
            Bukti nyata kebaikan yang telah Anda berikan kepada sesama.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 bg-white hover:bg-gray-100 focus-visible:ring-0"
          >
            <ChevronLeft className="text-[#A3C585]" />
          </Button>

          <Button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 bg-white hover:bg-gray-100 focus-visible:ring-0"
          >
            <ChevronRight className="text-[#A3C585]" />
          </Button>
        </div>
      </div>

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 px-6 scrollbar-none"
      >
        {loading ? (
          [1, 2, 3].map((n) => (
            <Card
              key={n}
              className="min-w-[280px] h-[420px] animate-pulse bg-gray-50 rounded-2xl border-0 flex items-center justify-center ring-0 focus:ring-0 focus-visible:ring-0 outline-none"
            >
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="w-8 h-8 animate-spin text-[#A3C585]/50" />
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                  Memuat...
                </p>
              </div>
            </Card>
          ))
        ) : mergedData.length > 0 ? (
          mergedData.map((item) => (
            <Card
              key={item.id}
              className="min-w-[280px] max-w-[280px] h-fit rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden p-0 !p-0 bg-white ring-0 focus:ring-0 outline-none mb-2"
            >
              <div className="h-44 w-full shrink-0 relative mt-0 overflow-hidden">
                <div className="absolute top-3 left-3 z-10">
                  <span className="bg-white/90 backdrop-blur-sm text-[#A3C585] text-[10px] px-2 py-1 rounded font-bold uppercase border border-green-100 flex items-center gap-1 shadow-sm">
                    <CheckCircle size={10} /> Selesai
                  </span>
                </div>
                <img
                  src={item.displayImage}
                  alt={item.displayTitle}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = noImage;
                  }}
                />
              </div>

              <div className="p-4 flex flex-col bg-white">
                <div>
                  <h3 className="font-semibold text-gray-800 line-clamp-1">
                    {item.displayTitle}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-2">
                    <div className="flex justify-between text-[10px] text-gray-600 mb-1">
                      <p className="text-xs">
                        Tersalurkan:{" "}
                        <span className="font-semibold text-[#A3C585]">
                          {formatRupiah(item.amount)}
                        </span>
                      </p>
                      <span className="font-semibold text-gray-700">100%</span>
                    </div>

                    <Progress
                      value={100}
                      className="mt-2 h-2 bg-gray-200 [&>div]:bg-[#A3C585]"
                    />
                  </div>
                </div>

                <Button
                  onClick={() =>
                    navigate(`/detail-completed-program/${item.program_id}`)
                  }
                  className="mt-3 w-full h-10 rounded-xl bg-[#A3C585]/10 text-[#A3C585] hover:bg-[#A3C585] hover:text-white border-0 transition shadow-none ring-0 focus:ring-0"
                >
                  Detail Penyaluran Dana
                </Button>
              </div>
            </Card>
          ))
        ) : (
          /* EMPTY STATE */
          <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 mx-6">
            <div className="p-3 bg-white rounded-full shadow-sm mb-3">
              <Info className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-400 text-sm font-medium">
              Belum ada program yang selesai disalurkan.
            </p>
            <p className="text-gray-300 text-[11px] mt-1">
              Laporan transparansi akan muncul setelah program mencapai target.
            </p>
          </div>
        )}
        <div className="min-w-[1px] h-full pointer-events-none invisible"></div>
      </div>
    </div>
  );
};

export default CompletedProgramSection;