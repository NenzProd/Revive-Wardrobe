
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blog1, blog2, blog3 } from '../assets/assets.js';

interface BlogPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  link: string;
  category: string;
}

const blogPosts = [
  {
    title: "How to Choose the Right Abaya for Your Body Type",
    excerpt: "A guide to flattering fits, trending cuts, and how to style your abaya with ease — so you always feel confident and covered.",
    imageUrl: blog1,
    date: "May 5, 2025",
    author: "Amira Hassan",
    link: "/blog/choose-right-abaya",
    category: "Style Guide"
  },
  {
    title: "Styling Unstitched Lawn for Summer 2025",
    excerpt: "From tailoring tips to accessory pairings, learn how to make every unstitched suit uniquely yours.",
    imageUrl: blog2,
    date: "May 2, 2025",
    author: "Zara Ahmed",
    link: "/blog/styling-unstitched-lawn",
    category: "Summer Fashion"
  },
  {
    title: "Why Every Woman Needs a Signature Dupatta",
    excerpt: "Discover the cultural charm and styling power of a statement dupatta — and how to wear it five modern ways.",
    imageUrl: blog3,
    date: "April 28, 2025",
    author: "Priya Sharma",
    link: "/blog/signature-dupatta-style",
    category: "Accessories"
  },
  {
    title: "Timeless Elegance: Traditional Wear for Modern Women",
    excerpt: "Exploring how contemporary fashionistas are embracing cultural roots while adding their unique modern twist.",
    imageUrl: blog2,
    date: "April 22, 2025",
    author: "Farah Khan",
    link: "/blog/traditional-wear-modern-women",
    category: "Fashion Trends"
  },
  {
    title: "Caring for Your Premium Textiles: A Complete Guide",
    excerpt: "Expert tips on washing, storing and maintaining luxury fabrics to ensure your favorite pieces last for years.",
    imageUrl: blog1,
    date: "April 18, 2025",
    author: "Leila Mahmood",
    link: "/blog/caring-premium-textiles",
    category: "Fabric Care"
  },
  {
    title: "The Art of Layering: Creating Dimension in Modest Fashion",
    excerpt: "Master the technique of layering different pieces to create depth, interest, and personal style in your modest wardrobe.",
    imageUrl: blog3,
    date: "April 15, 2025",
    author: "Nadia Rahman",
    link: "/blog/art-of-layering",
    category: "Styling Tips"
  }
];

const BlogPost: React.FC<BlogPostProps> = ({ title, excerpt, imageUrl, date, author, link, category }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="h-56 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <div className="p-6">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs mb-3">{category}</span>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{date} by {author}</span>
        </div>
        <h3 className="text-xl font-serif mb-3 group-hover:text-revive-red transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{excerpt}</p>
        <Link 
          to={link} 
          className="inline-flex items-center text-revive-red hover:text-revive-black transition-colors"
        >
          Read More <ArrowRight size={16} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

const BlogList = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-20 md:pt-28 pb-16">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-serif mb-4">Our Blog</h1>
            <div className="w-24 h-1 bg-revive-red mx-auto"></div>
            <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
              Fashion insights, style guides, and behind-the-scenes glimpses into our world of elegance.
            </p>
          </div>
          
          {/* Search Bar */}
          <div className="max-w-md mx-auto mb-12">
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                className="w-full border border-gray-300 rounded-full py-3 px-6 pr-12 focus:outline-none focus:ring-1 focus:ring-revive-red focus:border-revive-red"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-revive-red transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>
          
          {/* Blog Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <BlogPost key={index} {...post} />
            ))}
          </div>
          
          {/* Pagination */}
          <div className="flex justify-center mt-12">
            <div className="flex space-x-2">
              <span className="w-10 h-10 flex items-center justify-center bg-revive-red text-white rounded-full cursor-pointer">1</span>
              <span className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer">2</span>
              <span className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 rounded-full cursor-pointer">3</span>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
