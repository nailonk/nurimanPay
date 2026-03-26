import { useState, useEffect } from "react"
import TransaksiTable from "./TransaksiTable"
import TransaksiFilter from "./TransaksiFilter"

function TransaksiList() {
  const [search, setSearch] = useState("")
  const [transaksi, setTransaksi] = useState([])

  const defaultData = [
    {
      id: 1,
      nama: "H. Muhammad Ridwan",
      hp: "0812-3456-7890",
      program: "Wakaf Masjid",
      nominal: 5000000,
      metode: "Transfer Mandiri",
      status: "berhasil",
      tanggal: "24 Okt 2023, 14:30",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      hp: "0856-9988-7766",
      program: "Santunan Yatim",
      nominal: 250000,
      metode: "QRIS / Dana",
      status: "berhasil",
      tanggal: "24 Okt 2023, 11:15",
    },
  ]

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transaksi"))

    if (saved && saved.length > 0) {
      setTransaksi(saved)
    } else {
      setTransaksi(defaultData)
      localStorage.setItem("transaksi", JSON.stringify(defaultData))
    }
  }, [])

  const handleDelete = (id) => {
    const updated = transaksi.filter((item) => item.id !== id)
    setTransaksi(updated)
    localStorage.setItem("transaksi", JSON.stringify(updated))
  }

  const filteredData = transaksi.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <TransaksiFilter search={search} setSearch={setSearch} />

      <TransaksiTable data={filteredData} onDelete={handleDelete} />

      {filteredData.length === 0 && (
        <p className="text-center text-gray-500">
          Data tidak ditemukan 😢
        </p>
      )}
    </div>
  )
}

export default TransaksiList