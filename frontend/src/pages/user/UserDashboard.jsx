import { useEffect, useState } from "react"
import { getPrograms } from "@/api/program"

import HeroSection from "@/components/user/dashboard/HeroSection"
import ProgramSection from "@/components/user/dashboard/ProgramSection"
import AboutSection from "@/components/user/dashboard/AboutSection"

export default function UserDashboard() {
  const [programs, setPrograms] = useState([])

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getPrograms()

        const data = Array.isArray(res.data)
          ? res.data
          : res.data?.data || []

        setPrograms(data)
      } catch (err) {
        console.log(err)
        setPrograms([]) 
      }
    }

    fetchPrograms()
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* HERO SECTION */}
      <HeroSection />

      {/* PROGRAM SECTION */}
      <section id="program-section" className="bg-gray-50/80 py-12 scroll-mt-10">
        <div className="w-full px-4 md:max-w-7xl md:mx-auto md:px-6">
          <ProgramSection programs={programs} />
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section id="about-section" className="scroll-mt-10">
        <AboutSection />
      </section>
    </div>
  )
}