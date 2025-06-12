
import React from 'react';
import { ArrowRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import {blog1, blog3, blog2} from '../assets/assets.js'

interface BlogPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  link: string;
}

const BlogPost: React.FC<BlogPostProps> = ({ title, excerpt, imageUrl, date, author, link }) => {
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
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <Calendar size={14} className="mr-1" />
          <span>{date} by {author}</span>
        </div>
        <h3 className="text-xl font-serif mb-3 group-hover:text-revive-red transition-colors">{title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{excerpt}</p>
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

const BlogPreview = () => {
  const blogPosts = [
    {
      title: "How to Choose the Right Abaya for Your Body Type",
      excerpt: "A guide to flattering fits, trending cuts, and how to style your abaya with ease — so you always feel confident and covered.",
      imageUrl: blog1,
      date: "May 5, 2025",
      author: "Amira Hassan",
      link: "/blog/choose-right-abaya"
    },
    {
      title: "Styling Unstitched Lawn for Summer 2025",
      excerpt: "From tailoring tips to accessory pairings, learn how to make every unstitched suit uniquely yours.",
      imageUrl: blog2,
      date: "May 2, 2025",
      author: "Zara Ahmed",
      link: "/blog/styling-unstitched-lawn"
    },
    {
      title: "Why Every Woman Needs a Signature Dupatta",
      excerpt: "Discover the cultural charm and styling power of a statement dupatta — and how to wear it five modern ways.",
      imageUrl: blog3,
      date: "April 28, 2025",
      author: "Priya Sharma",
      link: "/blog/signature-dupatta-style"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif mb-4">From Our Blog</h2>
          <div className="w-24 h-1 bg-revive-red mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Fashion insights, style guides, and behind-the-scenes glimpses into our world of elegance.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <BlogPost key={index} {...post} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/blog" className="btn-outline inline-block">
            View All Articles
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
