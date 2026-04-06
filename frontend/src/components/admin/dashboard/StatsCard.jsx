import { Card, CardContent } from "@/components/ui/card"
import { Megaphone, Wallet, HandCoins, Receipt } from "lucide-react"
import { useState, useEffect } from "react"

function StatsCard({ programs = [], transactions = [] }) {
  // State lokal untuk menampung total dana disalurkan dari database external
  const [totalDistributed, setTotalDistributed] = useState(0);

  useEffect(() => {
    const fetchDistributions = async () => {
      try {
        // Mengambil data dari endpoint sesuai script kedua Anda
        const distRes = await fetch("http://localhost:5000/api/distribution");
        const distJson = await distRes.json();
        const distributions = distJson.data || [];

        const total = distributions.reduce(
          (acc, curr) => acc + (Number(curr.amount) || 0),
          0
        );
        setTotalDistributed(total);
      } catch (error) {
        console.error("Gagal memuat dana disalurkan:", error);
      }
    };

    fetchDistributions();
  }, []);

  // Logika Kalkulasi Donasi Masuk (dari props)
  const safeTransactions = Array.isArray(transactions) ? transactions : [];
  const safePrograms = Array.isArray(programs) ? programs : [];
  const activeProgramIds = safePrograms.map(p => String(p.id));

  const totalDonasiValid = safeTransactions
    .filter(t => {
      const statusLunas = ['success', 'settlement', 'capture'].includes(t.status?.toLowerCase());
      const isProgramValid = !t.program_id || activeProgramIds.includes(String(t.program_id));
      return statusLunas && isProgramValid;
    })
    .reduce((acc, curr) => {
      const nilai = curr.amount || curr.nominal || curr.gross_amount || curr.total || 0;
      return acc + Number(nilai);
    }, 0);

  const totalSemuaTransaksi = safeTransactions.filter(t => 
    !t.program_id || activeProgramIds.includes(String(t.program_id))
  ).length;

  const formatIDR = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const stats = [
    {
      title: "Total Program",
      value: safePrograms.length.toString(),
      icon: Megaphone,
      bg: "bg-green-50",
      iconColor: "text-green-500",
    },
    {
      title: "Total Donasi Masuk",
      value: formatIDR(totalDonasiValid),
      icon: Wallet,
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
    },
    {
      title: "Dana Disalurkan",
      // Menggunakan state totalDistributed hasil fetch API
      value: formatIDR(totalDistributed), 
      icon: HandCoins,
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
    {
      title: "Jumlah Transaksi",
      value: totalSemuaTransaksi.toLocaleString(),
      icon: Receipt,
      bg: "bg-gray-100",
      iconColor: "text-gray-500",
    },
  ]

  return (
    <>
      {stats.map((item, i) => {
        const Icon = item.icon
        return (
          <Card key={i} className="bg-white rounded-xl shadow-md transition duration-300 hover:shadow-lg ring-0 focus:ring-0 focus-visible:ring-0 outline-none">
            <CardContent className="p-4 flex flex-col items-start gap-3">
              <div className={`${item.bg} w-10 h-10 flex items-center justify-center rounded-lg`}>
                <Icon className={`${item.iconColor} w-5 h-5`} />
              </div>
              <div className="flex flex-col justify-center">
                <p className="text-sm text-gray-500 mb-1">{item.title}</p>
                <h3 className="text-xl font-semibold text-gray-800 leading-tight">{item.value}</h3>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </>
  )
}

export default StatsCard