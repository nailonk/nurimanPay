import ProgramCard from "./ProgramCard"

function ProgramList() {
  const programs = [
    {
      title: "Infaq Pembangunan",
      description:
        "Perbaikan atap untuk mencegah kebocoran dan meningkatkan kenyamanan jamaah.",
      progress: 70,
      collected: "Rp 35.000.000",
      target: "Rp 50.000.000",
      image:
        "https://awsimages.detik.net.id/visual/2025/11/14/pik-1763121943826_169.jpeg?w=650&q=90",
    },
    {
      title: "Santunan Anak Yatim & Dhuafa",
      description:
        "Program rutin untuk membantu pendidikan dan kebutuhan anak yatim.",
      progress: 25,
      collected: "Rp 2.500.000",
      target: "Rp 10.000.000",
      image:
        "https://i.pinimg.com/564x/fa/a0/68/faa06864fe248f4bd89331542b640206.jpg",
    },
    {
      title: "Wakaf Sumur Bor Jamaah",
      description:
        "Pembangunan sumur untuk kebutuhan air bersih jamaah.",
      progress: 100,
      collected: "Rp 15.000.000",
      target: "Rp 15.000.000",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    },
  ]

  return (
    <div className="grid gap-6">
      {programs.map((item, index) => (
        <ProgramCard key={index} data={item} />
      ))}
    </div>
  )
}

export default ProgramList