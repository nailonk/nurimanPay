import StatusBadge from "./StatusBadge"

function formatRupiah(angka) {
  if (!angka) return "Rp 0"
  return "Rp " + Number(angka).toLocaleString("id-ID")
}

function TransaksiTable({ data = [], onDelete = () => {} }) {
  return (
    <div className="bg-white rounded-xl border overflow-hidden">

      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-500">
          <tr>
            <th className="p-3 text-left">Donatur</th>
            <th>Program</th>
            <th>Nominal</th>
            <th>Metode</th>
            <th>Status</th>
            <th>Tanggal</th>
            <th>Aksi</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((item, index) => (
              <tr key={item?.id || index} className="border-t hover:bg-gray-50">

                <td className="p-3">
                  <p className="font-medium">{item?.nama || "-"}</p>
                  <p className="text-xs text-gray-400">{item?.hp || "-"}</p>
                </td>

                <td>
                  <span className="bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                    {item?.program || "-"}
                  </span>
                </td>

                <td className="font-semibold">
                  {formatRupiah(item?.nominal)}
                </td>

                <td className="text-gray-500">
                  {item?.metode || "-"}
                </td>

                <td>
                  <StatusBadge status={item?.status} />
                </td>

                <td className="text-gray-500">
                  {item?.tanggal || "-"}
                </td>

                <td>
                  <button
                    onClick={() => onDelete(item?.id)}
                    className="text-red-500 text-sm hover:underline"
                  >
                    Hapus
                  </button>
                </td>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" className="text-center py-6 text-gray-400">
                Tidak ada data transaksi
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  )
}

export default TransaksiTable