import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"

function ProgramForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    target: initialData.target || "",
    deadline: initialData.deadline || "",
    image: initialData.image || "",
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleImage = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setForm({ ...form, image: reader.result })
    }
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newData = {
      ...form,
      id: Date.now(),
      progress: 0,
      collected: "Rp 0",
      badge: null,
    }

    onSubmit(newData)
  }

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardContent className="p-6 space-y-6">

        {/* HEADER */}
        <div>
          <h2 className="text-xl font-semibold">
            Informasi Program
          </h2>
          <p className="text-sm text-muted-foreground">
            Isi detail program donasi dengan lengkap
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* GRID */}
          <div className="grid md:grid-cols-2 gap-6">

            {/* LEFT */}
            <div className="space-y-4">

              <div>
                <Label>Judul Program</Label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Contoh: Infaq Masjid"
                />
              </div>

              <div>
                <Label>Target Dana</Label>
                <Input
                  name="target"
                  value={form.target}
                  onChange={handleChange}
                  placeholder="Rp 50.000.000"
                />
              </div>

              <div>
                <Label>Deadline</Label>
                <Input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                />
              </div>

            </div>

            {/* RIGHT */}
            <div className="space-y-2">

              <Label>Gambar Program</Label>

              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">

                {form.image ? (
                  <img
                    src={form.image}
                    alt="preview"
                    className="w-full h-full object-cover rounded-xl"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p className="text-sm">Klik untuk upload</p>
                    <p className="text-xs">PNG / JPG</p>
                  </div>
                )}

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>

            </div>

          </div>

          {/* DESCRIPTION */}
          <div>
            <Label>Deskripsi Program</Label>
            <Textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Jelaskan program secara detail..."
            />
          </div>

          {/* ACTION */}
          <div className="flex justify-end gap-3 pt-4 border-t">

            <Button
              type="button"
              variant="outline"
              onClick={() => history.back()}
            >
              Batal
            </Button>

            <Button className="bg-green-600 hover:bg-green-700">
              Simpan Program
            </Button>

          </div>

        </form>
      </CardContent>
    </Card>
  )
}

export default ProgramForm