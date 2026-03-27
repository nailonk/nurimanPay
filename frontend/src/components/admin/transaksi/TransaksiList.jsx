import { useState, useEffect } from "react"
import TransaksiTable from "./TransaksiTable"
import TransaksiFilter from "./TransaksiFilter"

function TransaksiList() {
  const [search, setSearch] = useState("")
  const [filterProgram, setFilterProgram] = useState("Semua Program") // State baru
  const [transaksi, setTransaksi] = useState([])

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("transaksi")) || []
    setTransaksi(saved)
  }, [])

  // LOGIKA FILTER GANDA (Nama & Program)
  const filteredData = transaksi.filter((item) => {
    const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase()) || 
                          item.hp.includes(search)
    const matchesProgram = filterProgram === "Semua Program" || item.program === filterProgram
    
    return matchesSearch && matchesProgram
  })

  return (
    <div className="space-y-0">
      <TransaksiFilter 
        search={search} 
        setSearch={setSearch} 
        filterProgram={filterProgram} 
        setFilterProgram={setFilterProgram} 
      />

      <TransaksiTable data={filteredData} />

      {filteredData.length === 0 && (
        <div className="p-10 text-center text-gray-400">
          Data transaksi tidak ditemukan
        </div>
      )}
    </div>
  )
}

export default TransaksiList