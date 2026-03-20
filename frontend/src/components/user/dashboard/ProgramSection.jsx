import React, { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

const programs = [
  {
    title: "Infaq Pembangunan",
    desc: "Bantu kami menyelesaikan renovasi lantai dua untuk ruang belajar TPA.",
    image:
      "https://awsimages.detik.net.id/visual/2025/11/14/pik-1763121943826_169.jpeg?w=650&q=90",
    collected: 50000000,
    progress: 65,
  },
  {
    title: "Sedekah Jumat",
    desc: "Penyaluran nasi kotak dan paket sembako untuk jamaah setiap Jumat.",
    image:
      "https://bucket-api.baznas.go.id/bucket-api/file?bucket=bzn-fdr-smb-p5739641&file=attachments/new_artikel/MzU4NTE3NDIzMjQwMjg.jpg",
    collected: 5000000,
    progress: 40,
  },
  {
    title: "Bantuan Anak Yatim",
    desc: "Santunan rutin dan biaya pendidikan untuk 50 anak yatim piatu di lingkungan masjid.",
    image:
      "https://i.pinimg.com/564x/fa/a0/68/faa06864fe248f4bd89331542b640206.jpg",
    collected: 15000000,
    progress: 80,
  },
  {
    title: "Bantuan Anak Yatim",
    desc: "Santunan rutin dan biaya pendidikan untuk 50 anak yatim piatu di lingkungan masjid.",
    image:
      "https://i.pinimg.com/564x/fa/a0/68/faa06864fe248f4bd89331542b640206.jpg",
    collected: 15000000,
    progress: 80,
  },
  {
    title: "Bantuan Anak Yatim",
    desc: "Santunan rutin dan biaya pendidikan untuk 50 anak yatim piatu di lingkungan masjid.",
    image:
      "https://i.pinimg.com/564x/fa/a0/68/faa06864fe248f4bd89331542b640206.jpg",
    collected: 15000000,
    progress: 80,
  },
  {
    title: "Bantuan Anak Yatim",
    desc: "Santunan rutin dan biaya pendidikan untuk 50 anak yatim piatu di lingkungan masjid.",
    image:
      "https://i.pinimg.com/564x/fa/a0/68/faa06864fe248f4bd89331542b640206.jpg",
    collected: 15000000,
    progress: 80,
  },
];

const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(angka);
};

const ProgramSection = () => {
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
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 focus-visible:ring-0"
          >
            <ChevronLeft className="text-white" />
          </Button>

          <Button
            onClick={() => scroll("right")}
            className="w-8 h-8 rounded-full border border-[#A3C585]/80 focus-visible:ring-0"
          >
            <ChevronRight className="text-white" />
          </Button>
        </div>
      </div>

      {/* CARD LIST */}
      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth pb-2"
      >
        {programs.map((item, index) => (
          <Card
            key={index}
            className="min-w-[280px] max-w-[280px] rounded-2xl border-0 shadow-md hover:shadow-xl ring-0 transition flex flex-col"
          >
            {/* IMAGE */}
            <img
              src={item.image}
              alt={item.title}
              className="h-40 w-full object-cover rounded-t-2xl"
            />

            {/* CONTENT */}
            <div className="p-4 flex flex-col h-full">
              {/* TOP CONTENT */}
              <div>
                <h3 className="font-semibold text-gray-800">
                  {item.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {item.desc}
                </p>

                {/* PROGRESS */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <p>
                      Terkumpul:{" "}
                      <span className="font-semibold text-[#A3C585]/80">
                        {formatRupiah(item.collected)}
                      </span>
                    </p>

                    <span className="font-semibold text-gray-700">
                      {item.progress}%
                    </span>
                  </div>

                  <Progress
                    value={item.progress}
                    className="mt-2 h-2 bg-gray-200 [&>div]:bg-[#A3C585]"
                  />
                </div>
              </div>

              {/* BUTTON (SELALU DI BAWAH) */}
              <Button
                onClick={() => navigate("/user/UserDashboard/program-section")}
                className="mt-4 w-full h-12 rounded-xl bg-[#A3C585]/20 text-[#A3C585]"
              >
                Donasi Sekarang
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProgramSection;