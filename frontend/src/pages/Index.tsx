
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
        title="Abayas Online in Dubai | Modest Fashion"
        description="Discover prayer abayas, jalebia dresses & modest fashion at Revive Wardrobe. Shop abayas online in Dubai & Abu Dhabi from a trusted Muslim store."
        keywords="revive wardrobe, fashion, clothing, online shopping, premium fashion, elegant attire, stitched clothing, unstitched fabric, buy clothes online dubai, online fashion store uae, dubai clothing store, modest fashion dubai, shein dubai uae online, online clothes shopping uae, abaya online uae, zara uae online, shein online shopping dubai, matalan uae online, order clothes online dubai, best abaya shops in Dubai, Dubai abaya online worldwide shipping, abaya shop Dubai online, luxury abaya Dubai online"
        canonical="/"
      />
      <Navbar />
      <HeroSection />
      <FeaturedCategories />
      <SignatureCollection />
      <FeaturedProducts />
      <StitchingPromo />
      {/* <BlogPreview /> */}
      <Newsletter />
      <Footer />
    </div>
  );
};

export default Index;
