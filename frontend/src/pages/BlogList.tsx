import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ArrowRight, Calendar, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const backendUrl = import.meta.env.VITE_BACKEND_URL

interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  author: string;
  slug: string;
  category: string;
}

interface BlogPostProps {
  title: string;
  excerpt: string;
  imageUrl: string;
  date: string;
  author: string;
  link: string;
  category: string;
}

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
  const [blogs, setBlogs] = useState<BlogPostProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(handler)
  }, [search])

  useEffect(() => {
    async function fetchBlogs() {
      setLoading(true);
      setError('');
      try {
        const res = await fetch(backendUrl + '/api/blog/list');
        if (!res.ok) {
          setError('Failed to load blogs (server error)');
          setLoading(false);
          return;
        }
        const data: { success: boolean; blogs: Blog[]; message?: string } = await res.json();
        if (data.success) {
          setBlogs(
            data.blogs.map((b) => ({
              title: b.title,
              excerpt: b.excerpt,
              imageUrl: b.image,
              date: new Date(b.date).toLocaleDateString(),
              author: b.author,
              link: `/blog/${b.slug}`,
              category: b.category
            }))
          );
        } else {
          setError(data.message || 'Failed to load blogs');
        }
      } catch (err) {
        setError('Could not connect to blog API. Check your backend URL and CORS.');
      }
      setLoading(false);
    }
    fetchBlogs();
  }, []);

  const filteredBlogs = blogs.filter(blog => {
    const q = debouncedSearch.toLowerCase();
    return (
      blog.title.toLowerCase().includes(q) ||
      blog.excerpt.toLowerCase().includes(q) ||
      blog.author.toLowerCase().includes(q)
    );
  });

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
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-revive-red transition-colors" disabled>
                <Search size={18} />
              </button>
            </div>
          </div>
          {/* Blog Posts Grid */}
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading blogs...</div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">{error}</div>
          ) : filteredBlogs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No blogs found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((post, index) => (
                <BlogPost key={index} {...post} />
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default BlogList;
