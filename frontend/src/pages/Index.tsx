
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import SignatureAbayas from '../components/SignatureAbayas';
import FeaturedCategories from '../components/FeaturedCategories';
import EthnicElegance from '../components/EthnicElegance';
import StitchingPromo from '../components/StitchingPromo';
import StyleJourney from '../components/StyleJourney';
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
        keywords="buy clothes online dubai, online fashion store uae, modest fashion dubai, abaya online uae, best abaya shops in Dubai, luxury abaya Dubai online"
        canonical="/"
      />
      <Navbar />
      <h1 className="sr-only">Abayas Online in Dubai</h1>
      <HeroSection />
      <FeaturedCategories />
      <SignatureAbayas />
      <EthnicElegance />
      <StitchingPromo />
      <StyleJourney />
      {/* <BlogPreview /> */}
      {/* <Newsletter /> */}
      <Footer />
    </div>
  );
};

export default Index;
