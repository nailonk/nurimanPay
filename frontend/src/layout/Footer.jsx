import { MapPin, Phone, Mail, Facebook, Instagram } from "lucide-react"
import logo from "@/assets/logo.png"
import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();
  return (
    <footer className="bg-[#A3C585]/80 text-white mt-16 w-full">
      <div className="w-full px-4 sm:max-w-7xl sm:mx-auto sm:px-6 py-12 grid grid-cols-1 sm:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Nurul Iman" className="h-8 w-8" />
            <h2 className="text-lg font-semibold">Nurul Iman</h2>
          </div>

          <p className="text-sm text-white/70 leading-relaxed">
            Platform resmi donasi dan infaq Masjid Nurul Iman. Mari berinvestasi
            untuk akhirat bersama kami.
          </p>

          <div className="flex gap-3 mt-5">
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10">
              <Facebook size={16} />
            </button>
            <button className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10">
              <Instagram size={16} />
            </button>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Menu Cepat</h3>
          <ul className="space-y-2 text-sm text-white/70">
            <li>Beranda</li>
            <li>Program Donasi</li>
            <li>Tentang Kami</li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Kontak Kami</h3>

          <div className="space-y-3 text-sm text-white/70">
            <div className="flex gap-2">
              <MapPin size={16} />
              <p>Jl. Kabuh-Tapen Km. 6<br />Kabuh Jombang</p>
            </div>

            <div className="flex gap-2">
              <Phone size={16} />
              <p>(0321) 3759214</p>
            </div>

            <div className="flex gap-2">
              <Mail size={16} />
              <p className="underline">smknalasaka2012@gmail.com</p>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Dukung Kami</h3>

          <p className="text-sm text-white/70">
            Setiap kontribusi Anda sangat berarti bagi kami.
          </p>

          <button 
            onClick={() =>
              navigate("/program-section")
            }
            className="bg-yellow-500 text-white font-semibold px-5 py-2.5 mt-4 rounded-xl"
          >
            Berikan Donasi
          </button>
        </div>

      </div>

      <div className="w-full border-t border-white/10 text-center text-sm text-white/80 py-4">
        © 2026 NurimanPay. Seluruh Hak Cipta Dilindungi.
      </div>

    </footer>
  )
}