import React, { useRef } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

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

        <div className="flex gap-2">
          <Button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 bg-white hover:bg-gray-100 focus-visible:ring-0" // Tambah ring-0
          >
            <ChevronLeft className="text-[#A3C585]" />
          </Button>

          <Button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 bg-white hover:bg-gray-100 focus-visible:ring-0" // Tambah ring-0
          >
            <ChevronRight className="text-[#A3C585]" />
          </Button>
        </div>
      </div>

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-6 px-6 scrollbar-thin scrollbar-thumb-[#A3C585]/30 scrollbar-track-transparent"
      >
        {isLoading ? (
          [1, 2, 3].map((n) => (
            <Card key={n} className="min-w-[280px] h-[420px] animate-pulse bg-gray-100 rounded-2xl border-0 ring-0 focus:ring-0 outline-none" />
          ))
        ) : (
          programs.map((item) => {
            const currentProgress = Math.round(
              (Number(item.collected_amount || 0) / Number(item.target_amount || 1)) * 100
            ) || 0;

            return (
              <Card
                key={item.id}
                className="min-w-[280px] max-w-[280px] h-[420px] rounded-2xl border-0 shadow-md hover:shadow-xl transition flex flex-col overflow-hidden ring-0 focus:ring-0 focus-visible:ring-0 outline-none"
              >
                <div className="h-40 w-full bg-gray-100 shrink-0 overflow-hidden rounded-t-2xl">
                  <img
                    src={item.image || "https://via.placeholder.com/400x200?text=No+Image"}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                    onError={(e) => {
                      e.target.src = "https://via.placeholder.com/400x200?text=No+Image";
                    }}
                  />
                </div>

                <div className="p-4 flex flex-col flex-1"> 
                  <div className="mb-auto">
                    <h3 className="font-semibold text-gray-800 line-clamp-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 h-10">
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
        )}
        <div className="min-w-[1px] h-full pointer-events-none invisible"></div>
      </div>
    </div>
  );
};

export default ProgramSection;