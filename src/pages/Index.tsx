import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import StitchingPromo from '../components/StitchingPromo';
import BlogPreview from '../components/BlogPreview';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';



const Index = () => {
  return (
    <div className="min-h-screen bg-revive-white">
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <StitchingPromo />
      <BlogPreview />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
