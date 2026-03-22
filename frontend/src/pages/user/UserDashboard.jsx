import HeroSection from "@/components/user/dashboard/HeroSection"
import ProgramSection from "@/components/user/dashboard/ProgramSection" 
import AboutSection from "@/components/user/dashboard/AboutSection"

export default function UserDashboard() {
  return (
    <>
      <HeroSection />

      <div className="bg-gray-50/80 py-10">
        <div className="w-full px-4 md:max-w-7xl md:mx-auto md:px-6">
          <ProgramSection />
        </div>
      </div>

      <AboutSection />
    </>
  )
}