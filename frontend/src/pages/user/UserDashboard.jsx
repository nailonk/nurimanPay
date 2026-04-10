import { useEffect, useState } from "react";
import { getPrograms } from "@/api/program";

import HeroSection from "@/components/user/dashboard/HeroSection";
import ProgramSection from "@/components/user/dashboard/ProgramSection";
import CompletedProgramSection from "@/components/user/dashboard/CompletedProgramSection";
import AboutSection from "@/components/user/dashboard/AboutSection";

export default function UserDashboard() {
  const [programs, setPrograms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const res = await getPrograms();
        const data = Array.isArray(res.data) ? res.data : res.data?.data || [];
        setPrograms(data);
      } catch (err) {
        console.error("Gagal mengambil data program:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrograms();
  }, []);

  const activePrograms = programs.filter((p) => {
    return Number(p.collected_amount || 0) < Number(p.target_amount || 0);
  });

  const completedPrograms = programs.filter((p) => {
    return Number(p.collected_amount || 0) >= Number(p.target_amount || 0);
  });
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />

      <section id="program-section" className="bg-gray-50/80 py-12 space-y-2">
        <div className="w-full px-4 md:max-w-7xl md:mx-auto md:px-6">
          <ProgramSection programs={activePrograms} isLoading={isLoading} />
        </div>

        <div
          id="completed-program-section"
          className="w-full px-4 md:max-w-7xl md:mx-auto md:px-6"
        >
          <CompletedProgramSection
            programs={completedPrograms}
            isLoading={isLoading}
          />
        </div>
      </section>

      <section id="about-section">
        <AboutSection />
      </section>
    </div>
  );
}
