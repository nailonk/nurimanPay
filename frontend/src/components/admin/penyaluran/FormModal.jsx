import { useState, useEffect } from "react"

export default function FormModal({
  open,
  setOpen,
  editData,
  editIndex,
  refresh,
}) {
  const [form, setForm] = useState({
    tanggal: "",
    program: "",
    tujuan: "",
    nominal: "",
    keterangan: "",
    bukti: "",
  })

  const [error, setError] = useState("")

  useEffect(() => {
    if (editData) setForm(editData)
  }, [editData])

  // format rupiah langsung di sini
  const formatRupiah = (value) => {
    const number = value.replace(/\D/g, "")
    return new Intl.NumberFormat("id-ID").format(number)
  }

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleNominal = (e) => {
    setForm({
      ...form,
      nominal: formatRupiah(e.target.value),
    })
  }

  const handleFile = (e) => {
    const file = e.target.files[0]
    const reader = new FileReader()

    reader.onloadend = () => {
      setForm({ ...form, bukti: reader.result })
    }

    if (file) reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!form.tanggal || !form.program || !form.tujuan || !form.nominal) {
      return setError("Semua field wajib diisi!")
    }

    const data = JSON.parse(localStorage.getItem("penyaluran") || "[]")

    if (editData) {
      data[editIndex] = form
    } else {
      data.push(form)
    }

    localStorage.setItem("penyaluran", JSON.stringify(data))

    refresh()
    setOpen(false)
    setForm({})
    setError("")
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-2xl rounded-xl p-6">

        <h2 className="text-xl font-bold mb-4">
          Tambah Laporan Penyaluran
        </h2>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="grid grid-cols-2 gap-4">

            <input type="date" name="tanggal"
              value={form.tanggal}
              onChange={handleChange}
              className="border p-2 rounded" />

            <input type="text" name="program"
              placeholder="Program"
              value={form.program}
              onChange={handleChange}
              className="border p-2 rounded" />

            <input type="text" name="tujuan"
              placeholder="Tujuan"
              value={form.tujuan}
              onChange={handleChange}
              className="border p-2 rounded" />

            <input type="text"
              placeholder="Nominal"
              value={form.nominal}
              onChange={handleNominal}
              className="border p-2 rounded" />

          </div>

          <textarea
            name="keterangan"
            placeholder="Keterangan"
            value={form.keterangan}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />

          <input type="file" onChange={handleFile} />

          {form.bukti && (
            <img src={form.bukti} className="w-24 h-24 rounded" />
          )}

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setOpen(false)}>
              Batal
            </button>

            <button className="bg-green-600 text-white px-4 py-2 rounded">
              Simpan
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}