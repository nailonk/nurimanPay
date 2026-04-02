import React, { useState, useEffect } from "react";
import TransaksiTable from './TransaksiTable';
import TransaksiFilter from './TransaksiFilter';

function TransaksiList() {
  const [search, setSearch] = useState("");
  const [filterProgram, setFilterProgram] = useState("Semua Program");
  const [transaksi, setTransaksi] = useState([]);

  // Ambil data dari LocalStorage saat pertama kali load
 useEffect(() => {
  const rawData = localStorage.getItem("transaksi");
  const saved = rawData ? JSON.parse(rawData) : [];
  
  // Pastikan data yang dimasukkan adalah Array agar tidak merah
  if (Array.isArray(saved)) {
    setTransaksi(saved);
  } else {
    setTransaksi([]);
  }
}, []);

  // Fungsi untuk menghapus transaksi
  const handleDelete = (id) => {
    const isConfirm = window.confirm("Apakah Anda yakin ingin menghapus transaksi ini?");
    if (isConfirm) {
      const updatedData = transaksi.filter((item) => item.id !== id);
      setTransaksi(updatedData);
      localStorage.setItem("transaksi", JSON.stringify(updatedData));
    }
  };

  // Logika Filter Data
  const filteredData = transaksi.filter((item) => {
    // Gunakan optional chaining (?.) untuk menghindari error jika item.nama undefined
    const nama = item.nama?.toLowerCase() || "";
    const hp = item.hp || "";
    const searchLower = search.toLowerCase();

    const matchesSearch = nama.includes(searchLower) || hp.includes(search);
    
    const matchesProgram = 
      filterProgram === "Semua Program" || 
      item.program === filterProgram;

    return matchesSearch && matchesProgram;
  });

  return (
    <div className="space-y-4"> {/* Menambah sedikit space agar tidak terlalu rapat */}
      <TransaksiFilter 
        search={search} 
        setSearch={setSearch} 
        filterProgram={filterProgram} 
        setFilterProgram={setFilterProgram} 
      />

      <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
        <TransaksiTable 
          data={filteredData} 
          onDelete={handleDelete} 
        />

        {filteredData.length === 0 && (
          <div className="p-20 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Data transaksi tidak ditemukan
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default TransaksiList;