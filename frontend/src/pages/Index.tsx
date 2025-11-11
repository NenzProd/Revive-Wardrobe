
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SignatureCollection from '../components/SignatureCollection';
import FeaturedCategories from '../components/FeaturedCategories';
import FeaturedProducts from '../components/FeaturedProducts';
import StitchingPromo from '../components/StitchingPromo';
import BlogPreview from '../components/BlogPreview';
import Newsletter from '../components/Newsletter';
import Footer from '../components/Footer';
import SEO from '../components/SEO';

const Index = () => {
  return (
    <div className="min-h-screen bg-revive-white">
      <SEO 
        title="Home - Premium Fashion & Clothing"
        description="Discover Revive Wardrobe - Your destination for premium fashion, elegant clothing, and timeless style. Shop our curated collection of stitched and unstitched attire."
        keywords="revive wardrobe, fashion, clothing, online shopping, premium fashion, elegant attire, stitched clothing, unstitched fabric"
        canonical="/"
      />
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <SignatureCollection />
      <FeaturedProducts />
      <StitchingPromo />
      <BlogPreview />
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
