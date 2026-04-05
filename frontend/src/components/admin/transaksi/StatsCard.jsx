import React from "react";
import { TrendingUp, CreditCard, Clock, Users } from "lucide-react";

function TransaksiStats({ data = [] }) {
  // Hitung statistik dari data riil
  const totalDonasi = data
    .filter(t => t.status === 'success')
    .reduce((sum, item) => sum + Number(item.amount), 0);
    
  const pendingCount = data.filter(t => t.status === 'pending').length;
  const uniqueDonors = new Set(data.map(t => t.phone_number)).size;

  const stats = [
    { 
      label: "Total Donasi Berhasil", 
      value: `Rp ${totalDonasi.toLocaleString("id-ID")}`, 
      color: "text-green-600", 
      sub: "Akumulasi saldo masuk" 
    },
    { 
      label: "Total Transaksi", 
      value: data.length, 
      color: "text-gray-800", 
      sub: "Semua waktu" 
    },
    { 
      label: "Pending Review", 
      value: pendingCount, 
      color: "text-orange-600", 
      sub: "Butuh konfirmasi manual" 
    },
    { 
      label: "Total Donatur", 
      value: uniqueDonors, 
      color: "text-[#A3C585]", 
      sub: "Semua donatur" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, idx) => (
        <div key={idx} className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm">
          <p className="text-[11px] font-bold text-gray-400 uppercase mb-2">{item.label}</p>
          <p className={`text-2xl font-bold ${item.color} mb-1`}>{item.value}</p>
          <p className="text-[10px] text-gray-400 font-medium">{item.sub}</p>
        </div>
      ))}
    </div>
  );
}

export default TransaksiStats;