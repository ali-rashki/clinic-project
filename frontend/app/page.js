import HeroSection from "@/components/Hero";
import ServicesSlider from "@/components/ServicesSlider";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection/>
      <ServicesSlider/>
      <AboutSection/>
      <main id="home" className=" mx-auto max-w-6xl px-6 py-12">
      </main>
    </div>
  );
}
