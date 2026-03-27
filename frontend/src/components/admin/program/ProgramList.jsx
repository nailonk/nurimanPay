import { useState, useEffect } from "react";
import { getPrograms, deleteProgram } from "@/api/program";
import ProgramCard from "./ProgramCard";
import ProgramFilter from "./ProgramFilter";

// Definisikan placeholder di luar agar bisa diakses oleh semua fungsi
const PLACEHOLDER = "https://placehold.co/600x400/f3f4f6/a3c585?text=No+Image";

function ProgramList() {
  const [search, setSearch] = useState("");
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk mengambil data menggunakan API Service
  const fetchPrograms = async () => {
    try {
      setLoading(true);
      const response = await getPrograms();

      // Ambil data dari response axios
      const rawData = response.data?.data || response.data || [];

      const mappedData = rawData.map((p) => {
        const target = Number(p.target_amount) || 0;
        const collected = Number(p.collected_amount) || 0;

        // Logika validasi gambar
        const isImageValid = p.image && p.image !== "null" && String(p.image).length > 50;

        return {
          id: p.id,
          title: p.title || "Tanpa Judul",
          description: p.description || "",
          // Hitung progress donasi
          progress: target > 0 ? Math.round((collected / target) * 100) : 0,
          // Format ke Rupiah
          collected: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(collected),
          target: new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
          }).format(target),
          badge: p.status?.toUpperCase() || "AKTIF",
          image: isImageValid ? p.image : PLACEHOLDER,
          // Simpan data asli untuk keperluan Edit nanti
          raw: p,
        };
      });

      setPrograms(mappedData);
      setError(null);
    } catch (err) {
      console.error("Fetch Error:", err);
      setError("Gagal memuat data dari database. Pastikan koneksi server aktif.");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi hapus menggunakan API Service
  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus program ini?")) {
      try {
        await deleteProgram(id);
        // Update state lokal
        setPrograms((prev) => prev.filter((item) => item.id !== id));
        alert("Program berhasil dihapus.");
      } catch (err) {
        console.error("Delete Error:", err);
        alert("Gagal menghapus program. Silakan coba lagi.");
      }
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

  // Filter pencarian berdasarkan judul
  const filteredPrograms = programs.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-4">
        <div className="w-10 h-10 border-4 border-[#A3C585] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm animate-pulse">Loading...</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <ProgramFilter search={search} setSearch={setSearch} />

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        {filteredPrograms.length > 0 ? (
          filteredPrograms.map((item) => (
            <ProgramCard
              key={item.id}
              data={item}
              onDelete={() => handleDelete(item.id)}
            />
          ))
        ) : (
          <div className="text-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 font-medium">Data program tidak ditemukan.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProgramList;