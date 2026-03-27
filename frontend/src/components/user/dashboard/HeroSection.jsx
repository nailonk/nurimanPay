import React from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const navigate = useNavigate();
  return (
    <section className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* Background Image */}
      <img
        src="https://tiperumah.id/blog/wp-content/uploads/2022/05/Gambar-masjid.png"
        alt="Masjid"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 flex flex-col items-center justify-center text-center h-full px-4">
        {/* BADGE */}
        <span className="bg-yellow-600 text-white text-xs px-4 py-1 rounded-full mb-4">
          SMK NEGERI KABUH
        </span>

        {/* TITLE */}
        <h1 className="text-white text-2xl md:text-4xl font-bold leading-snug">
          Mari berbagi kebaikan bersama,
          <br />
          <span className="text-yellow-400">
            Masjid Nurul Iman
          </span>
        </h1>

        {/* SUBTITLE */}
        <p className="text-gray-200 text-sm md:text-base mt-4 max-w-xl">
          Salurkan infaq, sedekah, dan zakat Anda untuk kemaslahatan umat
          dan pembangunan rumah Allah.
        </p>

        {/* BUTTON */}
        <button 
          onClick={() =>
            navigate("/program-section")
          }
          className="mt-6 bg-[#A3C585] text-white px-6 py-3 rounded-xl font-medium"
          >
            Donasi Sekarang
        </button>
      </div>
    </section>
  );
};

export default HeroSection;