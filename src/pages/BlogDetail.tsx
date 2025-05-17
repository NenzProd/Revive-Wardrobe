
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Calendar, User, ArrowLeft, Share2, Clock } from 'lucide-react';
import { blog1, blog2, blog3 } from '../assets/assets.js';

interface BlogPostContent {
  id: string;
  title: string;
  excerpt: string;
  content: React.ReactNode;
  imageUrl: string;
  date: string;
  author: string;
  readTime: string;
}

const blogPosts: Record<string, BlogPostContent> = {
  'choose-right-abaya': {
    id: 'choose-right-abaya',
    title: "How to Choose the Right Abaya for Your Body Type",
    excerpt: "A guide to flattering fits, trending cuts, and how to style your abaya with ease — so you always feel confident and covered.",
    content: (
      <>
        <p className="mb-6">
          Finding the perfect abaya is more than just selecting a color or fabric—it's about understanding 
          how different cuts and styles complement your unique body shape. While the abaya is traditionally known 
          for its modest coverage, today's designs offer a beautiful marriage of tradition and contemporary fashion, 
          allowing you to express your personal style while honoring cultural values.
        </p>
        
        <h2 className="text-2xl font-serif mb-3 mt-8">For Petite Frames</h2>
        <p className="mb-6">
          If you have a smaller stature, look for abayas that create a vertical line to elongate your silhouette. 
          Choose straight-cut styles without excessive fabric, as too much material can overwhelm your frame. 
          Consider these flattering options:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>A-line abayas that fall gracefully without adding bulk</li>
          <li>Vertical design elements like front panels or subtle pinstripes</li>
          <li>Shorter sleeve lengths that don't extend beyond your wrist</li>
          <li>High-waisted belt details to create the illusion of height</li>
        </ul>
        
        <h2 className="text-2xl font-serif mb-3 mt-8">For Taller Figures</h2>
        <p className="mb-6">
          Blessed with height? You can carry dramatic styles with flair. Opt for abayas with horizontal elements to 
          balance your stature:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Wide belts or sashes at the waistline</li>
          <li>Multi-tiered designs that create horizontal visual breaks</li>
          <li>Butterfly sleeves or kimono-inspired cuts</li>
          <li>Bold embroidery across the shoulders or hemline</li>
        </ul>
        
        <h2 className="text-2xl font-serif mb-3 mt-8">For Curvy Silhouettes</h2>
        <p className="mb-6">
          Embrace your curves with abayas that define your waist and flow gracefully over hips. Look for:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Empire waistlines that highlight the narrowest part of your torso</li>
          <li>Soft, flowing fabrics like crepe or chiffon that drape beautifully</li>
          <li>Strategic embellishments that draw the eye to your favorite features</li>
          <li>Subtle A-line shapes that skim over the hips without clinging</li>
        </ul>
        
        <h2 className="text-2xl font-serif mb-3 mt-8">For Athletic Builds</h2>
        <p className="mb-6">
          If you have broader shoulders or a straighter figure, consider styles that create subtle curves:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Gathered waistlines or belted designs to define your midsection</li>
          <li>Butterfly sleeves that soften shoulder lines</li>
          <li>Layered or asymmetrical hems that add movement</li>
          <li>Feminine details like lace trim or gentle ruching</li>
        </ul>
        
        <h2 className="text-2xl font-serif mb-3 mt-8">Fabric Selection Matters</h2>
        <p className="mb-6">
          Beyond the cut, consider how different fabrics will complement your shape:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li><strong>Nida fabric:</strong> Lightweight and breathable, perfect for daily wear and warmer climates</li>
          <li><strong>Crepe:</strong> Offers a beautiful drape that flatters all body types</li>
          <li><strong>Georgette:</strong> Flowing and ethereal, ideal for creating movement</li>
          <li><strong>Silk blends:</strong> Luxurious for special occasions with a subtle sheen</li>
          <li><strong>Jersey:</strong> Comfortable with natural stretch, great for travel</li>
        </ul>
        
        <p className="mb-6">
          Remember that confidence is your best accessory. Whatever style you choose, wear it with pride and grace. 
          The right abaya should make you feel both comfortable and beautiful—a perfect harmony of modesty and 
          personal expression.
        </p>
        
        <p className="text-sm italic text-gray-600 mt-10">
          Looking for your perfect abaya? Explore our curated collection of designs for every body type and occasion.
        </p>
      </>
    ),
    imageUrl: blog1,
    date: "May 5, 2025",
    author: "Amira Hassan",
    readTime: "6 min read"
  }
};

const BlogDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = blogPosts[slug || ''];
  
  if (!post) {
    return <div>Blog post not found</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Back Button */}
          <div className="mb-6">
            <Link 
              to="/blog" 
              className="inline-flex items-center text-gray-600 hover:text-revive-red transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Back to Blog
            </Link>
          </div>
          
          {/* Blog Header */}
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="text-2xl md:text-4xl font-serif mb-6">{post.title}</h1>
            
            <div className="flex flex-wrap items-center text-gray-500 mb-6 gap-4">
              <div className="flex items-center">
                <Calendar size={16} className="mr-2" />
                <span>{post.date}</span>
              </div>
              <div className="flex items-center">
                <User size={16} className="mr-2" />
                <span>{post.author}</span>
              </div>
              <div className="flex items-center">
                <Clock size={16} className="mr-2" />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
          
          {/* Featured Image */}
          <div className="max-w-4xl mx-auto mb-10">
            <div className="rounded-lg overflow-hidden h-72 md:h-96">
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          {/* Blog Content */}
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg max-w-none">
              {post.content}
            </div>
            
            {/* Share Links */}
            <div className="mt-12 pt-8 border-t">
              <div className="flex items-center">
                <span className="text-gray-600 mr-4">Share this article:</span>
                <div className="flex space-x-4">
                  <a href="#" className="text-gray-500 hover:text-revive-red transition-colors">
                    <Share2 size={18} />
                  </a>
                </div>
              </div>
            </div>
            
            {/* Related Posts Teaser */}
            <div className="mt-12 pt-8 border-t">
              <h3 className="text-xl font-serif mb-6">You might also like</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Link to="/blog/styling-unstitched-lawn" className="group">
                  <div className="bg-gray-50 p-4 rounded-lg transition-all group-hover:bg-gray-100">
                    <h4 className="font-medium group-hover:text-revive-red transition-colors">Styling Unstitched Lawn for Summer 2025</h4>
                    <p className="text-sm text-gray-600 mt-2">From tailoring tips to accessory pairings, learn how to make every unstitched suit uniquely yours.</p>
                  </div>
                </Link>
                <Link to="/blog/signature-dupatta-style" className="group">
                  <div className="bg-gray-50 p-4 rounded-lg transition-all group-hover:bg-gray-100">
                    <h4 className="font-medium group-hover:text-revive-red transition-colors">Why Every Woman Needs a Signature Dupatta</h4>
                    <p className="text-sm text-gray-600 mt-2">Discover the cultural charm and styling power of a statement dupatta — and how to wear it five modern ways.</p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetail;
