import { useRef, useMemo } from "react";
import { ChevronLeft, ChevronRight, Loader2, PackageOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import noImage from "@/assets/noImage.png";

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka || 0);
};

const ProgramSection = ({ programs = [], isLoading = false }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const sortedPrograms = useMemo(() => {
    if (!programs.length) return [];

    return [...programs].sort((a, b) => {
      const progressA =
        Number(a.collected_amount || 0) / Number(a.target_amount || 1);

      const progressB =
        Number(b.collected_amount || 0) / Number(b.target_amount || 1);

      return progressA - progressB;
    });
  }, [programs]);

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
          <h2 className="text-xl font-bold text-[#A3C585]">Program Donasi</h2>
          <p className="text-sm text-gray-500">
            Pilih program kebaikan yang ingin anda bantu hari ini.
          </p>
        </div>

        {!isLoading && sortedPrograms.length > 0 && (
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
        )}
      </div>

      {/* CARD LIST DAN EMPTY STATE */}
      <div
        ref={scrollRef}
        className={`flex gap-6 overflow-x-auto scroll-smooth pb-6 px-6 scrollbar-none ${
          !isLoading && sortedPrograms.length === 0 ? "justify-center" : ""
        }`}
      >
        {isLoading ? (
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
        ) : sortedPrograms.length > 0 ? (
          sortedPrograms.map((item) => {
            const currentProgress =
              Math.min(
                100,
                Math.round(
                  (Number(item.collected_amount || 0) /
                    Number(item.target_amount || 1)) *
                    100,
                ),
              ) || 0;

            return (
              <Card
                key={item.id}
                className="min-w-[280px] max-w-[280px] h-fit rounded-2xl border-none shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden ring-0 focus:ring-0 outline-none p-0 !p-0 bg-white mb-2"
              >
                <div className="h-40 w-full bg-gray-100 shrink-0 overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image || noImage}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = noImage;
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <div className="mb-auto">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="mt-4 pt-2">
                      <div className="flex justify-between text-sm text-gray-600 mb-1">
                        <p className="text-xs">
                          Terkumpul:{" "}
                          <span className="font-semibold text-[#A3C585] block sm:inline">
                            {formatRupiah(item.collected_amount)}
                          </span>
                        </p>
                        <span className="font-semibold text-gray-700">
                          {currentProgress}%
                        </span>
                      </div>

                      <Progress
                        value={currentProgress}
                        className="mt-2 h-2 bg-gray-200 [&>div]:bg-[#A3C585]"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => navigate(`/detail-program/${item.id}`)}
                    className="mt-4 w-full h-11 rounded-xl bg-[#A3C585]/20 text-[#A3C585] hover:bg-[#A3C585] hover:text-white transition border-0 focus-visible:ring-0 shrink-0"
                  >
                    Donasi Sekarang
                  </Button>
                </div>
              </Card>
            );
          })
        ) : (
          <div className="w-full flex flex-col items-center justify-center py-12 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <PackageOpen className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-600">
              Tidak ada program
            </h3>
            <p className="text-sm text-gray-400">
              Saat ini belum ada program donasi yang tersedia.
            </p>
          </div>
        )}

        {sortedPrograms.length > 0 && (
          <div className="min-w-[1px] h-full pointer-events-none invisible"></div>
        )}
      </div>
    </div>
  );
};

export default ProgramSection;
