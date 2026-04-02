import React from "react";
import { TrendingUp } from "lucide-react";

function TransaksiStats() {
  const stats = [
    { 
      label: "Total Donasi (Bulan Ini)", 
      value: "Rp 45.280.000", 
      color: "text-green-600", 
      bg: "bg-white", 
      trend: "+12.5% dari bulan lalu" 
    },
    { 
      label: "Total Transaksi", 
      value: "1,240", 
      color: "text-gray-800", 
      bg: "bg-white", 
      sub: "Semua waktu" 
    },
    { 
      label: "Pending Review", 
      value: "12", 
      color: "text-orange-600", 
      bg: "bg-white", 
      sub: "Butuh konfirmasi manual" 
    },
    { 
      label: "Donatur Aktif", 
      value: "458", 
      color: "text-[#A3C585]", 
      bg: "bg-white", 
      trend: "+8 donatur baru minggu ini" 
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((item, idx) => (
        <div 
          key={idx} 
          className={`${item.bg} p-6 rounded-[24px] border border-gray-100 shadow-sm transition-all hover:shadow-md`}
        >
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
            {item.label}
          </p>
          
          <p className={`text-2xl font-bold ${item.color} mb-2`}>
            {item.value}
          </p>
          
          {/* Bagian Trend */}
          {item.trend && (
            <div className="flex items-center gap-1 text-[10px] text-green-500 font-medium">
              <TrendingUp size={12} /> 
              <span>{item.trend}</span>
            </div>
          )}
          
          {/* Bagian Sub-keterangan */}
          {item.sub && (
            <p className="text-[10px] text-gray-400 font-medium">
              {item.sub}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}

export default TransaksiStats;