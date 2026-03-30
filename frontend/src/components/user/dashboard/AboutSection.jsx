'use client'

import { BadgeCheck,  HandHeart } from "lucide-react"
import masjidImg from "@/assets/masjid.jpg" 

export default function AboutSection() {
  return (
     <section className="bg-white py-10">
      <div className="w-full px-4 sm:max-w-7xl sm:mx-auto sm:px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 items-center">

          {/* LEFT: IMAGE */}
          <div className="relative">
            <img
              src={masjidImg}
              alt="Masjid"
              className="w-full h-[320px] md:h-[420px] object-cover rounded-2xl shadow"
            />

            {/* BADGE */}
            <div className="absolute bottom-[-20px] right-6 md:right-10 bg-[#A3C585] text-white rounded-xl px-6 py-4 shadow-lg w-[180px]">
              <h3 className="text-xl font-bold">12+ Thn</h3>
              <p className="text-sm mt-1 leading-snug text-green-100">
                Jembatan kebaikan umat dengan amanah.
              </p>
            </div>
          </div>

          {/* RIGHT: CONTENT */}
          <div>

            <h2 className="text-2xl md:text-3xl font-bold text-[#A3C585] mb-4">
              Tentang Kami
            </h2>

            <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-4">
              NurimanPay merupakan platform donasi digital yang dibuat untuk
              menaungi berbagai kegiatan galang dana demi kebaikan bersama.
              Melalui website ini, masyarakat dapat dengan mudah menyalurkan
              infaq dan sedekah ke berbagai kategori donasi yang tersedia.
            </p>

            <p className="text-gray-800 text-sm md:text-base leading-relaxed mb-6">
              Kami berharap NurimanPay dapat menjadi jembatan kebaikan yang
              menghubungkan para donatur dengan berbagai kebutuhan donasi,
              sehingga setiap kontribusi yang diberikan dapat memberikan manfaat
              yang luas bagi umat dan lingkungan sekitar.
            </p>

            {/* FEATURES */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#A3C585]/10">
                  <BadgeCheck className="text-[#A3C585]" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Transparansi
                  </h4>
                  <p className="text-sm text-gray-500">
                    Laporan keuangan bulanan secara terperinci.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-blue-100">
                  <HandHeart className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">
                    Amanah
                  </h4>
                  <p className="text-sm text-gray-500">
                    Penyaluran dana tepat sasaran kepada yang membutuhkan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}