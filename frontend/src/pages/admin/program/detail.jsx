import { useParams, useNavigate } from "react-router-dom"

function ProgramDetailAdmin() {
  const { id } = useParams()
  const navigate = useNavigate()

  const data = {
    id,
    title: "Infaq Pembangunan",
    description: "Detail lengkap program...",
    progress: 70,
    collected: "Rp 35.000.000",
    target: "Rp 50.000.000",
    deadline: "12 hari lagi",
    image: "https://via.placeholder.com/600",
  }

  const handleDelete = () => {
    alert("Hapus (dummy)")
    navigate("/admin/program")
  }

  return (
    <div>
      <h1>{data.title}</h1>
      <button onClick={handleDelete}>Hapus</button>
    </div>
  )
}

export default ProgramDetailAdmin