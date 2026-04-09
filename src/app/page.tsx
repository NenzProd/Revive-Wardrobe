import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import PromoBanner from "@/components/PromoBanner"
import BentoCategories from "@/components/BentoCategories"
import AboutSection from "@/components/AboutSection"
import FeaturedProducts from "@/components/FeaturedProducts"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <HeroSection />
      <PromoBanner />
      <BentoCategories />
      <AboutSection />
      <FeaturedProducts />
      <Footer />
    </main>
  )
}