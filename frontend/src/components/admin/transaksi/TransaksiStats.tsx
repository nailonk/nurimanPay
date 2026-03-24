function TransaksiStats() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Total Donasi</p>
        <p className="text-xl font-bold text-green-600">Rp 45.280.000</p>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Total Transaksi</p>
        <p className="text-xl font-bold">1,240</p>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Pending</p>
        <p className="text-xl font-bold text-yellow-600">12</p>
      </div>

      <div className="bg-white p-4 rounded-xl border">
        <p className="text-sm text-gray-500">Donatur Aktif</p>
        <p className="text-xl font-bold">458</p>
      </div>

    </div>
  )
}

export default TransaksiStats