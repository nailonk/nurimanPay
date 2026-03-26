import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
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

const ProgramSection = ({ programs = [] }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  const scroll = (direction) => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#A3C585]">
            Program Donasi
          </h2>
          <p className="text-sm text-gray-500">
            Pilih program kebaikan yang ingin anda bantu hari ini.
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => scroll("left")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80"
          >
            <ChevronLeft className="text-white" />
          </Button>

          <Button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80"
          >
            <ChevronRight className="text-white" />
          </Button>
        </div>
      </div>

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2 px-2 md:px-4"
      >
           {programs.map((item) => {
          const progress = Math.round(
            (item.collected_amount / item.target_amount) * 100
          ) || 0;

          return (
            <Card
              key={item.id}
              className="min-w-[280px] max-w-[280px] shrink-0 rounded-2xl
              border-0 shadow-md hover:shadow-xl transition
              flex flex-col overflow-hidden
              ring-0 focus-visible:ring-0 focus:outline-none"
            >
              <img
                src={item.image}
                alt={item.title}
                className="h-40 w-full object-cover"
              />

              <div className="p-4 flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">
                    {item.title}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-4">
                    <div className="flex justify-between text-sm text-gray-600">
                      <p>
                        Terkumpul:{" "}
                        <span className="font-semibold text-[#A3C585]/80">
                          {formatRupiah(item.collected_amount)}
                        </span>
                      </p>

                      <span className="font-semibold text-gray-700">
                        {progress}%
                      </span>
                    </div>

                    <Progress
                      value={progress}
                      className="mt-2 h-2 bg-gray-200 [&>div]:bg-[#A3C585]"
                    />
                  </div>
                </div>

                <Button
                  onClick={() =>
                    navigate(`/detail-program/${item.id}`)
                  }
                  className="mt-4 w-full h-12 rounded-xl 
                  bg-[#A3C585]/20 text-[#A3C585]"
                >
                  Donasi Sekarang
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ProgramSection;